"""
Report generation service.
Generates a downloadable HTML/PDF report for an image analysis session.
"""

import base64
from datetime import datetime
from typing import Dict, Any


def generate_html_report(analysis_result: Dict[str, Any], site_name: str = "Unknown Site") -> str:
    """Generate a clean printable HTML report from analysis results."""
    timestamp = datetime.now().strftime("%Y-%m-%d %H:%M:%S")
    metrics = analysis_result.get("metrics", {})
    discharge = analysis_result.get("discharge", {})
    turbidity = analysis_result.get("turbidity", {})
    anomaly = analysis_result.get("anomaly", {})

    # Embed original image if available
    orig_b64 = analysis_result.get("images", {}).get("original", "")
    mask_b64 = analysis_result.get("images", {}).get("segmented_mask", "")

    orig_img_tag = f'<img src="data:image/png;base64,{orig_b64}" style="max-width:350px;border-radius:8px;" />' if orig_b64 else "<p>(Image not available)</p>"
    mask_img_tag = f'<img src="data:image/png;base64,{mask_b64}" style="max-width:350px;border-radius:8px;" />' if mask_b64 else "<p>(Mask not available)</p>"

    flood_badge_color = {"Low": "#22c55e", "Moderate": "#f59e0b", "High": "#ef4444"}.get(discharge.get("flood_risk", "Low"), "#6b7280")
    anomaly_badge = "⚠️ Anomaly Detected" if anomaly.get("anomaly_detected") else "✅ Normal"

    html = f"""<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<title>AquaWatch Analysis Report</title>
<style>
  body {{ font-family: 'Segoe UI', sans-serif; background: #f8fafc; color: #1e293b; margin: 0; padding: 20px; }}
  .header {{ background: linear-gradient(135deg, #0ea5e9, #0284c7); color: white; padding: 30px; border-radius: 12px; margin-bottom: 24px; }}
  .header h1 {{ margin: 0; font-size: 26px; }}
  .header p {{ margin: 6px 0 0; opacity: 0.85; font-size: 14px; }}
  .badge {{ display: inline-block; padding: 4px 14px; border-radius: 20px; font-size: 13px; font-weight: 600; }}
  .section {{ background: white; border-radius: 12px; padding: 20px; margin-bottom: 20px; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }}
  .section h2 {{ margin-top: 0; font-size: 18px; color: #0ea5e9; border-bottom: 2px solid #e2e8f0; padding-bottom: 10px; }}
  table {{ width: 100%; border-collapse: collapse; }}
  td, th {{ padding: 10px 14px; text-align: left; border-bottom: 1px solid #e2e8f0; font-size: 14px; }}
  th {{ background: #f1f5f9; font-weight: 600; }}
  .images {{ display: flex; gap: 20px; flex-wrap: wrap; }}
  .images figure {{ margin: 0; text-align: center; }}
  .images figcaption {{ font-size: 12px; color: #64748b; margin-top: 6px; }}
  .disclaimer {{ background: #fef3c7; border-left: 4px solid #f59e0b; padding: 12px 16px; border-radius: 6px; font-size: 13px; }}
  .footer {{ text-align: center; font-size: 12px; color: #94a3b8; margin-top: 24px; }}
</style>
</head>
<body>
<div class="header">
  <h1>🌊 AquaWatch — Analysis Report</h1>
  <p>Site: <strong>{site_name}</strong> &nbsp;|&nbsp; Generated: {timestamp}</p>
</div>

<div class="section">
  <h2>📊 Analysis Results</h2>
  <table>
    <tr><th>Metric</th><th>Value</th></tr>
    <tr><td>Water Surface Area</td><td>{metrics.get('area_km2', 'N/A')} km²</td></tr>
    <tr><td>Average Channel Width</td><td>{metrics.get('avg_width_m', 'N/A')} m</td></tr>
    <tr><td>Water Coverage</td><td>{metrics.get('coverage_pct', 'N/A')} %</td></tr>
    <tr><td>Estimated Discharge</td><td>{discharge.get('discharge_m3s', 'N/A')} m³/s</td></tr>
    <tr><td>Discharge Confidence</td><td>{discharge.get('confidence_pct', 'N/A')} %</td></tr>
    <tr><td>Turbidity Score</td><td>{turbidity.get('turbidity_score', 'N/A')} / 100</td></tr>
    <tr><td>Turbidity Level</td><td>{turbidity.get('turbidity_level', 'N/A')}</td></tr>
    <tr><td>Flood Risk</td><td><span class="badge" style="background:{flood_badge_color};color:white;">{discharge.get('flood_risk', 'N/A')}</span></td></tr>
    <tr><td>Anomaly Status</td><td>{anomaly_badge}</td></tr>
    <tr><td>Simulated NDWI</td><td>{metrics.get('ndwi_simulated', 'N/A'):.4f}</td></tr>
    <tr><td>Simulated MNDWI</td><td>{metrics.get('mndwi_simulated', 'N/A'):.4f}</td></tr>
    <tr><td>Simulated AWEI</td><td>{metrics.get('awei_simulated', 'N/A'):.4f}</td></tr>
  </table>
</div>

<div class="section">
  <h2>🖼️ Image Analysis</h2>
  <div class="images">
    <figure>{orig_img_tag}<figcaption>Original Input Image</figcaption></figure>
    <figure>{mask_img_tag}<figcaption>Water Segmentation Mask</figcaption></figure>
  </div>
</div>

<div class="section">
  <h2>⚠️ Anomaly Summary</h2>
  {"<p>No anomalies detected in this analysis.</p>" if not anomaly.get('anomaly_detected') else
   f"<p><strong>Severity:</strong> {anomaly.get('severity', 'N/A').upper()}</p><ul>" +
   "".join(f"<li>⚠ {f['type']} — Value: {f['value']:.2f}</li>" for f in anomaly.get('flags', [])) + "</ul>"}
</div>

<div class="disclaimer">
  <strong>⚠️ Research Demo Approximation:</strong> This is an academic prototype simulation.
  All spectral indices (NDWI, MNDWI, AWEI) are simulated approximations from RGB imagery.
  Discharge and turbidity values are educational estimates, not calibrated measurements.
</div>

<div class="footer">
  AquaWatch — CV-Based Water Monitoring System &nbsp;|&nbsp; Academic Prototype v1.0
</div>
</body>
</html>"""

    return html
