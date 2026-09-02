import cv2
import numpy as np

def detect_green_areas(image_path):
    img = cv2.imread(image_path)

    if img is None:
        return {"error": "Unable to read image. Check file format."}

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # green range
    lower_green = np.array([36, 25, 25])
    upper_green = np.array([86, 255, 255])

    mask = cv2.inRange(hsv, lower_green, upper_green)

    green_pixels = np.sum(mask == 255)
    total_pixels = mask.size

    green_percentage = round((green_pixels / total_pixels) * 100, 2)

    return {
        "green_percentage": green_percentage
    }
