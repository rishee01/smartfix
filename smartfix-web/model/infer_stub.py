#!/usr/bin/env python3
"""
SmartFix AI Inference Stub

This module provides lightweight deterministic predictions for civic issue classification.
In production, replace this with a real ML model (YOLO, TensorFlow, PyTorch, etc.)

Supported labels:
- pothole
- overflowing_garbage
- water_leakage
- streetlight_not_working
- illegal_dumping
- other
"""

import json
import random
import sys
from pathlib import Path

# TODO: Replace with real ML model in production
# Example: from tensorflow.keras.models import load_model

LABELS = [
    'pothole',
    'overflowing_garbage',
    'water_leakage',
    'streetlight_not_working',
    'illegal_dumping',
    'other'
]

def predict(image_path: str) -> dict:
    """
    Predict issue type from image.
    
    Args:
        image_path: Path to image file
        
    Returns:
        dict with 'label' and 'confidence'
    """
    # Simple heuristics for demo
    path_lower = image_path.lower()
    
    if 'pothole' in path_lower:
        return {'label': 'pothole', 'confidence': 0.95}
    elif 'garbage' in path_lower or 'bin' in path_lower:
        return {'label': 'overflowing_garbage', 'confidence': 0.90}
    elif 'water' in path_lower or 'leak' in path_lower:
        return {'label': 'water_leakage', 'confidence': 0.92}
    elif 'light' in path_lower or 'streetlight' in path_lower:
        return {'label': 'streetlight_not_working', 'confidence': 0.88}
    elif 'dump' in path_lower or 'illegal' in path_lower:
        return {'label': 'illegal_dumping', 'confidence': 0.85}
    
    # Random prediction fallback
    label = random.choice(LABELS)
    confidence = round(0.70 + random.random() * 0.25, 2)
    
    return {
        'label': label,
        'confidence': confidence
    }

def main():
    """Command-line interface for inference."""
    if len(sys.argv) < 2:
        print("Usage: python infer_stub.py <image_path>")
        sys.exit(1)
    
    image_path = sys.argv[1]
    result = predict(image_path)
    print(json.dumps(result))

if __name__ == '__main__':
    main()
