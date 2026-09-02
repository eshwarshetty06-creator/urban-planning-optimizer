import cv2
import numpy as np
from pathlib import Path

def generate_heatmap(image_path, file_id="heatmap"):
    """Generate accurate urban heatmap based on land usage patterns."""
    img = cv2.imread(image_path)

    if img is None:
        return {"error": "Unable to load image"}

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    height, width, _ = img.shape
    total_pixels = height * width

    # ------------------------------
    # 1️⃣ Green Areas (cooling effect) - Improved detection
    # ------------------------------
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)

    # ------------------------------
    # 2️⃣ Building Areas (heat effect) - Buildings and Light Concrete Highways
    # ------------------------------
    lower_building = np.array([0, 0, 130])
    upper_building = np.array([180, 35, 255])
    building_mask = cv2.inRange(hsv, lower_building, upper_building)

    # ------------------------------
    # 3️⃣ Roads (moderate heat) - Dark asphalt and dark shadows
    # ------------------------------
    lower_road = np.array([0, 0, 0])
    upper_road = np.array([180, 50, 100])
    road_mask = cv2.inRange(hsv, lower_road, upper_road)

    # ------------------------------
    # 4️⃣ Open Land (slight heat, but can be cooled) - Beige, Dirt, Sand
    # ------------------------------
    lower_open = np.array([10, 25, 90])
    upper_open = np.array([35, 180, 240])
    open_mask = cv2.inRange(hsv, lower_open, upper_open)
    
    # Remove overlap
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(building_mask))
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(road_mask))
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(green_mask))

    # ------------------------------
    # 5️⃣ Create heat intensity map with more accurate values
    # ------------------------------
    heat_map = np.zeros((height, width), dtype=np.float32)

    # Buildings → High heat (+5)
    heat_map[building_mask == 255] += 5.0

    # Roads → Moderate heat (+2)
    heat_map[road_mask == 255] += 2.0

    # Open land → Slight heat (+1)
    heat_map[open_mask == 255] += 1.0

    # Green areas → Strong cooling (-4)
    heat_map[green_mask == 255] -= 4.0

    # Apply Gaussian blur for smoother heat distribution
    heat_map = cv2.GaussianBlur(heat_map, (15, 15), 0)

    # Normalize heatmap to 0–255
    heat_map_normalized = cv2.normalize(
        heat_map, None, 0, 255, cv2.NORM_MINMAX
    ).astype(np.uint8)

    # Apply color map (JET: blue=cool, red=hot)
    colored_heatmap = cv2.applyColorMap(heat_map_normalized, cv2.COLORMAP_JET)

    # Overlay original image with transparency for better visualization
    overlay = colored_heatmap.copy()
    alpha = 0.6  # Transparency factor
    result = cv2.addWeighted(img, 1 - alpha, overlay, alpha, 0)

    # Save output (use absolute path under app/processed)
    base_dir = Path(__file__).resolve().parent.parent  # .../app
    processed_dir = base_dir / "processed"
    processed_dir.mkdir(exist_ok=True)

    output_filename = f"{file_id}_heatmap.png"
    output_path = processed_dir / output_filename
    cv2.imwrite(str(output_path), result)

    # Calculate statistics
    hot_areas = np.sum(heat_map_normalized > 200)  # Very hot areas
    cool_areas = np.sum(heat_map_normalized < 50)  # Cool areas
    hot_percent = (hot_areas / total_pixels) * 100
    cool_percent = (cool_areas / total_pixels) * 100

    return {
        # Relative path used by frontend via StaticFiles mount
        "heatmap_path": f"processed/{output_filename}",
        "hot_areas_percent": round(hot_percent, 2),
        "cool_areas_percent": round(cool_percent, 2),
        "average_heat": round(np.mean(heat_map_normalized), 2)
    }
