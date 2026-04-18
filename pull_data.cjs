const fs = require('fs');
const path = require('path');

const RENDER_URL = 'https://wise-statoury-d3v1.onrender.com/api/data';
const LOCAL_DB = path.resolve(__dirname, 'db.json');

async function pullData() {
  console.log("🚀 Starting data retrieval from Render...");
  
  if (typeof fetch === 'undefined') {
    console.error("❌ ERROR: 'fetch' is not defined. Please use Node.js v18 or later.");
    return;
  }

  try {
    const response = await fetch(RENDER_URL);
    if (!response.ok) {
      if (response.status === 404) throw new Error("API endpoint not found on Render.");
      if (response.status === 503) throw new Error("Render service is temporarily unavailable / sleeping.");
      throw new Error(`Server responded with ${response.status}`);
    }
    
    const data = await response.json();
    
    // Backup existing local data just in case
    if (fs.existsSync(LOCAL_DB)) {
      const backupPath = `${LOCAL_DB}.backup-${new Date().toISOString().replace(/[:.]/g, '-')}`;
      fs.copyFileSync(LOCAL_DB, backupPath);
      console.log(`📦 Created local backup: ${path.basename(backupPath)}`);
    }

    // Save cloud data locally
    fs.writeFileSync(LOCAL_DB, JSON.stringify(data, null, 2), 'utf8');
    
    console.log("✅ SUCCESS: All data retrieved and saved to db.json!");
    console.log(`📊 Stats: ${data.categories?.length || 0} Categories, ${data.links?.length || 0} Links, ${data.blogs?.length || 0} Blogs.`);
    
  } catch (error) {
    console.error("❌ FAILED to retrieve data:", error.message);
    console.log("💡 Tip: Ensure your Render site is active and not in sleep mode at " + RENDER_URL);
  }
}

pullData();
