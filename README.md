# 🌊 AquaWatch — CV-Based Water Bodies & Discharge Monitoring System

> **Academic Project Prototype** — A smart environmental monitoring platform demonstrating computer vision and machine learning techniques for water body analysis from satellite-like imagery.

[![Python](https://img.shields.io/badge/Python-3.11+-blue?logo=python)](https://python.org)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.111-green?logo=fastapi)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react)](https://reactjs.org)
[![License](https://img.shields.io/badge/License-MIT-yellow)](LICENSE)
[![Zero Cost](https://img.shields.io/badge/APIs-Zero%20Cost-brightgreen)](.)

---

## 📌 Project Overview

AquaWatch is a **demo-ready academic simulation** of a water body monitoring platform inspired by the project on *"CV-Based Water Bodies and Discharge Monitoring Using Satellite Imagery and Computer Vision"*.

It processes uploaded river/lake images through a complete analysis pipeline:

1. **CV Segmentation** → binary water mask using OpenCV HSV + pseudo-NDWI thresholding
2. **Metric Extraction** → water area, channel width, coverage percentage
3. **Discharge Estimation** → hybrid Manning physics + Random Forest ML model
4. **Turbidity Scoring** → image color/texture proxy for water quality
5. **Anomaly Detection** → Isolation Forest on multivariate time-series
6. **Forecasting** → 7-day moving average projection with confidence bands

> ⚠️ **Important**: This is an educational prototype. All spectral indices, discharge values, and forecasts are simulations/approximations for demonstration purposes only.

---

## ✨ Features

- 🖼️ **Drag-and-drop image upload** with instant analysis
- 🎯 **Water body segmentation** (mask, overlay, contour views)
- 📊 **Simulated NDWI / MNDWI / AWEI** from RGB proxies
- 💧 **Hybrid discharge estimation** (Manning + ML, with confidence interval)
- 🔬 **Turbidity scoring** from image color analysis
- 📈 **Historical trend charts** with seasonal data for 5 demo sites
- 🗺️ **Interactive Leaflet map** (no API key required)
- 🚨 **Anomaly detection** via Isolation Forest
- 📅 **7-day forecasting** with flood alert threshold
- 📥 **Downloadable HTML report**
- 🌗 **Dark/light mode toggle**
- 🗂️ **5 pre-loaded demo sites** (Patna, Varanasi, Haridwar, Chennai, Reservoir)

---

## 🛠️ Tech Stack

| Layer | Technologies |
|-------|-------------|
| **Backend** | Python 3.11+, FastAPI, OpenCV, NumPy, Pandas, scikit-learn, Pillow, SQLite |
| **Frontend** | React 18, Vite 5, Tailwind CSS 3, Recharts, Leaflet, Framer Motion |
| **Storage** | SQLite (local DB) + JSON sample data |
| **ML** | RandomForestRegressor, Isolation Forest (scikit-learn) |
| **APIs** | Zero paid APIs — 100% free/open-source |

---

## 📁 Folder Structure

```
CV_Based_Water_Discharge_Monitoring_System/
│
├── backend/
│   ├── app/
│   │   ├── main.py                    # FastAPI entry point
│   │   ├── routes/
│   │   │   ├── analysis.py            # POST /api/analyze-image
│   │   │   ├── sites.py               # GET /api/sites
│   │   │   ├── history.py             # GET /api/history/{site_id}
│   │   │   ├── forecast.py            # GET /api/forecast/{site_id}
│   │   │   └── alerts.py              # GET /api/alerts
│   │   ├── services/
│   │   │   ├── image_processor.py     # OpenCV segmentation pipeline
│   │   │   ├── discharge_estimator.py # Manning + RF hybrid model
│   │   │   ├── turbidity.py           # Color/texture turbidity proxy
│   │   │   ├── anomaly_detector.py    # Isolation Forest detection
│   │   │   ├── forecaster.py          # 7-day moving average forecast
│   │   │   └── report_generator.py    # HTML report generator
│   │   ├── models/
│   │   │   └── database.py            # SQLite schema + connection
│   │   └── utils/
│   │       └── data_generator.py      # Synthetic data generation
│   ├── sample_data/
│   │   ├── images/                    # Synthetic demo water images
│   │   └── sites/                     # Site metadata JSON
│   ├── uploads/                       # User uploaded images (auto-created)
│   └── requirements.txt
│
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── LandingPage.jsx        # Hero + features
│   │   │   ├── Dashboard.jsx          # Main monitoring dashboard
│   │   │   ├── UploadAnalysis.jsx     # Image upload + analysis
│   │   │   ├── SiteMonitoring.jsx     # Per-site history + map
│   │   │   ├── ForecastAlerts.jsx     # 7-day forecast + alerts
│   │   │   └── Methodology.jsx       # Technical documentation
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── MetricCard.jsx
│   │   │   ├── ImageViewer.jsx
│   │   │   ├── AlertPanel.jsx
│   │   │   └── MapView.jsx
│   │   ├── charts/
│   │   │   ├── DischargeChart.jsx
│   │   │   ├── TurbidityChart.jsx
│   │   │   └── ForecastChart.jsx
│   │   ├── utils/api.js
│   │   ├── App.jsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── .env.example
└── README.md
```

---

## 🚀 Installation & Setup

### Prerequisites

- **Python 3.11+** (check: `python --version`)
- **Node.js 18+** (check: `node --version`)
- **npm** (comes with Node.js)

---

### 1️⃣ Backend Setup

```bash
cd backend

# Create virtual environment (recommended)
python -m venv venv

# Activate:
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start the backend server
uvicorn app.main:app --reload --port 8000
```

The backend will automatically:
- Initialize the SQLite database
- Generate 5 demo monitoring sites
- Create 365 days of synthetic historical data per site
- Generate synthetic sample water body images
- Train and cache the ML discharge model

Backend runs at: **http://localhost:8000**  
API Documentation: **http://localhost:8000/docs**

---

### 2️⃣ Frontend Setup

Open a **new terminal**:

```bash
cd frontend

# Install dependencies
npm install

# Start the development server
npm run dev
```

Frontend runs at: **http://localhost:5173**

---

### 3️⃣ Quick Start (Windows — One Script)

```bash
# From project root, run:
start_all.bat
```

---

## 🖥️ How to Use

1. **Open** http://localhost:5173 in your browser
2. **Landing Page** → click "Launch Dashboard" or "Try Demo Upload"
3. **Dashboard** → select a site, view historical charts and alerts
4. **Upload & Analyze** → drag-drop any river/lake image OR click a demo sample
5. **Site Monitoring** → explore historical trends for each monitoring station
6. **Forecast & Alerts** → view 7-day discharge forecast and alert history
7. **Methodology** → read technical documentation of algorithms used

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/analyze-image` | Upload and analyze water body image |
| `POST` | `/api/load-demo` | Load a built-in demo image |
| `GET` | `/api/sample-images` | List available demo images |
| `GET` | `/api/download-report` | Download HTML analysis report |
| `GET` | `/api/sites` | List all monitoring sites |
| `GET` | `/api/site/{id}` | Site details + latest observation |
| `GET` | `/api/history/{site_id}` | Historical observations |
| `GET` | `/api/history/{site_id}/chart` | Chart-ready data with anomaly flags |
| `GET` | `/api/forecast/{site_id}` | 7-day discharge forecast |
| `GET` | `/api/alerts` | Alert history |
| `POST` | `/api/alerts/{id}/ack` | Acknowledge an alert |

---

## 📊 Demo Sites

| Site ID | Name | Location | River |
|---------|------|----------|-------|
| `site_patna` | Patna Ganga Station | Bihar | Ganga |
| `site_varanasi` | Varanasi Ghats | Uttar Pradesh | Ganga |
| `site_haridwar` | Haridwar Har Ki Pauri | Uttarakhand | Ganga |
| `site_chennai_lake` | Chembarambakkam Lake | Tamil Nadu | Reservoir |
| `site_reservoir_demo` | Generic Reservoir | Deccan Plateau | Tributary |

---

## ⚠️ Limitations

- **Not real satellite data** — uses user-uploaded RGB images. True satellite analysis requires multispectral bands (NIR, SWIR, etc.)
- **Simulated spectral indices** — NDWI, MNDWI, AWEI values are approximated from RGB proxies, not real sensor data
- **Synthetic historical data** — observations are generated using seasonal sine-wave models, not real gauge measurements
- **Approximate discharge** — Manning + ML model is trained on synthetic data; real discharge requires calibrated gauging stations
- **No real-time feeds** — no live satellite API connection (would require ESA/USGS credentials)

---

## 🔭 Future Enhancements

- [ ] Integration with Sentinel-2 via Copernicus Open Access Hub (free)
- [ ] True multispectral band processing (TIF files)
- [ ] U-Net deep learning segmentation model
- [ ] ARIMA/Prophet time-series forecasting
- [ ] Real WMO/CWC discharge gauge data ingestion
- [ ] PWA offline support

---

## 🎓 Academic Use

This project demonstrates end-to-end implementation of:
- Computer vision water body detection
- Simulated remote sensing spectral analysis  
- Hybrid physics+ML estimation models
- Environmental anomaly detection
- Time-series forecasting pipeline

Suitable for: college project review, hackathon demo, portfolio showcase, project presentation accompaniment.

---

*AquaWatch · Academic Prototype v1.0 · Zero paid APIs · Built with OpenCV + FastAPI + React*
