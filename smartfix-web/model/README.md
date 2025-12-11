# Model Inference Stub

This directory contains the AI inference module for SmartFix.

## Current Implementation

`infer_stub.py` - A lightweight, deterministic stub that classifies civic issues:
- Pothole
- Overflowing Garbage
- Water Leakage
- Streetlight Not Working
- Illegal Dumping
- Other

## Usage

```bash
python infer_stub.py <image_path>
```

Returns JSON:
```json
{
  "label": "pothole",
  "confidence": 0.92
}
```

## Integration

The backend (`backend/routes.js`) calls this stub via `/api/infer` endpoint.

## Production Upgrade Path

Replace `infer_stub.py` with:

### Option 1: TensorFlow/Keras
```python
from tensorflow.keras.models import load_model
model = load_model('model.h5')
predictions = model.predict(image)
```

### Option 2: YOLO (Object Detection)
```python
from yolov8 import YOLOv8
model = YOLOv8('yolov8n.pt')
results = model.predict(image)
```

### Option 3: PyTorch
```python
import torch
model = torch.load('model.pth')
output = model(image_tensor)
```

### Option 4: Cloud-based (Google Vision API, AWS Rekognition)
```python
from google.cloud import vision
client = vision.ImageAnnotatorClient()
response = client.label_detection(image=image)
```

## Training Data

To improve the model:
1. Collect labeled images of civic issues (min. 1000 per category)
2. Use ImageNet pre-trained backbone
3. Fine-tune with transfer learning
4. Validate on held-out test set
5. Deploy using ONNX or TorchScript for efficiency

## Performance Requirements

- Inference time: < 500ms per image
- Model size: < 100MB
- Accuracy: > 85% on test set
- Supported formats: JPG, PNG, WebP

## Docker Deployment

```dockerfile
FROM python:3.9-slim
COPY infer_stub.py /app/
COPY requirements.txt /app/
RUN pip install -r requirements.txt
WORKDIR /app
CMD ["python", "infer_stub.py"]
```
