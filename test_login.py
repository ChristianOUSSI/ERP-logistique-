import urllib.request
import json

url = "https://backend-production-83b1.up.railway.app/api/auth/login"
data = json.dumps({"username": "admin@kamlog.cm", "password": "admin123"}).encode('utf-8')
headers = {'Content-Type': 'application/json'}
req = urllib.request.Request(url, data=data, headers=headers, method='POST')

try:
    with urllib.request.urlopen(req, timeout=10) as response:
        print("Status:", response.status)
        print("Response:", response.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("HTTP Error Status:", e.code)
    print("Error Response:", e.read().decode('utf-8'))
except Exception as e:
    print("Exception:", e)
