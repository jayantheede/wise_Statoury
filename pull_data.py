import os
import json
import requests
from datetime import datetime
import shutil

RENDER_URL = 'https://wise-statoury-d3v1.onrender.com/api/data'
LOCAL_DB = os.path.join(os.path.dirname(__file__), 'db.json')

def pull_data():
    print("🚀 Starting data retrieval from Render...")
    
    try:
        response = requests.get(RENDER_URL)
        if response.status_code != 200:
            if response.status_code == 404:
                raise Exception("API endpoint not found on Render.")
            if response.status_code == 503:
                raise Exception("Render service is temporarily unavailable / sleeping.")
            raise Exception(f"Server responded with {response.status_code}")
        
        data = response.json()
        
        # Backup existing local data
        if os.path.exists(LOCAL_DB):
            backup_path = f"{LOCAL_DB}.backup-{datetime.now().isoformat().replace(':', '-').replace('.', '-')}"
            shutil.copy2(LOCAL_DB, backup_path)
            print(f"📦 Created local backup: {os.path.basename(backup_path)}")

        # Save cloud data locally
        with open(LOCAL_DB, 'w', encoding='utf-8') as f:
            json.dump(data, f, indent=2)
        
        print("✅ SUCCESS: All data retrieved and saved to db.json!")
        print(f"📊 Stats: {len(data.get('categories', []))} Categories, {len(data.get('links', []))} Links, {len(data.get('blogs', []))} Blogs.")
        
    except Exception as e:
        print(f"❌ FAILED to retrieve data: {e}")
        print(f"💡 Tip: Ensure your Render site is active and not in sleep mode at {RENDER_URL}")

if __name__ == '__main__':
    pull_data()
