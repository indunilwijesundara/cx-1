from pathlib import Path
import numpy as np
import argparse
import time
import os
import torch.backends.cudnn as cudnn
import torch
import cv2
<<<<<<< HEAD
from emotion import detect_emotion, init  # Import detect_emotion from your emotion module
from models.experimental import attempt_load
from utils.datasets import LoadStreams
from utils.general import check_img_size, check_requirements, non_max_suppression, scale_coords, set_logging, create_folder
from utils.plots import plot_one_box
from utils.torch_utils import select_device, time_synchronized
from PIL import Image, ImageDraw, ImageFont

# Define emotions
emotions = ("anger", "contempt", "disgust", "fear", "happy", "neutral", "sad", "surprise")
=======
# Import detect_emotion from your emotion module
from emotion import detect_emotion, init
from models.experimental import attempt_load
from utils.datasets import LoadStreams
from utils.general import check_img_size, check_requirements, non_max_suppression, scale_coords, set_logging, create_folder
from utils.torch_utils import select_device, time_synchronized
from PIL import Image, ImageDraw, ImageFont
import threading  # Import the threading module
from pymongo import MongoClient

# Define emotions
emotions = ("anger", "contempt", "disgust", "fear",
            "happy", "neutral", "sad", "surprise")

# Define a function to print the emotion summary


def print_emotion_summary(emotion_counts, collection):
    while True:
        time.sleep(30)  # Sleep for 30 seconds
        print("\nEmotion Counts (Summary after 30 seconds):")
        for emotion, count in emotion_counts.items():
            print(f"{emotion}: {count} detected", end=", ")
        print("")  # Print a newline to separate the output

        # Send the emotion count data to MongoDB
        send_emotion_counts_to_mongodb(emotion_counts, collection)

# Create a function to send emotion count data to MongoDB


def send_emotion_counts_to_mongodb(emotion_counts, collection):
    # Create a document to store the emotion counts
    emotion_count_data = {
        'timestamp': int(time.time()),  # You can add a timestamp if needed
        'emotion_counts': emotion_counts
    }

    # Insert the data into MongoDB
    collection.insert_one(emotion_count_data)


# Replace with your MongoDB Atlas connection string
mongo_uri = "mongodb+srv://root:root@cluster0.zy96vnm.mongodb.net/?retryWrites=true&w=majority"
mongo_client = MongoClient(mongo_uri)

# Replace with your database name
mongo_db = mongo_client['test']
# Replace with your collection name
mongo_collection = mongo_db['emotion_counts']

>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb

def detect(opt):
    source, view_img, imgsz, nosave, show_conf, save_path, show_fps = opt.source, not opt.hide_img, opt.img_size, opt.no_save, not opt.hide_conf, opt.output_path, opt.show_fps

    # Directories
    create_folder(save_path)

    # Initialize
    set_logging()
    device = select_device(opt.device)
    init(device)
    half = device.type != 'cpu'  # half precision only supported on CUDA

    # Load model
<<<<<<< HEAD
    model = attempt_load("weights/yolov7-tiny.pt", map_location=device)  # Load your YOLOv7 model weights
=======
    # Load your YOLOv7 model weights
    model = attempt_load("weights/yolov7-tiny.pt", map_location=device)
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
    stride = int(model.stride.max())  # model stride
    imgsz = check_img_size(imgsz, s=stride)  # Check img_size
    if half:
        model.half()  # to FP16

    # Set Dataloader
    dataset = LoadStreams(source, img_size=imgsz, stride=stride)

    # Get names and colors
    names = model.module.names if hasattr(model, 'module') else model.names
    colors = (
<<<<<<< HEAD
        (0, 52, 255), (121, 3, 195), (176, 34, 118), (87, 217, 255), (69, 199, 79), (233, 219, 155), (203, 139, 77),
=======
        (0, 52, 255), (121, 3, 195), (176, 34, 118), (87, 217,
                                                      255), (69, 199, 79), (233, 219, 155), (203, 139, 77),
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
        (214, 246, 255))

    # Initialize emotion counters
    emotion_counts = {emotion: 0 for emotion in emotions}

<<<<<<< HEAD
    # Start time for advertisement timer
=======
    # Start time for FPS calculation
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
    start_time = time.time()

    # Initialize text_position
    text_position = (0, 0)

<<<<<<< HEAD
    # Run inference
    if device.type != 'cpu':
        model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(next(model.parameters())))  # Run once
=======
    # Start the emotion summary printing thread
    emotion_summary_thread = threading.Thread(
        target=print_emotion_summary, args=(emotion_counts, mongo_collection))
    # Make the thread a daemon so it exits when the main program exits
    emotion_summary_thread.daemon = True
    emotion_summary_thread.start()

    # Run inference
    if device.type != 'cpu':
        model(torch.zeros(1, 3, imgsz, imgsz).to(device).type_as(
            next(model.parameters())))  # Run once
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
    t0 = time.time()
    for path, img, im0s, vid_cap in dataset:
        img = torch.from_numpy(img).to(device)
        img = img.half() if half else img.float()  # uint8 to fp16/32
        img /= 255.0  # 0 - 255 to 0.0 - 1.0
        if img.ndimension() == 3:
            img = img.unsqueeze(0)

        # Inference
        t1 = time_synchronized()
        pred = model(img, augment=opt.augment)[0]

        # Apply NMS
<<<<<<< HEAD
        pred = non_max_suppression(pred, opt.conf_thres, opt.iou_thres, agnostic=opt.agnostic_nms)
=======
        pred = non_max_suppression(
            pred, opt.conf_thres, opt.iou_thres, agnostic=opt.agnostic_nms)
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
        t2 = time_synchronized()

        # Process detections
        for i, det in enumerate(pred):  # detections per image
<<<<<<< HEAD
            p, s, im0, frame = path[i], '%g: ' % i, im0s[i].copy(), dataset.count
            p = Path(p)  # to Path
            s += '%gx%g ' % img.shape[2:]  # print string
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]  # normalization gain whwh
=======
            p, s, im0, frame = path[i], '%g: ' % i, im0s[i].copy(
            ), dataset.count
            p = Path(p)  # to Path
            s += '%gx%g ' % img.shape[2:]  # print string
            # normalization gain whwh
            gn = torch.tensor(im0.shape)[[1, 0, 1, 0]]
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
            if len(det):
                images = []

                detected_emotions = []  # List to store detected emotions for this frame

                for *xyxy, conf, cls in reversed(det):
                    x1, y1, x2, y2 = xyxy[0], xyxy[1], xyxy[2], xyxy[3]
<<<<<<< HEAD
                    face_image = im0.astype(np.uint8)[int(y1):int(y2), int(x1):int(x2)]
=======
                    face_image = im0.astype(
                        np.uint8)[int(y1):int(y2), int(x1):int(x2)]
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
                    images.append(face_image)

                if images:
                    detected_emotions = detect_emotion(images, show_conf)

                    # Count emotions and print
                    for emotion, confidence in detected_emotions:
                        # Remove the percentage value from the emotion string
                        emotion = emotion.split(" ")[0]
<<<<<<< HEAD
                        emotion_counts[emotion] += 1  # Increment the count for this emotion
                        print(f"Face Emotion Detection {i + 1}: {emotion} ({confidence * 10:.2f}% confidence)")
=======
                        # Increment the count for this emotion
                        emotion_counts[emotion] += 1
                        print(
                            f"Face Emotion Detection {i + 1}: {emotion} ({confidence * 10:.2f}% confidence)")
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb

                        # Display the detected emotion on the image
                        emotion_text = f"{emotion} ({confidence * 100:.2f}%)"
                        font = ImageFont.load_default()
                        draw = ImageDraw.Draw(Image.fromarray(im0))
<<<<<<< HEAD
                        text_size = draw.textbbox(text_position, emotion_text, font=font)
                        text_position = (int(x1), int(y1 - text_size[1] - 5))
                        draw.text(text_position, emotion_text, fill=(255, 0, 0), font=font)
=======
                        text_size = draw.textbbox(
                            text_position, emotion_text, font=font)
                        text_position = (int(x1), int(y1 - text_size[1] - 5))
                        draw.text(text_position, emotion_text,
                                  fill=(255, 0, 0), font=font)
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
                        im0 = np.array(im0)

            # Stream results
            if view_img:
<<<<<<< HEAD
                display_img = cv2.resize(im0, (im0.shape[1] * 2, im0.shape[0] * 2))
                cv2.imshow("Emotion Detection", display_img)
                cv2.waitKey(1)  # 1 millisecond

        if show_fps:
            # calculate and display fps
            print(f"FPS: {1 / (time.time() - t0):.2f}" + " " * 5, end="\r")
            t0 = time.time()

        # Check for advertisement timeout
        if time.time() - start_time >= 30:
            print("Advertisement time expired.")
            break

    # Print emotion summary
    print("Emotion Counts:")
    for emotion, count in emotion_counts.items():
        print(f"{emotion}: {count} detected")
    # Find the most detected emotion
    most_detected_emotion = max(emotion_counts, key=emotion_counts.get)

    # Print the most detected emotion
    print(f"Most detected emotion: {most_detected_emotion} ({emotion_counts[most_detected_emotion]} times)")
=======
                display_img = cv2.resize(
                    im0, (im0.shape[1] * 2, im0.shape[0] * 2))
                cv2.imshow("Emotion Detection", display_img)
                cv2.waitKey(1)  # 1 millisecond

            if show_fps:
                # calculate and display fps
                print(f"FPS: {1 / (time.time() - t0):.2f}" + " " * 5, end="\r")
                t0 = time.time()

>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb

if __name__ == '__main__':
    parser = argparse.ArgumentParser()
    parser.add_argument('--source', type=str, default='0',
                        help='source; 0 for webcam, or provide the path to a video file')
<<<<<<< HEAD
    parser.add_argument('--img-size', type=int, default=512, help='inference size (pixels)')
    parser.add_argument('--conf-thres', type=float, default=0.5, help='face confidence threshold')
    parser.add_argument('--iou-thres', type=float, default=0.45, help='IOU threshold for NMS')
    parser.add_argument('--device', default='', help='cuda device, i.e. 0 or 0,1,2,3 or cpu')
    parser.add_argument('--hide-img', action='store_true', help='hide results')
    parser.add_argument('--output-path', default="output1.mp4", help='path to save the output video')
    parser.add_argument('--no-save', action='store_true', help='do not save images/videos')
    parser.add_argument('--output-width', type=int, default=1500, help='output video width')
    parser.add_argument('--output-height', type=int, default=1000, help='output video height')
    parser.add_argument('--agnostic-nms', action='store_true', help='class-agnostic NMS')
    parser.add_argument('--augment', action='store_true', help='augmented inference')
    parser.add_argument('--line-thickness', default=2, type=int, help='bounding box thickness (pixels)')
    parser.add_argument('--hide-conf', default=False, action='store_true', help='hide confidences')
    parser.add_argument('--show-fps', default=False, action='store_true', help='print fps to console')
    opt = parser.parse_args()
    check_requirements(exclude=('pycocotools', 'thop'))
    with torch.no_grad():
        detect(opt=opt)
=======
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
>>>>>>> 0fdbc8ed54c34970cced1addde03620f00e939eb
