const fs = require('fs');
const path = require('path');

const RENDER_URL = 'https://wise-statoury-d3v1.onrender.com/api/data';
const LOCAL_DB = path.resolve(__dirname, 'db.json');

async function pullData() {
  console.log("🚀 Starting data retrieval from Render...");
  
  try {
    const response = await fetch(RENDER_URL);
    if (!response.ok) throw new Error(`Server responded with ${response.status}`);
    
    const data = await response.json();
    
    // Backup existing local data just in case
    if (fs.existsSync(LOCAL_DB)) {
      fs.copyFileSync(LOCAL_DB, `${LOCAL_DB}.backup-${Date.now()}`);
      console.log("📦 Created local backup of db.json");
    }

    // Save cloud data locally
    fs.writeFileSync(LOCAL_DB, JSON.stringify(data, null, 2), 'utf8');
    
    console.log("✅ SUCCESS: All data retrieved and saved to db.json!");
    console.log(`📊 Stats: ${data.categories?.length || 0} Categories, ${data.links?.length || 0} Links, ${data.blogs?.length || 0} Blogs.`);
    
  } catch (error) {
    console.error("❌ FAILED to retrieve data:", error.message);
    console.log("Tip: Ensure your Render site is active and not in sleep mode.");
  }
}

pullData();
