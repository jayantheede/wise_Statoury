const assert = require('assert');

let state = [{ id: '10', sections: [] }];
const queue = [];

const setLinks = (updater) => {
  queue.push(updater);
};

const updateLinkSections = (id, sections) => {
  setLinks(prev => prev.map(l => l.id === id ? { ...l, sections } : l));
};

const updateLink = (id, updatedLink) => {
  setLinks(prev => prev.map(l => l.id === id ? { ...l, ...updatedLink } : l));
};

// Simulate what happens in Admin.tsx
updateLinkSections('10', [{ id: 'sec-1', title: 'Hello' }]);
updateLink('10', { images: ['img.jpg'], customHeaders: ['A','B','C','D'] });

// React batches updates and runs them sequentially
let currentState = state;
for(let updater of queue) {
  currentState = updater(currentState);
}

console.log(JSON.stringify(currentState[0], null, 2));
