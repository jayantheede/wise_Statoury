import json
import time
import os
from playwright.sync_api import sync_playwright

def scrape():
    with sync_playwright() as p:
        print("Launching browser...")
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        
        # User agent to avoid detection
        page.set_extra_http_headers({
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36",
            "Accept-Language": "en-US,en;q=0.9"
        })
        
        print("Navigating to Mandatory Disclosure...")
        try:
            page.goto('https://vishnu.edu.in/MandatoryDisclosure', wait_until='networkidle', timeout=60000)
        except Exception as e:
            print(f"Failed to load page: {e}")
            browser.close()
            return

        print("Extracting URLs inside the page for statutory committees...")
        
        # Evaluation logic
        def extract_links_logic():
            res = []
            # Extract from anchors
            anchors = page.query_selector_all('a')
            for a in anchors:
                title = a.inner_text().strip().lower()
                if any(x in title for x in ['governing body', 'academic council', 'board of studies', 'committee', 'cell', 'redressal', 'ombudsman']):
                    res.append({'title': a.inner_text().strip(), 'href': a.get_attribute('href')})
            
            # Extract from tables
            rows = page.query_selector_all('tr')
            for tr in rows:
                tds = tr.query_selector_all('td')
                if len(tds) >= 2:
                    title = tds[0].inner_text().strip()
                    btn = tds[1].query_selector('a')
                    if btn:
                        href = btn.get_attribute('href')
                        if href and any(x in title.lower() for x in ['committee', 'council', 'body', 'studies']):
                            res.append({'title': title, 'href': href})
            return res

        links = extract_links_logic()

        # Remove duplicates
        unique_links = []
        seen_titles = set()
        for l in links:
            if l['href'] and not l['href'].startswith('javascript:') and '#' not in l['href'] and not l['href'].startswith('mailto:') and l['title'] and l['title'] != 'View':
                if l['title'].lower() not in seen_titles:
                    seen_titles.add(l['title'].lower())
                    unique_links.append(l)

        print(f"Found {len(unique_links)} target committees to scrape: {[u['title'] for u in unique_links]}")

        # DB Setup
        db_path = 'db.json'
        if not os.path.exists(db_path):
            db = {"categories": [], "links": [], "blogs": [], "heroImage": "", "psychologist": {}}
        else:
            with open(db_path, 'r') as f:
                db = json.load(f)
        
        committees_cat = 'cat-2'
        db['links'] = [l for l in db.get('links', []) if not l['id'].startswith('committee-blank')]

        for i, link_obj in enumerate(unique_links):
            print(f"Scraping Members for {link_obj['title']}... ({link_obj['href']})")
            
            try:
                page.goto(link_obj['href'], wait_until='networkidle', timeout=30000)
                
                # Extract members
                rows = page.query_selector_all('table tr')
                members = []
                for idx, tr in enumerate(rows):
                    if idx == 0: continue
                    tds = tr.query_selector_all('td')
                    if len(tds) >= 3:
                        members.append({
                            'idNo': tds[0].inner_text().strip(),
                            'type': tds[1].inner_text().strip() if len(tds) > 1 else '',
                            'description': tds[2].inner_text().strip() if len(tds) > 2 else '',
                            'value': tds[3].inner_text().strip() if len(tds) > 3 else (tds[2].inner_text().strip() if len(tds) > 2 else ''),
                            'isLink': False
                        })
                
                print(f" -> Found {len(members)} members")
                if len(members) > 0:
                    db['links'].append({
                        'id': f'committee-auto-{i}-{int(time.time()*1000)}',
                        'title': link_obj['title'],
                        'url': '#',
                        'categoryId': committees_cat,
                        'customHeaders': ['S.No.', 'Member Name', 'Designation', 'Category/Position'],
                        'sections': [{
                            'id': f'sec-{int(time.time()*1000)}',
                            'title': f"{link_obj['title']} Members",
                            'items': members
                        }]
                    })
            except Exception as e:
                print(f" -> Failed to fetch details for {link_obj['title']}: {e}")

        with open(db_path, 'w') as f:
            json.dump(db, f, indent=2)
        
        print("Successfully rebuilt db.json with all scraped statutory committees!")
        browser.close()

if __name__ == '__main__':
    scrape()
