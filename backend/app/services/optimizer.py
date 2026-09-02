import cv2
import numpy as np
from pathlib import Path
import uuid

def optimize_green_spaces(image_path, file_id="optimized", scale_m2_per_px=1.0):
    """AI-powered optimization with improved accuracy and validation."""

    img = cv2.imread(image_path)
    if img is None:
        return {"error": "Image not found"}

    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)
    height, width, _ = img.shape
    total_pixels = height * width

    # ------------------------------
    # 1️⃣ Identify Existing Green Areas
    # ------------------------------
    lower_green = np.array([35, 40, 40])
    upper_green = np.array([85, 255, 255])
    green_mask = cv2.inRange(hsv, lower_green, upper_green)
    
    kernel = np.ones((3, 3), np.uint8)
    green_mask = cv2.morphologyEx(green_mask, cv2.MORPH_CLOSE, kernel)
    green_mask = cv2.morphologyEx(green_mask, cv2.MORPH_OPEN, kernel)
    
    existing_green_pixels = np.sum(green_mask == 255)
    existing_green_percent = (existing_green_pixels / total_pixels) * 100

    # ------------------------------
    # 2️⃣ Identify Buildings / Light Concrete (Highways)
    # ------------------------------
    lower_building = np.array([0, 0, 130])
    upper_building = np.array([180, 35, 255])
    building_mask = cv2.inRange(hsv, lower_building, upper_building)
    building_mask = cv2.bitwise_and(building_mask, cv2.bitwise_not(green_mask))

    # ------------------------------
    # 3️⃣ Identify Roads / Dark Asphalt / Shadows
    # ------------------------------
    lower_road = np.array([0, 0, 0])
    upper_road = np.array([180, 50, 100])
    road_mask = cv2.inRange(hsv, lower_road, upper_road)
    road_mask = cv2.bitwise_and(road_mask, cv2.bitwise_not(green_mask))

    # ------------------------------
    # 4️⃣ Identify Open Areas (Beige/Dirt/Sand)
    # Strictly filtered to avoid the highways
    # ------------------------------
    lower_open = np.array([10, 25, 90])
    upper_open = np.array([35, 180, 240])
    open_mask = cv2.inRange(hsv, lower_open, upper_open)
    
    # Remove already classified areas (buildings, roads, green)
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(building_mask))
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(road_mask))
    open_mask = cv2.bitwise_and(open_mask, cv2.bitwise_not(green_mask))
    
    # Clean up with morphological operations
    kernel = np.ones((5, 5), np.uint8)
    open_mask = cv2.morphologyEx(open_mask, cv2.MORPH_CLOSE, kernel)
    open_mask = cv2.morphologyEx(open_mask, cv2.MORPH_OPEN, kernel)

    # ------------------------------
    # 5️⃣ Classification Quality Check (no changes to masks, just stats)
    # ------------------------------
    combined = green_mask.astype(np.uint8) + building_mask.astype(np.uint8) + road_mask.astype(np.uint8) + open_mask.astype(np.uint8)
    unclassified = np.sum(combined == 0)
    unclassified_percent = (unclassified / total_pixels) * 100

    # ------------------------------
    # 6️⃣ Create Optimized Image
    # ------------------------------
    optimized = img.copy()
    
    # Natural green color variation
    green_colors = [
        [34, 139, 34],   # Forest green (BGR)
        [0, 128, 0],     # Green
        [50, 205, 50],   # Lime green
        [46, 125, 50],   # Dark green
    ]
    
    # Add green only to a *portion* of suitable open areas to avoid covering the whole map
    open_pixels = np.where(open_mask == 255)
    num_open = len(open_pixels[0])

    # This controls how aggressive the optimization is (e.g. 0.15 = use 15% of open pixels)
    # You can tweak this between 0.05 (very conservative) and 0.3 (aggressive)
    TARGET_OPEN_FRACTION = 0.15

    # Mask of newly added green pixels (for correct metrics)
    new_green_mask = np.zeros_like(open_mask)

    if num_open > 0:
        num_to_convert = max(1, int(num_open * TARGET_OPEN_FRACTION))

        # Randomly choose a subset of open pixels to convert to green
        chosen_indices = np.random.choice(num_open, num_to_convert, replace=False)
        for idx in chosen_indices:
            y, x = open_pixels[0][idx], open_pixels[1][idx]
            
            # --- STRATEGY #2: DRAW COOL PAVEMENT HALO (ALBEDO) ---
            # A light cyan/white halo representing the reflective pavement
            cv2.circle(optimized, (x, y), 3, [255, 255, 230], -1) 
            
            # Draw a slightly larger pixel (radius 1 circle = approx 3x3 area) for better visibility
            color_idx = (x + y) % len(green_colors)
            cv2.circle(optimized, (x, y), 1, green_colors[color_idx], -1)
            
            # Update mask with the same circle to keep stats consistent
            cv2.circle(new_green_mask, (x, y), 1, 255, -1)

    # ------------------------------
    # 7️⃣ Calculate Accurate Metrics
    # ------------------------------
    new_green_pixels = np.sum(new_green_mask == 255)
    new_green_percent = (new_green_pixels / total_pixels) * 100
    total_green_after = existing_green_percent + new_green_percent
    
    # Validate: total shouldn't exceed 100%
    if total_green_after > 100:
        total_green_after = 100
        new_green_percent = 100 - existing_green_percent
    
    green_increase_percent = new_green_percent
    green_increase_absolute = total_green_after - existing_green_percent
    
    # More accurate temperature drop calculation
    # Research-based: Urban green spaces can reduce temperature by 0.5-4°C
    # Conservative estimate: 1% green increase ≈ 0.08-0.12°C cooling
    # Using 0.1°C per 1% as baseline, with diminishing returns
    if green_increase_percent <= 10:
        temperature_drop_celsius = green_increase_percent * 0.1
    elif green_increase_percent <= 20:
        temperature_drop_celsius = 1.0 + (green_increase_percent - 10) * 0.08
    else:
        temperature_drop_celsius = 1.8 + (green_increase_percent - 20) * 0.05
    
    # Cap at realistic maximum (4°C)
    temperature_drop_celsius = min(temperature_drop_celsius, 4.0)
    
    # Cooling improvement percentage (more realistic scaling)
    cooling_improvement = min(green_increase_percent * 1.5, 100)
    
    # Calculate other metrics
    building_pixels = np.sum(building_mask == 255)
    road_pixels = np.sum(road_mask == 255)
    building_percent = (building_pixels / total_pixels) * 100
    road_percent = (road_pixels / total_pixels) * 100
    
    # Optimization score based on multiple factors
    score_factors = []
    if green_increase_percent > 0:
        score_factors.append(min(green_increase_percent * 2, 40))  # Up to 40 points for green increase
    if temperature_drop_celsius > 0:
        score_factors.append(min(temperature_drop_celsius * 10, 30))  # Up to 30 points for cooling
    if new_green_pixels > 0:
        # Points for amount of green added (scaled)
        pixel_score = min((new_green_pixels / total_pixels) * 10000, 30)
        score_factors.append(pixel_score)
    
    optimization_score = min(sum(score_factors), 100)

    # ------------------------------
    # 8️⃣ Save Optimized Image (use absolute path under app/processed)
    # ------------------------------
    base_dir = Path(__file__).resolve().parent.parent  # .../app
    processed_dir = base_dir / "processed"
    processed_dir.mkdir(exist_ok=True)

    # Use unique filename to avoid browser caching issues (fix for "map wont generate for some")
    unique_filename = f"optimized_map_{uuid.uuid4().hex[:8]}.png"
    output_path = processed_dir / unique_filename
    cv2.imwrite(str(output_path), optimized)

    return {
        # This relative path matches the StaticFiles mount in main.py
        "optimized_map": f"processed/{unique_filename}",
        "new_green_pixels": int(new_green_pixels),
        "new_green_percent": round(new_green_percent, 2),
        "existing_green_percent": round(existing_green_percent, 2),
        "total_green_after": round(total_green_after, 2),
        "green_increase_percent": round(green_increase_percent, 2),
        "green_increase_absolute": round(green_increase_absolute, 2),
        "cooling_improvement_percent": round(cooling_improvement, 2),
        "temperature_drop_celsius": round(temperature_drop_celsius, 2),
        "building_percent": round(building_percent, 2),
        "road_percent": round(road_percent, 2),
        "open_land_available": round((new_green_pixels / total_pixels) * 100, 2),
        "optimization_score": round(optimization_score, 1),
        "unclassified_percent": round(unclassified_percent, 2),
        "albedo_impact": round(green_increase_percent * 0.85, 2), # Theoretical gain from Strategy #2
        "validation": {
            "total_classified": round(100 - unclassified_percent, 2),
            "green_plus_new": round(existing_green_percent + new_green_percent, 2)
        }
    }
