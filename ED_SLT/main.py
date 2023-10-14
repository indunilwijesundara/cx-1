from pathlib import Path
import numpy as np
import argparse
import time
import os
import torch.backends.cudnn as cudnn
import torch
import cv2
from emotion import detect_emotion, init
from models.experimental import attempt_load
from utils.datasets import LoadStreams
from utils.general import check_img_size, check_requirements, non_max_suppression, scale_coords, set_logging, create_folder
from utils.torch_utils import select_device, time_synchronized
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
import threading
from pymongo import MongoClient

# Define emotions
emotions = ("anger", "contempt", "disgust", "fear",
            "happy", "neutral", "sad", "surprise")

# Define a function to print the emotion summary with advertisement details


def print_emotion_summary(emotion_counts, ad_data, collection):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ad_id = ad_data['_id']
    ad_title = ad_data['title']

    print(f"Advertisement ID: {ad_id}")
    print(f"Advertisement Title: {ad_title}")

    print(f"\nEmotion Counts (Summary at {current_time}):")
    for emotion, count in emotion_counts.items():
        print(f"{emotion}: {count} detected", end=", ")
    print("")

    # Send the emotion count data to MongoDB along with advertisement details
    send_emotion_counts_to_mongodb(emotion_counts, ad_id, ad_title, collection)

# Create a function to send emotion count data to MongoDB with advertisement details


def send_emotion_counts_to_mongodb(emotion_counts, ad_id, ad_title, collection):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    emotion_count_data = {
        'advertisement_id': ad_id,
        'advertisement_title': ad_title,
        'timestamp': current_time,
        'emotion_counts': emotion_counts
    }

    collection.insert_one(emotion_count_data)


# Replace with your MongoDB Atlas connection string
mongo_uri = "mongodb+srv://root:root@cluster0.zy96vnm.mongodb.net/?retryWrites=true&w=majority"
mongo_client = MongoClient(mongo_uri)

# Replace with your database name
mongo_db = mongo_client['test']

# Replace with your collection name
mongo_collection = mongo_db['emotion_counts']

# Function to check if it's time for an ad and return the ad's data


def get_advertisement_data(collection):
    current_time = datetime.now()
    ad_data = collection.find_one(
        {
            'scheduleDateTime': {
                '$lte': current_time
            },
            'endScheduleDateTime': {
                '$gte': current_time
            }
        }
    )

    if ad_data:
        return ad_data
    else:
        return None

# Function to print emotion count data after the end time


def print_emotion_count_after_end(emotion_counts, end_time, collection):
    while True:
        current_time = datetime.now()
        if current_time > end_time:
            print("Emotion Counts (After End Time):")
            for emotion, count in emotion_counts.items():
                print(f"{emotion}: {count} detected", end=", ")
            print("")

            # Send emotion count data to MongoDB
            send_emotion_counts_to_mongodb(
                emotion_counts, ad_id, ad_title, collection)
            break
        time.sleep(1)


def detect(opt):
    source, view_img, imgsz, nosave, show_conf, save_path, show_fps = opt.source, not opt.hide_img, opt.img_size, opt.no_save, not opt.hide_conf, opt.output_path, opt.show_fps

    create_folder(save_path)
    set_logging()
    device = select_device(opt.device)
    init(device)
    half = device.type != 'cpu'

    model = attempt_load("weights/yolov7-tiny.pt", map_location=device)
    stride = int(model.stride.max())
    imgsz = check_img_size(imgsz, s=stride)
    if half:
        model.half()

    dataset = LoadStreams(source, img_size=imgsz, stride=stride)
    names = model.module.names if hasattr(model, 'module') else model.names
    colors = (
        (0, 52, 255), (121, 3, 195), (176, 34, 118), (87, 217,
                                                      255), (69, 199, 79), (233, 219, 155), (203, 139, 77),
        (214, 246, 255))

    emotion_counts = {emotion: 0 for emotion in emotions}
    text_position = (0, 0)

    if device.type != 'cpu':
        model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(
            next(model.parameters())))
    t0 = time.time()
    ad_data = None  # Initialize ad data to None
    for path, img, im0s, vid_cap in dataset:
        if not ad_data:
            ad_data = get_advertisement_data(mongo_db['adverticements'])

        if ad_data:
            ad_id = ad_data['_id']
            ad_title = ad_data['title']
            start_date_time = ad_data.get('scheduleDateTime')
            end_date_time = ad_data.get('endScheduleDateTime')
            current_time = datetime.now()

            if start_date_time <= current_time <= end_date_time:
                img = torch.from_numpy(img).to(device)
                img = img.half() if half else img.float()
                img /= 255.0
                if img.ndimension() == 3:
                    img = img.unsqueeze(0)

                t1 = time_synchronized()
                pred = model(img, augment=opt.augment)[0]

                pred = non_max_suppression(
                    pred, opt.conf_thres, opt.iou_thres, agnostic=opt.agnostic_nms)
                t2 = time_synchronized()

                for i, det in enumerate(pred):
                    p, s, im0, frame = path[i], '%g: ' % i, im0s[i].copy(
                    ), dataset.count
                    p = Path(p)
                    s += '%gx%g ' % img.shape[2:]
                    gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]
                    if len(det):
                        images = []
                        detected_emotions = []

                        for *xyxy, conf, cls in reversed(det):
                            x1, y1, x2, y2 = xyxy[0], xyxy[1], xyxy[2], xyxy[3]
                            face_image = im0.astype(
                                np.uint8)[int(y1):int(y2), int(x1):int(x2)]
                            images.append(face_image)

                        if images:
                            detected_emotions = detect_emotion(
                                images, show_conf)

                            for emotion, confidence in detected_emotions:
                                emotion = emotion.split(" ")[0]
                                emotion_counts[emotion] += 1
                                current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                                print(
                                    f"Face Emotion Detection {i + 1} at {current_time}: {emotion} ({confidence * 10:.2f}% confidence)")

                                emotion_text = f"{emotion} ({confidence * 100:.2f}%)"
                                font = ImageFont.load_default()
                                draw = ImageDraw.Draw(Image.fromarray(im0))
                                text_size = draw.textbbox(
                                    text_position, emotion_text, font=font)
                                text_position = (
                                    int(x1), int(y1 - text_size[1] - 5))
                                draw.text(text_position, emotion_text,
                                          fill=(255, 0, 0), font=font)
                                im0 = np.array(im0)

                if view_img:
                    display_img = cv2.resize(
                        im0, (im0.shape[1] * 2, im0.shape[0] * 2))
                    cv2.imshow("Emotion Detection", display_img)
                    cv2.waitKey(1)

                if show_fps:
                    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    print(
                        f"FPS at {current_time}: {1 / (time.time() - t0):.2f}" + " " * 5, end="\r")
                    t0 = time.time()
            else:
                current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"Advertisement '{ad_title}' at {current_time}.")

                # Wait for the end time and print emotion count data
                current_time = datetime.now()
                if current_time > end_date_time:
                    print_emotion_summary(
                        emotion_counts, ad_data, mongo_collection)
                    ad_data = None  # Reset ad data to None
        else:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"No available ad at {current_time}.")


if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=str, default='0',
                        help='source; 0 for webcam, or provide the path to a video file')
    parser.add_argument('--img-size', type=int, default=512,
                        help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float,
                        default=0.5, help='face confidence threshold')
    parser.add_argument('--iou-thres', type=float,
                        default=0.45, help='IOU threshold for NMS')
    parser.add_argument('--device', default='',
                        help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--hide-img', action='store_true', help='hide results')
    parser.add_argument('--output-path', default="output1.mp4",
                        help='path to save the output video')
    parser.add_argument('--no-save', action='store_true',
                        help='do not save images/videos')
    parser.add_argument('--output-width', type=int,
                        default=1500, help='output video width')
    parser.add_argument('--output-height', type=int,
                        default=1000, help='output video height')
    parser.add_argument('--agnostic-nms', action='store_true',
                        help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true',
                        help='augmented inference')
    parser.add_argument('--line-thickness', default=2,
                        type=int, help='bounding box thickness (pixels)')
    parser.add_argument('--hide-conf', default=False,
                        action='store_true', help='hide confidences')
    parser.add_argument('--show-fps', default=False,
                        action='store_true', help='print fps to console')
    opt = parser.parse_args()
    check_requirements(exclude=('pycocotools', 'thop'))

    with torch.no_grad():
        detect(opt=opt)

    # Close MongoDB client connection
    mongo_client.close()
