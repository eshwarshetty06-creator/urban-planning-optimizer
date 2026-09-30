# 🏙️ Urban Plan Optimizer

<div align="center">

[![Python](https://img.shields.io/badge/Python-3.10+-3776AB?style=for-the-badge&logo=python&logoColor=white)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19.0-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com)
[![OpenCV](https://img.shields.io/badge/OpenCV-Computer_Vision-5C3EE8?style=for-the-badge&logo=opencv&logoColor=white)](https://opencv.org)

**An AI-powered computer vision platform for urban planning, satellite map analysis, and urban heat island mitigation.**

[Quick Start](#-quick-start) • [Key Features](#-key-features) • [Visual Demo](#-visual-demo) • [How It Works](#-how-it-works) • [API Reference](#-api-reference)

</div>

---

## 📌 Overview

Rapid urbanization across the world has accelerated the **Urban Heat Island (UHI)** effect — dense concentrations of dark asphalt, concrete buildings, and scarce vegetation absorb solar radiation and increase metropolitan temperatures by up to **4°C – 10°C**.

**Urban Plan Optimizer** is an interactive full-stack computer vision application engineered to analyze satellite and aerial imagery, identify underutilized open land, and simulate strategic green space additions and cool pavement installations to reduce localized temperatures.

```
+----------------------------------------------------------------------------------------------------+
|                                    Urban Plan Optimizer Pipeline                                   |
|  [Satellite Imagery] ──> [Land Segmentation] ──> [Thermal Heatmap] ──> [Green Space Optimization]   |
|                                                                                │                   |
|                                                                                v                   |
|                                    [Localized Cooling Forecast & Interactive Analytics HUD]        |
+----------------------------------------------------------------------------------------------------+
```

---

## 📸 Visual Demo

| 1. Input Satellite Image | 2. Thermal Radiance Heatmap | 3. Optimized Green Restructure |
| :---: | :---: | :---: |
| ![Original Satellite Map](demo%20picture/demo.jpg) | ![Thermal Heatmap](demo%20picture/demo%202.jpg) | ![Optimized Green Restructure](demo%20picture/demo3.jpg) |
| *Raw multi-spectral satellite imagery* | *Infrared heat trap isolation* | *Biomass injection + Cool pavement* |

> 🎥 **Demo Video:** A full video walkthrough is available in `Demo vedio/Urban Planning Optimizer - Smart City Planning & Green Space Analysis - 3 April 2026.mp4`.

---

## ✨ Key Features

- 🛰️ **Multi-Spectral Land Taxonomy**: Uses calibrated HSV color thresholds combined with morphological filtering to accurately segregate vegetation, buildings, asphalt roads, and open land.
- 🔥 **Thermal Infrared Heatmap**: Generates a floating-point surface radiance map based on material heat absorption weights, smoothed via Gaussian convolution and overlaid with false-color `cv2.COLORMAP_JET`.
- 🌱 **Intelligent Green Restructuring**: Identifies unbuilt land parcels and algorithmically injects vegetation clusters while strictly protecting existing road grids and buildings.
- ☀️ **Albedo & Cool Pavement Protocol**: Places high-reflectivity surface halos (`[255, 255, 230]`) around new green clusters to reflect shortwave solar radiation before thermal absorption occurs.
- 🌡️ **Empirical Cooling Forecast**: Calculates expected localized temperature drops (up to 4.0°C) using empirical microclimate urban canopy models.
- 📊 **Cybernetic HUD Dashboard**: Sci-Fi themed, dark-mode dashboard built with React 19, Tailwind CSS, and Chart.js featuring interactive doughnut and bar analytics.
- 🔒 **Stateless UUID Sessions**: Automatically tags uploads with unique UUIDs for collision-free concurrent usage.

---

## 🏗️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Backend API** | [FastAPI](https://fastapi.tiangolo.com/), [Uvicorn](https://www.uvicorn.org/), Python 3.10+ |
| **Computer Vision** | [OpenCV](https://opencv.org/) (`cv2`), [NumPy](https://numpy.org/), [SciPy](https://scipy.org/), [Pillow](https://python-pillow.org/) |
| **Frontend UI** | [React 19](https://react.dev/), [React Router DOM v7](https://reactrouter.com/) |
| **Styling** | [Tailwind CSS](https://tailwindcss.com/) (Cybernetic HUD theme, glassmorphism, scanlines) |
| **Visualization** | [Chart.js](https://www.chartjs.org/) & [react-chartjs-2](https://react-chartjs-2.js.org/) |

---

## 📂 Project Directory Structure

```text
urban-plan-optimizer/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                     # FastAPI routes, CORS, and static file mounts
│   │   └── services/
│   │       ├── land_analysis.py        # HSV color segmentation & land classification
│   │       ├── heatmap_generator.py    # Thermal radiance matrix & JET color map
│   │       ├── optimizer.py            # Green space injection & albedo buffering
│   │       └── map_analysis.py         # Foliage detection
│   └── requirements.txt                # Python dependencies
├── frontend/
│   ├── package.json                    # React dependencies & scripts
│   ├── tailwind.config.js              # Custom HUD theme colors & animations
│   ├── public/                         # Static assets & index.html
│   └── src/
│       ├── App.js                      # Application routes
│       ├── index.css                   # Tailwind styles & scanline animations
│       ├── components/
│       │   └── Navbar.jsx              # Cybernetic top navigation bar
│       └── pages/
│           ├── Home.jsx                # Landing page & system status
│           ├── UploadMap.jsx           # Satellite image ingestion
│           ├── Analyze.jsx             # Land taxonomy breakdown & gauges
│           ├── Heatmap.jsx             # Thermal infrared heatmap viewer
│           ├── Optimize.jsx            # Optimized green layout & cooling forecast
│           └── Results.jsx             # Chart.js analytics & environmental audit
├── demo picture/                       # Sample aerial datasets (demo.jpg, demo 2.jpg, demo3.jpg)
├── Demo vedio/                         # Video walkthrough
└── README.md
```

---

## 🚀 Quick Start Guide

### Prerequisites
- **Python 3.10+**
- **Node.js 18+** & **npm**

---

### 1. Backend Setup

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create and activate a virtual environment
# Windows (PowerShell):
python -m venv venv
.\venv\Scripts\activate

# macOS / Linux:
# python3 -m venv venv
# source venv/bin/activate

# 3. Install dependencies
pip install -r requirements.txt

# 4. Start the backend server
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```
> 🌐 **Backend URL:** `http://127.0.0.1:8000`  
> 📖 **Interactive Swagger Docs:** `http://127.0.0.1:8000/docs`

---

### 2. Frontend Setup

In a new terminal window:

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install

# 3. Launch the development server
npm start
```
> 🛰️ **Frontend Dashboard:** Opens automatically at `http://localhost:3000`.

---

## 🔬 How the Algorithms Work

### 1. Multi-Spectral Land Classification
Images are converted to the **HSV (Hue, Saturation, Value)** color space, which separates color tint from intensity for consistent detection under varying sunlight:
- **Biomass / Green Cover:** $\text{Hue} \in [35, 85]$, $\text{Saturation} \in [40, 255]$, $\text{Value} \in [40, 255]$
- **Concrete & Buildings:** $\text{Hue} \in [0, 180]$, $\text{Saturation} \in [0, 35]$, $\text{Value} \in [130, 255]$
- **Asphalt Roads & Shadows:** $\text{Hue} \in [0, 180]$, $\text{Saturation} \in [0, 50]$, $\text{Value} \in [0, 100]$
- **Open / Arid Land:** $\text{Hue} \in [10, 35]$, $\text{Saturation} \in [25, 180]$, $\text{Value} \in [90, 240]$

Morphological filtering (`cv2.morphologyEx`) cleans noise, and bitwise masks prevent overlapping misclassifications.

### 2. Thermal Radiance Modeling
A 2D thermal intensity matrix $H(x, y)$ is populated according to the heat characteristics of each surface:
- **Buildings / Dense Concrete:** $+5.0$
- **Asphalt / Transit:** $+2.0$
- **Open Land:** $+1.0$
- **Active Vegetation:** $-4.0$

A Gaussian blur filter ($15 \times 15$ kernel) models radiant heat diffusion into surrounding zones. The smoothed matrix is normalized to $[0, 255]$ and blended with the original map using `cv2.COLORMAP_JET` (blue = cool, red = hot).

### 3. Green Space Optimization & Cool Pavement
- **Target Selection:** Extracts coordinates from the open land mask.
- **Biomass Injection:** Targets up to 15% open space density with realistic green clusters (`[34, 139, 34]`, `[0, 128, 0]`, etc.).
- **Albedo Halo:** Deploys a reflective halo (`[255, 255, 230]`) around new green clusters to prevent adjacent asphalt from acting as heat batteries.
- **Cooling Prediction:** Computes localized temperature drop ($\Delta T$) capped at an empirical maximum of $4.0^\circ\text{C}$.

---

## 🔌 API Endpoints Reference

| Method | Endpoint | Query / Body Params | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/upload-map` | `file: UploadFile` | Ingests a satellite map image and returns a unique `file_id`. |
| `GET` | `/analyze` | `file_id` (str), `scale_m2_per_px` (float, opt) | Returns land coverage percentages (green, buildings, roads, open land) and analyzed area. |
| `GET` | `/heatmap` | `file_id` (str) | Computes and returns the URL for the infrared thermal heatmap overlay. |
| `GET` | `/optimize` | `file_id` (str), `scale_m2_per_px` (float, opt) | Generates restructured image URL, temperature drop (°C), and albedo impact score. |

---

## 🖥️ Command Dashboard Pages

| Page | Route | Description |
| :--- | :--- | :--- |
| **Dashboard** | `/` | Mission briefing, system health, and core statistics. |
| **Telemetry Upload** | `/upload` | Drag-and-drop satellite imagery uploader with preview. |
| **Land Analysis** | `/analyze` | Radial gauges and metrics for green space, structures, and roads. |
| **Thermal Heatmap** | `/heatmap` | False-color infrared map displaying high-heat vectors and cool zones. |
| **Optimizer** | `/optimize` | Interactive before/after map comparison, cooling delta, and albedo score. |
| **Analytics** | `/results` | Chart.js doughnut and bar visualizers auditing environmental efficiency. |

---

## 📄 License

This project is open-source and released under the **MIT License**.
