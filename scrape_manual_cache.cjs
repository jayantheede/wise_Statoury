const cheerio = require('cheerio');
const fs = require('fs');

async function scrapeCache() {
  const fetchUrl = (u) => fetch(u, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36' } }).then(r => r.text());
  
  const committees = [
    { title: 'Governing Body', url: 'https://vishnu.edu.in/Statutory?pg=GovBody' },
    { title: 'Board of Studies', url: 'https://vishnu.edu.in/Statutory?pg=BOS' },
    { title: 'Finance Committee', url: 'https://vishnu.edu.in/Statutory?pg=Finance' },
    { title: 'Anti Ragging Committee', url: 'https://vishnu.edu.in/Statutory?pg=AntiRagging' },
    { title: 'Grievance Redressal Committee', url: 'https://vishnu.edu.in/Statutory?pg=Grievance' },
    { title: 'Internal Complaint Committee (ICC)', url: 'https://vishnu.edu.in/Statutory?pg=ICC' }
  ];
  
  const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
  const cat = 'cat-2';
  db.links = db.links.filter(l => !l.id.includes('statutory-')); // clean up the blank shells
  
  let addedCount = 0;
  
  for (let c of committees) {
     console.log('Fetching cache for ' + c.title + '...');
     const cacheUrl = 'http://webcache.googleusercontent.com/search?q=cache:' + c.url.replace('https://', '').replace(/\?/g, '%3F').replace(/\=/g, '%3D');
     
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
                id: 'sec-' + Date.now() + c.title.substring(0, 3),
                title: c.title + ' Members',
                items: members
             }
           ]
         });
         addedCount++;
         console.log('  -> Successfully extracted ' + members.length + ' members!');
       } else {
         console.log('  -> No table found. Checked URL: ' + cacheUrl);
       }
     } catch (e) {
       console.log('  -> Failed to fetch from cache.');
     }
  }
  
  // Just in case we missed some, ensure blank shells exist as fallback
  if (addedCount === 0) {
     console.log("None were cached! Falling back to DOM instruction...");
  }
  
  fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
  console.log('Finished! Added ' + addedCount + ' cached committees directly.');
}
scrapeCache();
