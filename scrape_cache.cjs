const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeCache() {
  const fetchUrl = (u) => fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }).then(r => r.text());
  
  console.log('Fetching Google Cache for Mandatory Disclosure...');
  const html = await fetchUrl('http://webcache.googleusercontent.com/search?q=cache:wise.ac.in/MandatoryDisclosure');
  const $ = cheerio.load(html);
  
  const committees = [];
  
  $('tr').each((i, el) => {
    const tds = $(el).find('td');
    if (tds.length >= 2) {
      const title = $(tds[0]).text().trim().replace(/\s+/g, ' ');
      const a = $(tds[1]).find('a').first();
      const href = a.attr('href');
      
      if (href && (title.toLowerCase().includes('committee') || title.toLowerCase().includes('council') || title.toLowerCase().includes('body') || title.toLowerCase().includes('studies'))) {
        committees.push({ title, href });
      }
    }
  });
  
  console.log(`Found ${committees.length} target committees:`, committees.map(c => c.title));
  
  const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const cat = 'cat-2';
  
  // Clear generic ones we added previously just in case
  db.links = db.links.filter(l => l.categoryId !== cat || l.title === 'Academic Council'); // we keep the one we manually built
  
  let addedCount = 0;
  
  for (let i = 0; i < committees.length; i++) {
     const c = committees[i];
     if (c.title === 'Academic Council') continue; // Skip manually built
     if (c.href.endsWith('.pdf')) continue; 
     
     console.log(`Fetching members for ${c.title}...`);
     let targetUrl = c.href;
     if (!targetUrl.startsWith('http')) targetUrl = 'https://wise.ac.in/' + targetUrl.replace(/^\//, '');
     
     const cacheUrl = `http://webcache.googleusercontent.com/search?q=cache:${targetUrl.replace('https://', '')}`;
     
     try {
       const subHtml = await fetchUrl(cacheUrl);
       const $sub = cheerio.load(subHtml);
       
       const members = [];
       $sub('table tr').each((j, el) => {
          if (j === 0) return; // headers
          const cols = $sub(el).find('td');
          if (cols.length >= 3) {
            members.push({
              idNo: $sub(cols[0]).text().trim(),
              type: $sub(cols[1]).text().trim(),
              description: $sub(cols[2]).text().trim(),
              value: cols.length > 3 ? $sub(cols[3]).text().trim() : $sub(cols[2]).text().trim(),
              isLink: false
            });
          }
       });
       
       if (members.length > 0) {
         db.links.push({
           id: 'cached-' + addedCount + '-' + Date.now(),
           title: c.title,
           url: '#',
           categoryId: cat,
           customHeaders: ['S.No.', 'Member Name', 'Designation', 'Category/Position'],
           sections: [
             {
                id: 'sec-' + Date.now() + j,
                title: c.title + ' Members',
                items: members
             }
           ]
         });
         addedCount++;
         console.log(`  -> Successfully extracted ${members.length} members!`);
       } else {
         console.log(`  -> No table found. Leaving blank shell.`);
         db.links.push({
           id: 'cached-' + addedCount + '-' + Date.now(),
           title: c.title,
           url: '#',
           categoryId: cat,
           customHeaders: ['S.No.', 'Member Name', 'Designation', 'Category/Position'],
           sections: []
         });
         addedCount++;
       }
     } catch (e) {
       console.log(`  -> Failed to fetch from cache.`);
     }
  }
  
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  console.log(`Finished! Rebuilt db.json with ${addedCount} cached committees.`);
}

scrapeCache();
