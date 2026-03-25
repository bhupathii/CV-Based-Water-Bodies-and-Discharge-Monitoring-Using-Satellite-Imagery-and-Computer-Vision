"""
Synthetic historical data generator.
Creates realistic seasonal water monitoring data for demo sites.
Also generates sample water body images using OpenCV/NumPy.
"""

import os
import json
import sqlite3
import random
import math
import numpy as np
from datetime import datetime, timedelta
from app.models.database import get_connection, DB_PATH

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
BACKEND_DIR = os.path.join(BASE_DIR, "..", "..")
SAMPLE_DIR = os.path.join(BACKEND_DIR, "sample_data")

DEMO_SITES = [
    {
        "id": "site_patna",
        "name": "Patna Ganga Station",
        "location": "Patna, Bihar",
        "latitude": 25.5941,
        "longitude": 85.1376,
        "river": "Ganga",
        "description": "Primary monitoring station on the Ganga river at Patna. High monsoon discharge patterns observed annually.",
        "status": "active",
    },
    {
        "id": "site_varanasi",
        "name": "Varanasi Ghats Station",
        "location": "Varanasi, UP",
        "latitude": 25.3176,
        "longitude": 82.9739,
        "river": "Ganga",
        "description": "Urban river monitoring at Varanasi. Critical for pollution and turbidity tracking.",
        "status": "active",
    },
    {
        "id": "site_haridwar",
        "name": "Haridwar Har Ki Pauri",
        "location": "Haridwar, Uttarakhand",
        "latitude": 29.9457,
        "longitude": 78.1642,
        "river": "Ganga",
        "description": "Upper Ganga monitoring point post-Himalayan snowmelt and monsoon runoff.",
        "status": "active",
    },
    {
        "id": "site_chennai_lake",
        "name": "Chembarambakkam Lake",
        "location": "Chennai, Tamil Nadu",
        "latitude": 13.0012,
        "longitude": 80.0618,
        "river": "Lake / Reservoir",
        "description": "Reservoir monitoring near Chennai. Key freshwater source for the city.",
        "status": "active",
    },
    {
        "id": "site_reservoir_demo",
        "name": "Generic Reservoir Demo",
        "location": "Deccan Plateau, India",
        "latitude": 17.3850,
        "longitude": 78.4867,
        "river": "Tributary Reservoir",
        "description": "Synthetic demonstration reservoir for algorithm validation.",
        "status": "demo",
    },
]


def _generate_seasonal_value(day_of_year, base, amplitude, phase=0, noise=0.05):
    """Generate a seasonal value with sine wave + noise."""
    seasonal = base + amplitude * math.sin(2 * math.pi * (day_of_year - phase) / 365)
    noise_val = random.gauss(0, base * noise)
    return max(0, seasonal + noise_val)


def generate_historical_csv(site_id: str, days: int = 365):
    """Generate and return synthetic historical data for a site."""
    import csv

    # Site-specific parameters
    site_params = {
        "site_patna": {"base_area": 2800, "amp_area": 1200, "base_q": 18000, "amp_q": 12000, "base_turb": 45},
        "site_varanasi": {"base_area": 2200, "amp_area": 900, "base_q": 14000, "amp_q": 9000, "base_turb": 65},
        "site_haridwar": {"base_area": 1500, "amp_area": 700, "base_q": 8000, "amp_q": 6000, "base_turb": 30},
        "site_chennai_lake": {"base_area": 3500, "amp_area": 1500, "base_q": 5000, "amp_q": 3000, "base_turb": 20},
        "site_reservoir_demo": {"base_area": 4000, "amp_area": 2000, "base_q": 6000, "amp_q": 4000, "base_turb": 15},
    }

    params = site_params.get(site_id, site_params["site_patna"])
    start_date = datetime.now() - timedelta(days=days)
    rows = []

    for i in range(days):
        date = start_date + timedelta(days=i)
        doy = date.timetuple().tm_yday
        # Monsoon peak = around day 200 (July-Aug), phase offset ~150
        area = _generate_seasonal_value(doy, params["base_area"], params["amp_area"], phase=150)
        width = area ** 0.5 * random.uniform(0.8, 1.2)
        discharge = _generate_seasonal_value(doy, params["base_q"], params["amp_q"], phase=155)
        turbidity = _generate_seasonal_value(doy, params["base_turb"], params["base_turb"] * 0.4, phase=155, noise=0.1)
        flood_risk = min(1.0, discharge / (params["base_q"] + params["amp_q"] * 1.3))
        ndwi_sim = random.uniform(0.2, 0.7) + (area / (params["base_area"] + params["amp_area"])) * 0.2
        rainfall_proxy = _generate_seasonal_value(doy, 5, 45, phase=150, noise=0.3)

        # Inject random anomalies (~3% of days)
        anomaly = 0
        if random.random() < 0.03:
            anomaly = 1
            area *= random.uniform(1.3, 1.8)
            discharge *= random.uniform(1.4, 2.0)
            turbidity = min(100, turbidity * random.uniform(1.5, 2.5))
            flood_risk = min(1.0, flood_risk * 1.6)

        rows.append({
            "date": date.strftime("%Y-%m-%d"),
            "water_area": round(area, 2),
            "avg_width": round(width, 2),
            "discharge": round(discharge, 2),
            "turbidity": round(turbidity, 2),
            "flood_risk": round(flood_risk, 4),
            "anomaly_flag": anomaly,
            "ndwi_sim": round(min(1.0, ndwi_sim), 4),
            "rainfall_proxy": round(max(0, rainfall_proxy), 2),
        })

    return rows


def _create_water_image(path: str, style: str = "river"):
    """Create a synthetic water body image using NumPy for demo purposes."""
    try:
        import cv2

        h, w = 480, 640
        img = np.zeros((h, w, 3), dtype=np.uint8)

        if style == "river":
            # Sky gradient
            for y in range(h // 3):
                ratio = y / (h // 3)
                img[y] = [int(135 + ratio * 30), int(180 + ratio * 30), int(220)]
            # Ground/bank
            for y in range(h // 3, h):
                ratio = (y - h // 3) / (h * 2 // 3)
                img[y] = [int(40 + ratio * 30), int(60 + ratio * 20), int(30)]
            # River channel
            rx1, rx2 = w // 4, 3 * w // 4
            ry1, ry2 = h // 3, int(h * 0.85)
            for y in range(ry1, ry2):
                wave = int(10 * math.sin(y * 0.05))
                x_start = rx1 + wave
                x_end = rx2 + wave
                ratio = (y - ry1) / (ry2 - ry1)
                blue = int(120 + ratio * 40)
                green = int(100 + ratio * 20)
                img[y, x_start:x_end] = [blue, green + 20, 20]
        elif style == "lake":
            # Sky
            img[:h // 4] = [200, 220, 240]
            # Banks (green)
            for y in range(h // 4, h):
                img[y] = [40, 80, 30]
            # Lake body (oval)
            cx, cy = w // 2, h * 3 // 5
            for y in range(h // 4, h):
                for x in range(0, w):
                    if ((x - cx) ** 2) / (w * 0.35) ** 2 + ((y - cy) ** 2) / (h * 0.3) ** 2 < 1:
                        img[y, x] = [160, 130, 30]
        elif style == "flood":
            img[:] = [145, 100, 20]
            noise = np.random.randint(0, 30, (h, w, 3), dtype=np.uint8)
            img = cv2.add(img, noise)

        # Add noise texture
        noise = np.random.randint(0, 15, (h, w, 3), dtype=np.uint8)
        img = np.clip(img.astype(np.int32) + noise.astype(np.int32) - 7, 0, 255).astype(np.uint8)

        cv2.imwrite(path, img)
        return True
    except Exception as e:
        print(f"[DataGen] Could not create image {path}: {e}")
        return False


def generate_sample_data():
    """One-time setup: populate DB with sites and generate sample images + CSVs."""
    conn = get_connection()
    cursor = conn.cursor()

    # Check if already seeded
    cursor.execute("SELECT COUNT(*) FROM sites")
    count = cursor.fetchone()[0]

    if count == 0:
        print("[DataGen] Seeding sites...")
        for site in DEMO_SITES:
            cursor.execute(
                "INSERT OR IGNORE INTO sites (id, name, location, latitude, longitude, river, description, status) VALUES (?,?,?,?,?,?,?,?)",
                (site["id"], site["name"], site["location"], site["latitude"], site["longitude"],
                 site["river"], site["description"], site["status"]),
            )
        conn.commit()

        # Generate historical observations
        print("[DataGen] Generating historical data...")
        for site in DEMO_SITES:
            rows = generate_historical_csv(site["id"], days=365)
            for row in rows:
                cursor.execute(
                    "INSERT INTO observations (site_id, date, water_area, avg_width, discharge, turbidity, flood_risk, anomaly_flag, ndwi_sim, rainfall_proxy) VALUES (?,?,?,?,?,?,?,?,?,?)",
                    (site["id"], row["date"], row["water_area"], row["avg_width"], row["discharge"],
                     row["turbidity"], row["flood_risk"], row["anomaly_flag"], row["ndwi_sim"], row["rainfall_proxy"]),
                )
            conn.commit()
            print(f"  [OK] {site['id']}: {len(rows)} records")

        # Generate alerts
        print("[DataGen] Generating sample alerts...")
        alert_data = [
            ("site_patna", "Patna Ganga Station", "Flood Risk", "warning", "Discharge exceeded 25,000 m³/s. Elevated flood risk detected.", "2024-08-15T14:30:00", 0),
            ("site_varanasi", "Varanasi Ghats Station", "Turbidity Spike", "severe", "Turbidity index > 90. Potential industrial discharge event.", "2024-09-02T09:15:00", 0),
            ("site_haridwar", "Haridwar Har Ki Pauri", "Anomaly Detected", "warning", "Unusual water area increase detected by Isolation Forest algorithm.", "2024-07-22T16:45:00", 1),
            ("site_chennai_lake", "Chembarambakkam Lake", "Level Drop", "info", "Reservoir level dropped 12% below seasonal average. Possible demand surge.", "2024-03-10T08:00:00", 1),
        ]
        for a in alert_data:
            cursor.execute(
                "INSERT INTO alerts (site_id, site_name, alert_type, severity, message, timestamp, acknowledged) VALUES (?,?,?,?,?,?,?)", a
            )
        conn.commit()

    conn.close()

    # Generate sample images
    images_dir = os.path.join(SAMPLE_DIR, "images")
    os.makedirs(images_dir, exist_ok=True)

    styles = [
        ("river_ganga_sample.jpg", "river"),
        ("lake_chennai_sample.jpg", "lake"),
        ("flood_event_sample.jpg", "flood"),
        ("reservoir_sample.jpg", "lake"),
        ("river_upstream_sample.jpg", "river"),
    ]

    for fname, style in styles:
        fpath = os.path.join(images_dir, fname)
        if not os.path.exists(fpath):
            _create_water_image(fpath, style)

    # Persist site JSON for quick frontend lookup
    sites_dir = os.path.join(SAMPLE_DIR, "sites")
    os.makedirs(sites_dir, exist_ok=True)
    sites_json = os.path.join(sites_dir, "sites.json")
    if not os.path.exists(sites_json):
        with open(sites_json, "w") as f:
            json.dump(DEMO_SITES, f, indent=2)

    print("[DataGen] Sample data ready.")
