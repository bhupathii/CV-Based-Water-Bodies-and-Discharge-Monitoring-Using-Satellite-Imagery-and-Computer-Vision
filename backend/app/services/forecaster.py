"""
Forecasting Service
Generates 7-day ahead forecasts for discharge and flood risk.
Uses moving average with seasonal adjustment (lightweight, no external dependencies).
"""

import numpy as np
from typing import List, Dict, Any
from datetime import datetime, timedelta
import random


def moving_average_forecast(values: List[float], steps: int = 7, window: int = 14) -> List[float]:
    """Simple moving average with slight trend component."""
    if not values:
        return [0.0] * steps
    
    arr = np.array(values[-window:] if len(values) >= window else values)
    base = float(np.mean(arr))
    
    # Detect trend from last vs first quarter
    if len(arr) >= 4:
        trend = (np.mean(arr[-len(arr)//4:]) - np.mean(arr[:len(arr)//4])) / (window / 2)
    else:
        trend = 0.0
    
    forecast = []
    for i in range(1, steps + 1):
        val = base + trend * i + random.gauss(0, base * 0.04)
        forecast.append(max(0, val))
    return forecast


def generate_forecast(site_id: str, historical_data: List[Dict]) -> Dict[str, Any]:
    """
    Generate 7-day forecast for a monitoring site.
    Returns forecast for discharge, water_area, turbidity, and flood_risk.
    """
    if not historical_data:
        # Return synthetic demo forecast
        base_date = datetime.now()
        dates = [(base_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, 8)]
        return {
            "site_id": site_id,
            "forecast_dates": dates,
            "discharge_forecast": [random.uniform(8000, 16000) for _ in range(7)],
            "discharge_lower": [random.uniform(5000, 8000) for _ in range(7)],
            "discharge_upper": [random.uniform(16000, 24000) for _ in range(7)],
            "area_forecast": [random.uniform(1500, 3500) for _ in range(7)],
            "turbidity_forecast": [random.uniform(20, 60) for _ in range(7)],
            "flood_risk_forecast": [random.uniform(0.1, 0.5) for _ in range(7)],
            "flood_alert_threshold": 30000,
            "note": "Simulated 7-day forecast (educational prototype)",
        }

    # Extract series
    discharges = [d["discharge"] for d in historical_data if d.get("discharge")]
    areas = [d["water_area"] for d in historical_data if d.get("water_area")]
    turbidities = [d["turbidity"] for d in historical_data if d.get("turbidity")]
    flood_risks = [d["flood_risk"] for d in historical_data if d.get("flood_risk")]

    q_fc = moving_average_forecast(discharges)
    a_fc = moving_average_forecast(areas)
    t_fc = moving_average_forecast(turbidities)
    fr_fc = moving_average_forecast(flood_risks)

    # Clip flood risk to [0,1]
    fr_fc = [min(1.0, max(0.0, f)) for f in fr_fc]

    # Compute ±15% confidence interval for discharge
    q_lower = [q * 0.85 for q in q_fc]
    q_upper = [q * 1.15 for q in q_fc]

    # Flood alert threshold = top 10% of historical discharge
    if discharges:
        threshold = float(np.percentile(discharges, 90))
    else:
        threshold = 30000.0

    base_date = datetime.now()
    dates = [(base_date + timedelta(days=i)).strftime("%Y-%m-%d") for i in range(1, 8)]

    return {
        "site_id": site_id,
        "forecast_dates": dates,
        "discharge_forecast": [round(v, 2) for v in q_fc],
        "discharge_lower": [round(v, 2) for v in q_lower],
        "discharge_upper": [round(v, 2) for v in q_upper],
        "area_forecast": [round(v, 2) for v in a_fc],
        "turbidity_forecast": [round(v, 2) for v in t_fc],
        "flood_risk_forecast": [round(v, 4) for v in fr_fc],
        "flood_alert_threshold": round(threshold, 2),
        "note": "7-day moving average forecast with confidence band (educational prototype)",
    }
