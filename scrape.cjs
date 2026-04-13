const puppeteer = require('puppeteer');
const fs = require('fs');

(async () => {
    console.log("Launching browser...");
    const browser = await puppeteer.launch({ headless: 'new' });
    const page = await browser.newPage();
    
    // Stealth settings to avoid getting blocked
    await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36');
    await page.setExtraHTTPHeaders({ 'Accept-Language': 'en-US,en;q=0.9' });
    
    console.log("Navigating to Mandatory Disclosure...");
    await page.goto('https://vishnu.edu.in/MandatoryDisclosure', { waitUntil: 'networkidle2', timeout: 60000 });
    
    console.log("Extracting URLs inside the page for statutory committees...");
    const links = await page.evaluate(() => {
        const statutoryLinks = [];
        const anchors = document.querySelectorAll('a');
        anchors.forEach(a => {
            const title = (a.innerText || a.textContent).trim().toLowerCase();
            if(title.includes('governing body') || title.includes('academic council') || title.includes('board of studies') || title.includes('committee') || title.includes('cell') || title.includes('redressal') || title.includes('ombudsman')) {
                statutoryLinks.push({ title: (a.innerText || a.textContent).trim().replace(/\s+/g, ' '), href: a.href });
            }
        });
        
        // Sometimes they are in tables where the title is in one td and the 'View' button in another.
        const rows = document.querySelectorAll('tr');
        rows.forEach(tr => {
            const tds = tr.querySelectorAll('td');
            if(tds.length >= 2) {
                const title = tds[0].innerText.trim();
                const btn = tds[1].querySelector('a');
                if(btn && btn.href && (title.toLowerCase().includes('committee') || title.toLowerCase().includes('council') || title.toLowerCase().includes('body') || title.toLowerCase().includes('studies'))) {
                    statutoryLinks.push({ title, href: btn.href });
                }
            }
        });
        
        return statutoryLinks;
    });

    // Remove duplicates
    const uniqueLinks = [];
    const seenTitles = new Set();
    links.forEach(l => {
        // filter out javascript:, hashes, mails, empty
        if(l.href && !l.href.startsWith('javascript:') && !l.href.includes('#') && !l.href.startsWith('mailto:') && l.title && l.title !== 'View') {
            if(!seenTitles.has(l.title.toLowerCase())) {
                seenTitles.add(l.title.toLowerCase());
                uniqueLinks.push(l);
            }
        }
    });

    console.log(`Found ${uniqueLinks.length} target committees to scrape:`, uniqueLinks.map(u=>u.title));

    const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));
    const committeesCat = 'cat-2';
    
    // Clear out the dummy templates we made
    db.links = db.links.filter(l => !l.id.startsWith('committee-blank'));
    
    for(let i = 0; i < uniqueLinks.length; i++) {
        const linkObj = uniqueLinks[i];
        console.log(`Scraping Members for ${linkObj.title}... (${linkObj.href})`);
        
        // Open the specific committee page
        try {
            await page.goto(linkObj.href, { waitUntil: 'networkidle2', timeout: 30000 });
            
            // Extract the table rows
            const members = await page.evaluate(() => {
                const rows = document.querySelectorAll('table tr');
                const pMembers = [];
                rows.forEach((tr, idx) => {
                    if (idx === 0) return; // Skip header
                    const tds = tr.querySelectorAll('td');
                    if (tds.length >= 3) { // usually S.No, Name, Designation, Role
                        pMembers.push({
                            idNo: tds[0].innerText.trim(),
                            type: tds[1] ? tds[1].innerText.trim() : '',
                            description: tds[2] ? tds[2].innerText.trim() : '',
                            value: tds[3] ? tds[3].innerText.trim() : (tds[2] ? tds[2].innerText.trim() : ''),
                            isLink: false
                        });
                    }
                });
                return pMembers;
            });
            
            console.log(` -> Found ${members.length} members`);
            if (members.length > 0) {
                 // Push to database
                 db.links.push({
                    id: 'committee-auto-' + i + '-' + Date.now(),
                    title: linkObj.title,
                    url: '#',
                    categoryId: committeesCat,
                    customHeaders: ['S.No.', 'Member Name', 'Designation', 'Category/Position'],
                    sections: [
                        {
                            id: 'sec-' + Date.now(),
                            title: linkObj.title + ' Members',
                            items: members
                        }
                    ]
                 });
            }
        } catch(err) {
            console.log(` -> Failed to fetch details for ${linkObj.title}`);
        }
    }
    
    fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
    console.log("Successfully rebuilt db.json with all scraped statutory committees!");
    
    await browser.close();
})();
