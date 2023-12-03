from pathlib import Path
import numpy as np
import argparse
import time
import os
import torch.backends.cudnn as cudnn
import torch
import cv2
from emotion import detect_emotion, init  # Your emotion detection module
from models.experimental import attempt_load
from utils.datasets import LoadStreams
from utils.general import check_img_size, check_requirements, non_max_suppression, scale_coords, set_logging
from utils.torch_utils import select_device, time_synchronized
from PIL import Image, ImageDraw, ImageFont
from datetime import datetime
from pymongo import MongoClient
import threading

# Define emotions
emotions = ("anger", "contempt", "disgust", "fear", "happy", "neutral", "sad", "surprise")

# Define a simple create_folder function
def create_folder(folder_path):
    if not os.path.exists(folder_path):
        os.makedirs(folder_path)

# Define a function to print the emotion summary with advertisement details
def print_emotion_summary(emotion_counts, ad_data, collection, camera_id):
    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    ad_id = ad_data['_id']
    ad_title = ad_data['title']

    print(f"Camera {camera_id}: Advertisement ID: {ad_id}")
    print(f"Camera {camera_id}: Advertisement Title: {ad_title}")

    print(f"\nCamera {camera_id}: Emotion Counts (Summary at {current_time}):")
    for emotion, count in emotion_counts.items():
        print(f"Camera {camera_id}: {emotion}: {count} detected", end=", ")
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

# Function to check if it's time for an ad and return the ad's data
def get_advertisement_data(collection):
    current_time = datetime.now()
    ad_data_list = list(collection.find(
        {
            'scheduleDateTime': {
                '$lte': current_time
            },
            'endScheduleDateTime': {
                '$gte': current_time
            }
        }
    ))

    if ad_data_list:
        ad_data = ad_data_list[0]
        return ad_data
    else:
        return None

# Function to print emotion count data after the end time
def print_emotion_count_after_end(emotion_counts, end_time, collection, ad_id, ad_title, camera_id):
    while True:
        current_time = datetime.now()
        if current_time > end_time:
            print(f"Camera {camera_id}: Emotion Counts (After End Time):")
            for emotion, count in emotion_counts.items():
                print(f"Camera {camera_id}: {emotion}: {count} detected", end=", ")
            print("")

            # Send emotion count data to MongoDB
            send_emotion_counts_to_mongodb(
                emotion_counts, ad_id, ad_title, collection)
            break
        time.sleep(1)

# Function to process each camera's feed
def process_camera(camera_id, source, imgsz, opt, device, model, emotions, mongo_db, mongo_collection, stride, show_conf=False):

    streams = LoadStreams(source, img_size=imgsz, stride=stride)
    camera_emotion_counts = {emotion: 0 for emotion in emotions}
    ad_data = None

    for path, img, im0s, vid_cap in streams:
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
                    # ... (previous code remains unchanged)

                    if images:  # Make sure 'images' is defined
                        detected_emotions = detect_emotion(images)

                        for emotion, confidence in detected_emotions:
                            emotion = emotion.split(" ")[0]
                            camera_emotion_counts[emotion] += 1
                            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                            print(
                                f"Camera {camera_id}: Face Emotion Detection {i + 1} at {current_time}: {emotion} ({confidence * 10:.2f}% confidence)")

                            emotion_text = f"{emotion} ({confidence * 100:.2f}%)"
                            font = ImageFont.load_default()
                            draw = ImageDraw.Draw(Image.fromarray(im0))
                            text_size = draw.textbbox(
                                (0, 0), emotion_text, font=font)
                            text_position = (
                                int(det[0]), int(det[1] - text_size[1] - 5))
                            draw.text(text_position, emotion_text,
                                      fill=(255, 0, 0), font=font)
                            im0 = np.array(im0)

                if opt.show_fps:
                    current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                    print(
                        f"Camera {camera_id}: FPS at {current_time}: {1 / (time.time() - t0):.2f}" + " " * 5, end="\r")
                    t0 = time.time()

            else:
                current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
                print(f"Camera {camera_id}: Advertisement '{ad_title}' at {current_time}.")

                # Wait for the end time and print emotion count data
                current_time = datetime.now()
                if current_time > end_date_time:
                    print_emotion_summary(
                        camera_emotion_counts, ad_data, mongo_collection, camera_id)  # Use source (camera URL) as camera_id
                    ad_data = None  # Reset ad data to None
                    camera_emotion_counts = {emotion: 0 for emotion in emotions}  # Reset emotion counts

        else:
            current_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
            print(f"Camera {camera_id}: No available ad at {current_time}.")

    cv2.destroyAllWindows()

if _name_ == '_main_':
    parser = argparse.ArgumentParser()

    parser.add_argument('--img-size', type=int, default=512,
                        help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float,
                        default=0.5, help='face confidence threshold')
    parser.add_argument('--iou-thres', type=float,
                        default=0.45, help='IOU threshold for NMS')
    parser.add_argument('--device', default='',
                        help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--hide-img', action='store_true', help='hide results')
    parser.add_argument('--output-path', default="output",
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

    create_folder(opt.output_path)
    set_logging()
    device = select_device(opt.device)
    init(device)
    half = device.type != 'cpu'

    model = attempt_load("weights/yolov7-tiny.pt", map_location=device)
    stride = int(model.stride.max())
    imgsz = check_img_size(opt.img_size, s=stride)
    if half:
        model.half()

    # Replace with your MongoDB Atlas connection string
    mongo_uri = "mongodb+srv://root:root@cluster0.zy96vnm.mongodb.net/?retryWrites=true&w=majority"
    mongo_client = MongoClient(mongo_uri)

    # Replace with your database name
    mongo_db = mongo_client['test']

    # Replace with your collection name
    mongo_collection = mongo_db['emotion_counts']

    datasets = []
    for camera_id, ad_data in enumerate(get_advertisement_data(mongo_db['adverticements']) or []):
        # Assuming there is a list of cameras within each advertisement
        for camera_info in ad_data.get('cameras', []):
            ip = camera_info.get('ip', '')
            datasets.append((camera_id, ip, ad_data))

    threads = []
    for dataset in datasets:
        camera_id, ip, ad_data = dataset
        thread = threading.Thread(target=process_camera, args=(camera_id, ip, imgsz, opt, device, model, emotions, mongo_db, mongo_collection, stride))
        threads.append(thread)
        thread.start()

    for thread in threads:
        thread.join()

    # Close MongoDB client connection
    mongo_client.close()