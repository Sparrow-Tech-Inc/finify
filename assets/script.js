let currentStoryData = null;

// Load story content from JSON
function loadStory(storyFolder, lang = 'en') {
  fetch(`../../content/${storyFolder}/data.json`)
    .then(response => response.json())
    .then(data => {
      currentStoryData = data;
      document.getElementById('story-title').textContent = data.title[lang];
      const storyText = data.content.find(item => item.lang === lang).text;
      document.getElementById('story-content').textContent = storyText;
    })
    .catch(err => console.error('Error loading story:', err));
}

// Change language dynamically
function changeLanguage(lang) {
  if (!currentStoryData) return;
  document.getElementById('story-title').textContent = currentStoryData.title[lang];
  const storyText = currentStoryData.content.find(item => item.lang === lang).text;
  document.getElementById('story-content').textContent = storyText;
}

// Save story to localStorage
function saveStory(storyFolder) {
  fetch(`../../content/${storyFolder}/data.json`)
    .then(response => response.json())
    .then(data => {
      let savedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
      if (!savedStories.find(story => story.id === data.id)) {
        savedStories.push(data);
        localStorage.setItem('savedStories', JSON.stringify(savedStories));
      }
    });
}

// Display saved stories in save.html
function displaySavedStories() {
  const container = document.getElementById('saved-container');
  const savedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
  if (savedStories.length === 0) {
    container.innerHTML = '<p>No saved stories yet.</p>';
    return;
  }
  container.innerHTML = '';
  savedStories.forEach(story => {
    const div = document.createElement('div');
    div.className = 'saved-story';
    div.innerHTML = `
      <h2>${story.title.en}</h2>
      <p>${story.content.find(item => item.lang === 'en').text}</p>
    `;
    container.appendChild(div);
  });
}


