"""
Discharge Estimation Service - Hybrid Physics + ML Approach

Implements a two-component hybrid discharge estimator:
1. Manning's Equation inspired physics estimate
2. Random Forest ML estimate (trained on synthetic data)
3. Weighted combination with confidence score

NOTE: This is an educational prototype. Real discharge requires calibrated gauges.
"""

import numpy as np
import random
from typing import Dict, Any
from sklearn.ensemble import RandomForestRegressor
import joblib
import os

MODEL_PATH = os.path.join(os.path.dirname(__file__), "..", "..", "discharge_model.pkl")


def _physics_estimate(width_m: float, area_km2: float, slope_proxy: float = 0.001, roughness: float = 0.035) -> float:
    """
    Manning's Equation Inspired Discharge Estimate (Prototype Approximation)
    
    Q = (1/n) * A * R^(2/3) * S^(1/2)
    
    Where:
    - n = Manning's roughness coefficient (~0.035 for natural rivers)
    - A = cross-sectional area proxy (width × depth proxy)
    - R = hydraulic radius proxy (≈ depth for wide channels)
    - S = slope proxy (simulated)
    """
    if width_m <= 0 or area_km2 <= 0:
        return 0.0

    # Depth proxy: assume depth ~ area / width as a proxy (very rough)
    area_m2_proxy = area_km2 * 1e6 * 0.01  # scale for demo
    depth_proxy = max(0.5, area_m2_proxy / max(width_m, 1))
    depth_proxy = min(depth_proxy, 20.0)  # cap at 20m

    # Cross section area
    cross_section = width_m * depth_proxy

    # Hydraulic radius for wide channels ≈ depth
    hydraulic_radius = depth_proxy

    Q = (1.0 / roughness) * cross_section * (hydraulic_radius ** (2 / 3)) * (slope_proxy ** 0.5)
    return float(np.clip(Q, 0, 1e6))


def _generate_training_data(n_samples: int = 2000):
    """Generate synthetic training data for the ML model."""
    np.random.seed(42)

    area = np.random.uniform(0.5, 50, n_samples)
    width = np.random.uniform(20, 800, n_samples)
    ndwi = np.random.uniform(-0.2, 0.8, n_samples)
    turbidity = np.random.uniform(5, 90, n_samples)
    seasonal = np.random.uniform(0.3, 1.0, n_samples)
    slope = np.random.uniform(0.0002, 0.005, n_samples)

    # Simulate discharge with realistic correlation
    discharge = (
        width * 25 +
        area * 300 +
        ndwi * 5000 +
        (1 - turbidity / 100) * 800 +
        seasonal * 8000 +
        slope * 50000 +
        np.random.normal(0, 500, n_samples)
    )
    discharge = np.clip(discharge, 0, 80000)
    return area, width, ndwi, turbidity, seasonal, slope, discharge


def _load_or_train_model() -> RandomForestRegressor:
    """Load saved model or train a new one."""
    if os.path.exists(MODEL_PATH):
        try:
            return joblib.load(MODEL_PATH)
        except Exception:
            pass

    print("[DischargeEstimator] Training ML model...")
    area, width, ndwi, turbidity, seasonal, slope, discharge = _generate_training_data()

    X = np.column_stack([area, width, ndwi, turbidity, seasonal, slope])
    y = discharge

    model = RandomForestRegressor(n_estimators=50, max_depth=8, random_state=42, n_jobs=-1)
    model.fit(X, y)
    joblib.dump(model, MODEL_PATH)
    print(f"[DischargeEstimator] Model saved to {MODEL_PATH}")
    return model


# Lazy-load the model
_ML_MODEL = None


def get_model():
    global _ML_MODEL
    if _ML_MODEL is None:
        _ML_MODEL = _load_or_train_model()
    return _ML_MODEL


def estimate_discharge(
    area_km2: float,
    avg_width_m: float,
    ndwi_sim: float = 0.3,
    turbidity: float = 40.0,
    seasonal_factor: float = 0.5,
    slope_proxy: float = 0.001,
) -> Dict[str, Any]:
    """
    Hybrid discharge estimation combining physics and ML approaches.
    
    Returns discharge estimate with confidence interval.
    """
    # 1. Physics-inspired estimate (Manning approximation)
    q_physics = _physics_estimate(avg_width_m, area_km2, slope_proxy)

    # 2. ML estimate
    try:
        model = get_model()
        X_pred = np.array([[area_km2, avg_width_m, ndwi_sim, turbidity, seasonal_factor, slope_proxy]])
        q_ml = float(model.predict(X_pred)[0])
    except Exception as e:
        print(f"[DischargeEstimator] ML fallback: {e}")
        q_ml = q_physics * random.uniform(0.85, 1.15)

    # 3. Weighted hybrid (60% physics, 40% ML)
    q_hybrid = 0.60 * q_physics + 0.40 * q_ml

    # Confidence: based on input data quality
    confidence = min(95, max(55, 75 + ndwi_sim * 15 - abs(turbidity - 30) * 0.3))

    # Uncertainty range ±15%
    uncertainty_pct = 100 - confidence
    q_low = q_hybrid * (1 - uncertainty_pct / 100)
    q_high = q_hybrid * (1 + uncertainty_pct / 100)

    # Flood risk assessment
    if q_hybrid > 30000:
        flood_risk = "High"
        flood_score = min(1.0, q_hybrid / 50000)
    elif q_hybrid > 15000:
        flood_risk = "Moderate"
        flood_score = min(0.7, q_hybrid / 40000)
    else:
        flood_risk = "Low"
        flood_score = min(0.3, q_hybrid / 30000)

    return {
        "discharge_m3s": round(q_hybrid, 2),
        "discharge_physics": round(q_physics, 2),
        "discharge_ml": round(q_ml, 2),
        "discharge_low": round(q_low, 2),
        "discharge_high": round(q_high, 2),
        "confidence_pct": round(confidence, 1),
        "flood_risk": flood_risk,
        "flood_score": round(flood_score, 4),
        "note": "Hybrid Manning-inspired + Random Forest estimate (educational prototype)",
    }
