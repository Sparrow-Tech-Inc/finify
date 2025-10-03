// Load story content from JSON
function loadStory(storyFolder) {
  fetch(`../../content/${storyFolder}/data.json`)
    .then(response => response.json())
    .then(data => {
      document.getElementById('story-title').textContent = data.title;
      document.getElementById('story-content').textContent = data.content;
    })
    .catch(err => console.error('Error loading story:', err));
}

// Save story to localStorage
function saveStory(storyFolder) {
  fetch(`../../content/${storyFolder}/data.json`)
    .then(response => response.json())
    .then(data => {
      let savedStories = JSON.parse(localStorage.getItem('savedStories') || '[]');
      // Avoid duplicate saves
      if (!savedStories.find(story => story.id === storyFolder)) {
        savedStories.push({ id: storyFolder, title: data.title, content: data.content });
        localStorage.setItem('savedStories', JSON.stringify(savedStories));
      }
    });
}

// Function to display saved stories on save.html
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
    div.innerHTML = `<h2>${story.title}</h2><p>${story.content}</p>`;
    container.appendChild(div);
  });
}
