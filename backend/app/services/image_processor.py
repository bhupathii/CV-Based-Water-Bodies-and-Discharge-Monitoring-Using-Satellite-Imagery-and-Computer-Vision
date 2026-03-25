"""
Image Processing Service
Performs water body segmentation, mask generation, and metric extraction.
Uses OpenCV-based thresholding, morphology, and contour analysis.

NOTE: This is a prototype simulation. Results are research-demo approximations.
"""

import cv2
import numpy as np
import base64
import os
from typing import Tuple, Dict, Any


def _encode_image(img: np.ndarray) -> str:
    """Encode a NumPy image to base64 PNG string."""
    _, buffer = cv2.imencode(".png", img)
    return base64.b64encode(buffer).decode("utf-8")


def preprocess_image(img: np.ndarray) -> np.ndarray:
    """Resize, denoise, and normalize input image."""
    # Resize to standard processing size
    img = cv2.resize(img, (640, 480))
    # Denoise
    img = cv2.fastNlMeansDenoisingColored(img, None, h=8, hColor=8, templateWindowSize=7, searchWindowSize=21)
    return img


def simulate_spectral_indices(img: np.ndarray) -> Dict[str, float]:
    """
    SIMULATED SPECTRAL ANALYSIS (Prototype Approximation)
    
    Since true multispectral bands (NIR, SWIR) are unavailable from standard RGB images,
    we derive pseudo-band proxies from RGB channels in a demo-friendly manner.
    
    Pseudo-band mapping (educational approximation):
      - pseudo_green  ≈ G channel
      - pseudo_NIR    ≈ R channel complement weighted
      - pseudo_SWIR   ≈ inverted R (simulated)
    
    These are NOT real remote sensing indices. Labeled clearly as simulations.
    """
    img_float = img.astype(np.float32) / 255.0
    B, G, R = img_float[:, :, 0], img_float[:, :, 1], img_float[:, :, 2]

    # Pseudo-NIR: water absorbs NIR, so dark regions become "high NIR" proxy inversely
    pseudo_nir = 1.0 - R
    pseudo_green = G
    pseudo_swir = 1.0 - B

    eps = 1e-6

    # Simulated NDWI = (Green - NIR) / (Green + NIR)
    ndwi = np.mean((pseudo_green - pseudo_nir) / (pseudo_green + pseudo_nir + eps))

    # Simulated MNDWI = (Green - SWIR) / (Green + SWIR)
    mndwi = np.mean((pseudo_green - pseudo_swir) / (pseudo_green + pseudo_swir + eps))

    # Simulated AWEI = 4*(Green - SWIR) - (0.25*NIR + 2.75*SWIR)
    awei = np.mean(4 * (pseudo_green - pseudo_swir) - (0.25 * pseudo_nir + 2.75 * pseudo_swir))

    return {
        "ndwi_simulated": float(np.clip(ndwi, -1, 1)),
        "mndwi_simulated": float(np.clip(mndwi, -1, 1)),
        "awei_simulated": float(np.clip(awei, -1, 1)),
    }


def segment_water(img: np.ndarray) -> Tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Multi-approach water segmentation:
    1. HSV color-space thresholding (blue/dark-blue/teal water tones)
    2. Simulated NDWI threshold on pseudo-green/NIR channels
    3. Morphological refinement
    Returns: (binary_mask, overlay_img, contour_img)
    """
    # --- HSV Segmentation for water tones ---
    hsv = cv2.cvtColor(img, cv2.COLOR_BGR2HSV)

    # Water is typically blue-ish, dark, or slightly cyan/green
    lower_blue = np.array([85, 30, 20])
    upper_blue = np.array([140, 255, 220])
    mask_blue = cv2.inRange(hsv, lower_blue, upper_blue)

    # Some river water appears brownish/dark
    lower_dark = np.array([0, 0, 0])
    upper_dark = np.array([180, 60, 100])
    mask_dark = cv2.inRange(hsv, lower_dark, upper_dark)

    # --- Simulated NDWI threshold ---
    img_f = img.astype(np.float32) / 255.0
    B, G, R = img_f[:, :, 0], img_f[:, :, 1], img_f[:, :, 2]
    pseudo_nir = 1.0 - R
    ndwi_map = (G - pseudo_nir) / (G + pseudo_nir + 1e-6)
    mask_ndwi = (ndwi_map > 0.05).astype(np.uint8) * 255

    # Combine masks
    combined = cv2.bitwise_or(mask_blue, mask_dark)
    combined = cv2.bitwise_or(combined, mask_ndwi)

    # Morphological cleanup
    kernel = cv2.getStructuringElement(cv2.MORPH_ELLIPSE, (9, 9))
    combined = cv2.morphologyEx(combined, cv2.MORPH_CLOSE, kernel, iterations=2)
    combined = cv2.morphologyEx(combined, cv2.MORPH_OPEN, kernel, iterations=1)

    # Remove small noise blobs
    contours, _ = cv2.findContours(combined, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    min_area = img.shape[0] * img.shape[1] * 0.001  # 0.1% of image
    filtered_mask = np.zeros_like(combined)
    for cnt in contours:
        if cv2.contourArea(cnt) > min_area:
            cv2.drawContours(filtered_mask, [cnt], -1, 255, thickness=cv2.FILLED)

    binary_mask = filtered_mask

    # Overlay (semi-transparent blue over water)
    overlay = img.copy()
    water_color = np.array([180, 120, 30], dtype=np.uint8)  # BGR: warm blue
    overlay[binary_mask == 255] = (overlay[binary_mask == 255] * 0.4 + water_color * 0.6).astype(np.uint8)

    # Contour visualization
    contour_img = img.copy()
    contours_filtered, _ = cv2.findContours(binary_mask, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    cv2.drawContours(contour_img, contours_filtered, -1, (0, 255, 100), 2)

    return binary_mask, overlay, contour_img


def estimate_water_area(binary_mask: np.ndarray, scale_factor: float = 0.25) -> float:
    """
    Estimate water surface area in km².
    scale_factor: how many km² per 1000 water pixels (configurable for demo).
    """
    water_pixels = int(np.sum(binary_mask > 0))
    total_pixels = binary_mask.shape[0] * binary_mask.shape[1]
    pixel_ratio = water_pixels / total_pixels
    # Simulated area: assume image covers a ~50 km² typical monitoring frame
    area_km2 = pixel_ratio * 50.0 * scale_factor * 8
    return round(area_km2, 3)


def estimate_width(binary_mask: np.ndarray, scale_m_per_pixel: float = 10.0) -> Dict[str, float]:
    """
    Estimate average channel width by scanning horizontal slice profiles.
    Returns average, min, max width estimates.
    """
    h, w = binary_mask.shape
    widths = []
    for y in range(h // 4, 3 * h // 4, h // 20):
        row = binary_mask[y, :]
        starts = np.where(np.diff((row > 0).astype(int)) == 1)[0]
        ends = np.where(np.diff((row > 0).astype(int)) == -1)[0]
        if len(starts) > 0 and len(ends) > 0:
            # Pair starts/ends
            for s, e in zip(starts, ends[:len(starts)]):
                if e > s:
                    widths.append((e - s) * scale_m_per_pixel)

    if not widths:
        return {"avg_width_m": 0.0, "min_width_m": 0.0, "max_width_m": 0.0}

    return {
        "avg_width_m": round(float(np.mean(widths)), 1),
        "min_width_m": round(float(np.min(widths)), 1),
        "max_width_m": round(float(np.max(widths)), 1),
    }


def process_image(image_path: str) -> Dict[str, Any]:
    """
    Full image processing pipeline.
    Returns all metrics and base64-encoded output images.
    """
    img = cv2.imread(image_path)
    if img is None:
        raise ValueError(f"Cannot read image: {image_path}")

    img = preprocess_image(img)

    # Spectral simulation
    spectral = simulate_spectral_indices(img)

    # Water segmentation
    binary_mask, overlay, contour_img = segment_water(img)

    # Metrics
    area_km2 = estimate_water_area(binary_mask)
    width_info = estimate_width(binary_mask)

    # Pixel stats
    water_pixels = int(np.sum(binary_mask > 0))
    total_pixels = binary_mask.shape[0] * binary_mask.shape[1]
    coverage_pct = round(water_pixels / total_pixels * 100, 2)

    # Create 3-channel mask for display
    mask_display = cv2.cvtColor(binary_mask, cv2.COLOR_GRAY2BGR)
    mask_display[binary_mask == 255] = [180, 120, 30]

    return {
        "images": {
            "original": _encode_image(img),
            "segmented_mask": _encode_image(mask_display),
            "overlay": _encode_image(overlay),
            "contour": _encode_image(contour_img),
        },
        "metrics": {
            "water_pixels": water_pixels,
            "total_pixels": total_pixels,
            "coverage_pct": coverage_pct,
            "area_km2": area_km2,
            **width_info,
            **spectral,
        },
    }
