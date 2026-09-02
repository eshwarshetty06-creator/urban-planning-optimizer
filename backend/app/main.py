from fastapi import FastAPI, UploadFile, File, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import shutil
import os
from pathlib import Path
import uuid

# CORRECT imports from services folder
from .services.land_analysis import analyze_land_usage
from .services.map_analysis import detect_green_areas
from .services.heatmap_generator import generate_heatmap
from .services.optimizer import optimize_green_spaces


BASE_DIR = Path(__file__).resolve().parent

app = FastAPI(title="Urban Planning & Green Space Optimizer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

UPLOAD_FOLDER = BASE_DIR / "Uploaded_maps"
PROCESSED_FOLDER = BASE_DIR / "processed"
os.makedirs(UPLOAD_FOLDER, exist_ok=True)
os.makedirs(PROCESSED_FOLDER, exist_ok=True)

app.mount("/uploaded_maps", StaticFiles(directory=str(UPLOAD_FOLDER)), name="uploaded_maps")
app.mount("/processed", StaticFiles(directory=str(PROCESSED_FOLDER)), name="processed")


@app.post("/upload-map")
async def upload_map(file: UploadFile = File(...)):
    # Create unique identifier to handle multiple users simultaneously
    file_id = str(uuid.uuid4())
    extension = os.path.splitext(file.filename)[1]
    
    unique_filename = f"{file_id}{extension}"
    file_location = UPLOAD_FOLDER / unique_filename
    
    with open(file_location, "wb") as f:
        shutil.copyfileobj(file.file, f)

    return {
        "message": "File uploaded successfully",
        "file_id": file_id,
        "filename": unique_filename,
    }


@app.get("/analyze")
def analyze(file_id: str, scale_m2_per_px: float = Query(1.0, description="Theoretical map scale: Sq meters per pixel")):
    if not file_id:
        raise HTTPException(status_code=400, detail="Missing file_id parameter")
        
    # Find the uploaded file
    target_file = None
    for f in os.listdir(UPLOAD_FOLDER):
        if f.startswith(file_id):
            target_file = str(UPLOAD_FOLDER / f)
            break
            
    if not target_file:
        raise HTTPException(status_code=404, detail="Map not found. Please upload again.")
    
    try:
        # AI Analysis using updated spatial heuristics
        land_data = analyze_land_usage(target_file)
        green_data = detect_green_areas(target_file)
        
        green_percentage = green_data.get("green_percentage", 0)
        building_percentage = land_data.get("building_percentage", 0)
        road_percentage = land_data.get("road_percentage", 0)
        open_land = land_data.get("open_land_percentage", 0)
        
        total_green_cover = green_percentage + (open_land * 0.3)
        
        # Calculate theoretical physical area based on scale parameter
        total_pixels = land_data.get("total_pixels", 1000000) # Fallback
        approx_area_sqm = total_pixels * scale_m2_per_px
        
        return {
            "green_cover": f"{total_green_cover:.1f}%",
            "buildings": f"{building_percentage:.1f}%",
            "roads": f"{road_percentage:.1f}%",
            "note": f"Analysis complete. Open land available: {open_land:.1f}%. Approx area analyzed: {approx_area_sqm:,.0f} m²",
            "raw_data": land_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")


@app.get("/heatmap")
def heatmap(file_id: str):
    if not file_id:
        raise HTTPException(status_code=400, detail="Missing file_id parameter")
        
    target_file = None
    for f in os.listdir(UPLOAD_FOLDER):
        if f.startswith(file_id):
            target_file = str(UPLOAD_FOLDER / f)
            break
            
    if not target_file:
        raise HTTPException(status_code=404, detail="Map not found")
    
    try:
        # Pass file_id to heatmap generator to ensure unique output names
        result = generate_heatmap(target_file, file_id)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        heatmap_path = result.get("heatmap_path")
        heatmap_url = f"http://127.0.0.1:8000/{heatmap_path}"
        
        return {"heatmap_url": heatmap_url}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating heatmap: {str(e)}")


@app.get("/optimize")
def optimize(file_id: str, scale_m2_per_px: float = Query(1.0, description="Theoretical map scale")):
    if not file_id:
        raise HTTPException(status_code=400, detail="Missing file_id parameter")
        
    target_file = None
    for f in os.listdir(UPLOAD_FOLDER):
        if f.startswith(file_id):
            target_file = str(UPLOAD_FOLDER / f)
            break
            
    if not target_file:
        raise HTTPException(status_code=404, detail="Map not found")
    
    try:
        # Pass file_id to optimizer to ensure unique output names
        result = optimize_green_spaces(target_file, file_id, scale_m2_per_px)
        
        if "error" in result:
            raise HTTPException(status_code=500, detail=result["error"])
        
        optimized_path = result.get("optimized_map")
        optimized_url = f"http://127.0.0.1:8000/{optimized_path}"
        
        green_increase = result.get("green_increase_percent", 0)
        temperature_drop = result.get("temperature_drop_celsius", 0)
        new_green_pixels = result.get("new_green_pixels", 0)
        
        # Realistic scale phrasing
        real_world_area = new_green_pixels * scale_m2_per_px
        
        return {
            "improvement": f"Green cover increased by {green_increase:.1f}%. {new_green_pixels:,} new spatial units added.",
            "temperature_drop": f"{temperature_drop:.2f}°C",
            "optimized_map_url": optimized_url,
            "new_green_percent": round(result.get("new_green_percent", 0), 2),
            "green_increase_percent": round(result.get("green_increase_percent", 0), 2),
            "total_green_after": round(result.get("total_green_after", 0), 2),
            "cooling_improvement": round(result.get("cooling_improvement_percent", 0), 2),
            "optimization_score": result.get("optimization_score", 0),
            "existing_green_percent": result.get("existing_green_percent", 0),
            "albedo_impact": result.get("albedo_impact", 0)
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error generating optimization: {str(e)}")

