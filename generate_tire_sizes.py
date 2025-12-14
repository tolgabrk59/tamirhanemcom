import mysql.connector
import json
import requests
import os
from dotenv import load_dotenv
import time

load_dotenv()

# Database connection with dietpi user
db = mysql.connector.connect(
    host='localhost',
    user='dietpi',
    password='Aras2017@',
    database='randevu_db'
)

cursor = db.cursor(dictionary=True)

# Get distinct vehicles from database
cursor.execute("""
    SELECT DISTINCT brand, model
    FROM arac_dataveri
    WHERE brand IS NOT NULL AND model IS NOT NULL
    ORDER BY brand, model
    LIMIT 100
""")

vehicles = cursor.fetchall()
print(f"Found {len(vehicles)} unique vehicle combinations from database\n")

# Gemini API setup
GEMINI_API_KEY = os.getenv('GEMINI_API_KEY')
GEMINI_URL = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key={GEMINI_API_KEY}"

tire_data = []

for idx, vehicle in enumerate(vehicles):
    brand = vehicle['brand']
    model = vehicle['model']
    
    print(f"[{idx+1}/{len(vehicles)}] {brand} {model}")
    
    # Ask Gemini for tire size
    prompt = f"""For the vehicle {brand} {model}, what is the most common OEM tire size?
    
    Respond ONLY with the tire size in this exact format: 205/55R16
    Provide the most common size for this vehicle.
    Do not include any explanation, just the size."""
    
    try:
        response = requests.post(
            GEMINI_URL,
            headers={'Content-Type': 'application/json'},
            json={
                'contents': [{
                    'role': 'user',
                    'parts': [{'text': prompt}]
                }],
                'generationConfig': {
                    'temperature': 0.3,
                    'maxOutputTokens': 50,
                }
            },
            timeout=10
        )
        
        if response.status_code == 200:
            data = response.json()
            if 'candidates' in data and len(data['candidates']) > 0:
                tire_size = data['candidates'][0]['content']['parts'][0]['text'].strip()
                print(f"  → {tire_size}")
                
                tire_data.append({
                    'brand': brand,
                    'model': model,
                    'tire_size': tire_size
                })
            else:
                print(f"  → No response from AI")
        else:
            print(f"  → API Error: {response.status_code}")
            
    except Exception as e:
        print(f"  → Error: {str(e)}")
    
    # Rate limiting - wait 1 second between requests
    time.sleep(1)
    
    # Save checkpoint every 20 vehicles
    if (idx + 1) % 20 == 0:
        with open('tire_sizes_checkpoint.json', 'w', encoding='utf-8') as f:
            json.dump(tire_data, f, ensure_ascii=False, indent=2)
        print(f"\n✓ Checkpoint saved ({len(tire_data)} vehicles)\n")

# Save final data
output_file = 'src/data/tire-sizes.json'
os.makedirs('src/data', exist_ok=True)
with open(output_file, 'w', encoding='utf-8') as f:
    json.dump(tire_data, f, ensure_ascii=False, indent=2)

print(f"\n✅ Complete! Generated tire sizes for {len(tire_data)} vehicles")
print(f"Data saved to: {output_file}")

cursor.close()
db.close()
