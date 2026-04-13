const fs = require('fs');

const db = JSON.parse(fs.readFileSync('db.json', 'utf8'));

// Delete existing generic sub-pages
db.links = db.links.filter(l => l.categoryId !== 'cat-inner-md' && !l.id.includes('committee-blank'));
db.categories = db.categories.filter(c => c.id !== 'cat-inner-md');

// Add specific statutory committees only
const committees = [
  'Governing Body',
  'Academic Council',
  'Board of Studies',
  'Finance Committee',
  'Anti Ragging Committee',
  'Grievance Redressal Committee',
  'Internal Complaint Committee (ICC)',
  'SC/ST Committee',
  'OBC Cell',
  'Minority Cell'
];

committees.forEach((title, i) => {
  // avoid duplicate academic council
  if (!db.links.find(l => l.title === title && l.categoryId === 'cat-2')) {
    db.links.push({
      id: 'statutory-' + i + '-' + Date.now(),
      title,
      url: '#',
      categoryId: 'cat-2',
      customHeaders: ['S.No.', 'Member Name', 'Designation', 'Category/Position'],
      sections: []
    });
  }
});

fs.writeFileSync('db.json', JSON.stringify(db, null, 2));
console.log('Cleaned up unnecessary pages and added ONLY specific statutory committees!');
