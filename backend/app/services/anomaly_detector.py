"""
Anomaly Detection Service
Uses Isolation Forest and z-score methods to detect abnormal water monitoring readings.
"""

import numpy as np
from typing import Dict, Any, List
from sklearn.ensemble import IsolationForest


def detect_anomaly_zscore(values: List[float], threshold: float = 2.5) -> List[bool]:
    """Z-score based anomaly detection."""
    if len(values) < 3:
        return [False] * len(values)
    arr = np.array(values)
    mean, std = np.mean(arr), np.std(arr)
    if std == 0:
        return [False] * len(values)
    z_scores = np.abs((arr - mean) / std)
    return (z_scores > threshold).tolist()


def detect_anomaly_isolation_forest(data: List[Dict[str, float]]) -> List[Dict[str, Any]]:
    """
    Isolation Forest anomaly detection on multivariate time-series.
    Features: water_area, discharge, turbidity, flood_risk
    """
    if len(data) < 10:
        return [{"is_anomaly": False, "anomaly_score": 0.0} for _ in data]

    features = []
    for row in data:
        features.append([
            row.get("water_area", 0),
            row.get("discharge", 0),
            row.get("turbidity", 0),
            row.get("flood_risk", 0),
        ])

    X = np.array(features)
    iso = IsolationForest(contamination=0.05, random_state=42, n_jobs=-1)
    iso.fit(X)
    predictions = iso.predict(X)  # -1 = anomaly, 1 = normal
    scores = iso.score_samples(X)

    results = []
    for pred, score in zip(predictions, scores):
        is_anomaly = bool(pred == -1)
        normalized_score = float(np.clip(1 - (score - scores.min()) / (scores.max() - scores.min() + 1e-9), 0, 1))
        results.append({
            "is_anomaly": is_anomaly,
            "anomaly_score": round(normalized_score, 4),
        })
    return results


def assess_anomaly_single(
    area_km2: float,
    discharge: float,
    turbidity: float,
    flood_score: float,
    site_history: List[Dict] = None,
) -> Dict[str, Any]:
    """
    Assess anomaly for a single newly analyzed image.
    Compares against simple thresholds and optionally against historical norms.
    """
    flags = []

    if turbidity > 70:
        flags.append({"type": "Turbidity Spike", "severity": "warning", "value": turbidity})
    if flood_score > 0.7:
        flags.append({"type": "High Flood Risk", "severity": "severe", "value": flood_score})
    if discharge > 40000:
        flags.append({"type": "Extreme Discharge", "severity": "severe", "value": discharge})
    elif discharge > 25000:
        flags.append({"type": "High Discharge", "severity": "warning", "value": discharge})

    if site_history and len(site_history) > 30:
        hist_areas = [h["water_area"] for h in site_history[-30:]]
        mean_area = np.mean(hist_areas)
        std_area = np.std(hist_areas)
        if std_area > 0 and abs(area_km2 * 100 - mean_area) > 2.5 * std_area:
            flags.append({"type": "Unusual Water Extent", "severity": "warning", "value": area_km2})

    anomaly_detected = len(flags) > 0
    severity = "normal"
    if any(f["severity"] == "severe" for f in flags):
        severity = "severe"
    elif flags:
        severity = "warning"

    return {
        "anomaly_detected": anomaly_detected,
        "severity": severity,
        "flags": flags,
        "total_flags": len(flags),
    }
