import cv2
import numpy as np

def analyze_land_usage(image_path):
    """Accurate HSV segmentation tuned strictly for arid and concrete dominant environments."""
    img = cv2.imread(image_path)

    if img is None:
        return {"error": "Unable to read image. Check file format."}

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    h, w, _ = img.shape
    total_pixels = h * w

    # 1. Existing Green (Foliage, shadows on grass)
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)
    green_pixels = np.sum(green_mask == 255)

    # 2. Buildings & Concrete Highways (Very low saturation, high brightness)
    lower_building = np.array([0, 0, 130])
    upper_building = np.array([180, 35, 255])
    building_mask = cv2.inRange(hsv, lower_building, upper_building)
    building_pixels = np.sum(building_mask == 255)

    # 3. Roads, Asphalt, & Heavy Shadows (Low saturation, low brightness)
    lower_road = np.array([0, 0, 0])
    upper_road = np.array([180, 50, 100])
    road_mask = cv2.inRange(hsv, lower_road, upper_road)
    road_pixels = np.sum(road_mask == 255)

    # 4. Open Land (Beige, Dirt, Sand) 
    # Strict Hue boundary to prevent classifying grey highways as dirt.
    lower_open = np.array([10, 25, 90])  
    upper_open = np.array([35, 180, 240])
    open_mask = cv2.inRange(hsv, lower_open, upper_open)
    
    # Clean overlap logic
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(building_mask))
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(road_mask))
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(green_mask))
    open_pixels = np.sum(open_mask == 255)

    return {
        "building_percentage": round((building_pixels / total_pixels) * 100, 2),
        "road_percentage": round((road_pixels / total_pixels) * 100, 2),
        "open_land_percentage": round((open_pixels / total_pixels) * 100, 2),
        "green_percentage": round((green_pixels / total_pixels) * 100, 2),
        "total_pixels": total_pixels
    }

