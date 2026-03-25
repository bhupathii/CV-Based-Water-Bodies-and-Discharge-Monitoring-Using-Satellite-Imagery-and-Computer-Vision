import requests
import os

url = 'http://127.0.0.1:8000/api/analyze-image'
image_path = 'c:/Users/Ranjith/Desktop/CV_Based_Water_Discharge_Monitoring_System/backend/sample_data/images/river_ganga_sample.jpg'

if not os.path.exists(image_path):
    print("Image not found")
    exit(1)

files = {'file': open(image_path, 'rb')}
response = requests.post(url, files=files)

print("Status:", response.status_code)
if response.status_code != 200:
    print("Error:", response.text)
else:
    print("Success! Keys in response:", response.json().keys())
