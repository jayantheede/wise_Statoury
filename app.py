import os
import json
import re
from flask import Flask, render_template, request, jsonify, redirect, url_for, session
from pymongo import MongoClient
from bson.objectid import ObjectId
from functools import wraps
import time

app = Flask(__name__)
app.secret_key = 'wise_statutory_secret_key'

# MongoDB Configuration
MONGO_URI = os.getenv('MONGO_URI', "mongodb+srv://edunexus03_db_user:1234567890@cluster0.kxw99mv.mongodb.net/edunexus?retryWrites=true&w=majority&appName=Cluster0")
client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
db = client['vishnu_statutory']
collection = db['portal_data']

def login_required(f):
    @wraps(f)
    def decorated_function(*args, **kwargs):
        if not session.get('authenticated'):
            return redirect(url_for('login'))
        return f(*args, **kwargs)
    return decorated_function

def get_portal_data():
    try:
        all_docs = list(collection.find({}))
        shards = {}
        other_data = {}

        for doc in all_docs:
            doc_id = str(doc['_id'])
            if doc_id.startswith('link_shard_'):
                match = re.match(r'^link_shard_(.+)_part_(\d+)$', doc_id)
                if match:
                    base_id, part_index = match.groups()
                    if base_id not in shards:
                        shards[base_id] = {}
                    shards[base_id][int(part_index)] = doc['data']
            else:
                other_data[doc_id] = doc

        reconstructed_links = []
        for base_id, parts in shards.items():
            indices = sorted(parts.keys())
            full_data = "".join(parts[i] for i in indices)
            try:
                reconstructed_links.append(json.loads(full_data))
            except Exception as e:
                print(f"Failed to reassemble link {base_id}: {e}")

        legacy_links = [doc['data'] for doc in all_docs if str(doc['_id']).startswith('link_item_') and doc['data']['id'] not in shards]
        
        final_links = reconstructed_links + legacy_links

        return {
            'categories': other_data.get('categories', {}).get('data', []),
            'links': final_links,
            'blogs': other_data.get('blogs', {}).get('data', []),
            'heroImage': other_data.get('settings', {}).get('heroImage', 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=2600&auto=format&fit=crop'),
            'psychologist': other_data.get('settings', {}).get('psychologist', {
                'name': 'Mr. Ram Prudhvy Teja',
                'designation': 'Sr. Psychologist',
                'qualifications': 'M.Sc. (Psychology),PG Diploma in Mental Health',
                'description': 'A psychologist studies human behavior and mental processes...',
                'mou1Link': '#',
                'mou2Link': '#'
            })
        }
    except Exception as e:
        print(f"Fetch Error: {e}")
        # Fallback to db.json if exists
        try:
            with open('db.json', 'r') as f:
                return json.load(f)
        except:
            return {'categories': [], 'links': [], 'blogs': [], 'heroImage': '', 'psychologist': {}}

@app.route('/')
def index():
    data = get_portal_data()
    return render_template('index.html', **data)

@app.route('/statutory/<link_id>')
def statutory_detail(link_id):
    data = get_portal_data()
    link = next((l for l in data['links'] if l['id'] == link_id), None)
    if not link:
        return "Not Found", 404
    return render_template('details.html', link=link, heroImage=data['heroImage'])

@app.route('/psychologist')
def psychologist():
    data = get_portal_data()
    return render_template('psychologist.html', info=data['psychologist'], heroImage=data['heroImage'])

@app.route('/blog')
def blog():
    data = get_portal_data()
    return render_template('blog.html', blogs=data['blogs'], heroImage=data['heroImage'])

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        password = request.form.get('password')
        if password == 'Admin@Wise#1':
            session['authenticated'] = True
            return redirect(url_for('admin'))
        return render_template('login.html', error="Invalid password")
    return render_template('login.html')

@app.route('/logout')
def logout():
    session.pop('authenticated', None)
    return redirect(url_for('index'))

@app.route('/admin')
@login_required
def admin():
    data = get_portal_data()
    return render_template('admin.html', **data)

@app.route('/api/save', methods=['POST'])
@login_required
def save_data():
    try:
        data = request.json
        categories = data.get('categories')
        links = data.get('links')
        blogs = data.get('blogs')
        heroImage = data.get('heroImage')
        psychologist = data.get('psychologist')

        # Atomic updates for non-sharded data
        collection.update_one({'_id': 'categories'}, {'$set': {'data': categories}}, upsert=True)
        collection.update_one({'_id': 'blogs'}, {'$set': {'data': blogs}}, upsert=True)
        collection.update_one({'_id': 'settings'}, {'$set': {'heroImage': heroImage, 'psychologist': psychologist}}, upsert=True)

        # Wipe old links
        collection.delete_many({'_id': {'$regex': '^(link_shard_|link_item_)'}})

        # Shard each link
        for link in links:
            link_id = link.get('id', f"l-{int(time.time()*1000)}")
            serialized = json.dumps(link)
            chunk_size = 5 * 1024 * 1024 # 5MB
            
            for i in range(0, len(serialized), chunk_size):
                part = i // chunk_size
                chunk = serialized[i : i + chunk_size]
                collection.update_one(
                    {'_id': f'link_shard_{link_id}_part_{part}'},
                    {'$set': {'data': chunk}},
                    upsert=True
                )

        return jsonify({'success': True})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(port=2005, debug=True)
