#!/usr/bin/env python3
"""
Component Image Generator
Generates professional automotive component images using AI API
"""

import requests
import json
import base64
import os
from pathlib import Path

# API Configuration
API_BASE_URL = "https://api14.codefast.app"
API_KEY = "sk-87gtEK7F3Emot4FGP9ov551KUJXWxyKAp31lVZpd8lqm1fAH"

# Output directory
OUTPUT_DIR = "/home/dietpi/tamirhanem-next/public/images/components"

# Component list to generate (excluding already generated ones)
COMPONENTS = [
    # Yakıt Sistemi
    {"slug": "yakit-pompasi", "name": "Yakıt Pompası", "prompt": "Professional automotive fuel pump product photo, electric fuel pump with connectors, metallic finish, white background, studio lighting, high quality automotive parts catalog style"},
    {"slug": "yakit-enjektoru", "name": "Yakıt Enjektörü", "prompt": "Professional automotive fuel injector product photo, precision fuel injector with electrical connector, metallic finish, white background, studio lighting, automotive parts photography"},
    {"slug": "yakit-deposu", "name": "Yakıt Deposu", "prompt": "Professional automotive fuel tank product photo, metal or plastic fuel tank, clean condition, white background, studio lighting, automotive parts catalog style"},
    {"slug": "yakit-basinc-regulatoru", "name": "Yakıt Basınç Regülatörü", "prompt": "Professional automotive fuel pressure regulator product photo, precision regulator valve, metallic housing, white background, studio lighting"},
    {"slug": "yakit-filtresi", "name": "Yakıt Filtresi", "prompt": "Professional automotive fuel filter product photo, cylindrical fuel filter element, clean condition, white background, studio lighting, automotive parts catalog style"},
    
    # Motor Sistemi
    {"slug": "silindir-kafasi", "name": "Silindir Kafası", "prompt": "Professional automotive cylinder head product photo, aluminum engine cylinder head with valves, metallic finish, white background, studio lighting"},
    {"slug": "piston", "name": "Piston", "prompt": "Professional automotive piston product photo, aluminum piston with rings, metallic finish, white background, studio lighting, high quality automotive parts photography"},
    {"slug": "krank-mili", "name": "Krank Mili", "prompt": "Professional automotive crankshaft product photo, forged steel crankshaft, metallic finish, white background, studio lighting, automotive parts catalog style"},
    {"slug": "eksantrik-mili", "name": "Eksantrik Mili", "prompt": "Professional automotive camshaft product photo, steel camshaft with lobes, metallic finish, white background, studio lighting, automotive parts photography"},
    {"slug": "supap", "name": "Supap", "prompt": "Professional automotive engine valve product photo, intake or exhaust valve, metallic finish, white background, studio lighting"},
    
    # Elektrik Sistemi
    {"slug": "akulatör", "name": "Akü", "prompt": "Professional automotive battery product photo, 12V car battery with terminals, black casing, white background, studio lighting, automotive parts catalog style"},
    {"slug": "alternatör", "name": "Alternatör", "prompt": "Professional automotive alternator product photo, electrical generator with pulley, metallic housing, white background, studio lighting"},
    {"slug": "mars-motoru", "name": "Marş Motoru", "prompt": "Professional automotive starter motor product photo, electric starter with gear, metallic housing, white background, studio lighting"},
    
    # Şanzıman Sistemi
    {"slug": "debriyaj-balatasi", "name": "Debriyaj Balatası", "prompt": "Professional automotive clutch disc product photo, friction clutch plate, metallic center with friction material, white background, studio lighting"},
    {"slug": "vites-kutusu", "name": "Vites Kutusu", "prompt": "Professional automotive transmission product photo, manual or automatic gearbox, metallic housing, white background, studio lighting"},
]

def generate_image(prompt: str, output_path: str) -> bool:
    """Generate image using API and save to file"""
    try:
        print(f"Generating: {output_path}")
        
        # API endpoint for image generation
        url = f"{API_BASE_URL}/v1/images/generations"
        
        headers = {
            "Authorization": f"Bearer {API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": "dall-e-3",
            "prompt": prompt,
            "n": 1,
            "size": "1024x1024",
            "quality": "standard"
        }
        
        response = requests.post(url, headers=headers, json=data, timeout=60)
        
        if response.status_code == 200:
            result = response.json()
            
            # Get image URL or base64 data
            if 'data' in result and len(result['data']) > 0:
                image_data = result['data'][0]
                
                # Download image from URL
                if 'url' in image_data:
                    img_response = requests.get(image_data['url'])
                    with open(output_path, 'wb') as f:
                        f.write(img_response.content)
                    print(f"✓ Saved: {output_path}")
                    return True
                
                # Or decode base64
                elif 'b64_json' in image_data:
                    img_data = base64.b64decode(image_data['b64_json'])
                    with open(output_path, 'wb') as f:
                        f.write(img_data)
                    print(f"✓ Saved: {output_path}")
                    return True
        
        print(f"✗ Failed: {response.status_code} - {response.text}")
        return False
        
    except Exception as e:
        print(f"✗ Error: {str(e)}")
        return False

def main():
    """Main function to generate all component images"""
    # Create output directory if it doesn't exist
    Path(OUTPUT_DIR).mkdir(parents=True, exist_ok=True)
    
    print(f"Starting image generation for {len(COMPONENTS)} components...")
    print(f"Output directory: {OUTPUT_DIR}\n")
    
    success_count = 0
    failed_count = 0
    
    for component in COMPONENTS:
        output_path = os.path.join(OUTPUT_DIR, f"{component['slug']}.png")
        
        # Skip if already exists
        if os.path.exists(output_path):
            print(f"⊘ Skipped (exists): {component['slug']}")
            continue
        
        # Generate image
        if generate_image(component['prompt'], output_path):
            success_count += 1
        else:
            failed_count += 1
    
    print(f"\n{'='*50}")
    print(f"Generation complete!")
    print(f"Success: {success_count}")
    print(f"Failed: {failed_count}")
    print(f"Total: {len(COMPONENTS)}")
    print(f"{'='*50}")

if __name__ == "__main__":
    main()
