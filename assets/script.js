async function loadStoryData() {
  try {
    // Get story folder path dynamically
    const currentPath = window.location.pathname;
    const storyFolder = currentPath.substring(0, currentPath.lastIndexOf("/"));
    const jsonPath = `${storyFolder}/data.json`;

    const response = await fetch(jsonPath);
    if (!response.ok) throw new Error("Failed to load story data");

    const data = await response.json();
    renderStory(data);

  } catch (err) {
    console.error("Error loading story data:", err);
  }
}

function renderStory(data) {
  // Update page title
  document.title = data.title;

  // Image loader
  const img = document.getElementById("articleImg");
  const skeleton = document.getElementById("imgSkeleton");
  img.src = data.image;
  img.onload = function() {
    skeleton.style.display = "none";
    img.style.display = "block";
  };

  // Add parts
  const container = document.querySelector(".article-box");
  container.innerHTML = data.parts.map((part, i) => `
    <div class="article-part ${i === 0 ? 'active' : ''}" id="part${i+1}">
      <h4>${part.heading}</h4>
      <p>${part.text}</p>
    </div>
  `).join("");

  // Add nav buttons
  container.innerHTML += `
    <div class="nav-btns">
      <button id="prevBtn" class="btn btn-custom-prev" disabled>
        <i class="bi bi-arrow-left-circle"></i> Previous
      </button>
      <button id="nextBtn" class="btn btn-custom-next">
        Next <i class="bi bi-arrow-right-circle"></i>
      </button>
    </div>
  `;

  setupNavigation();
}

function setupNavigation() {
  const parts = document.querySelectorAll(".article-part");
  let currentPart = 0;

  const prevBtn = document.getElementById("prevBtn");
  const nextBtn = document.getElementById("nextBtn");
  const progressBar = document.getElementById("progressBar");
  const congratsModalEl = document.getElementById("congratsModal");
  const congratsModal = new bootstrap.Modal(congratsModalEl);

  function showPart(index) {
    parts[currentPart].classList.remove("active");
    setTimeout(() => {
      parts.forEach(part => part.classList.remove("active"));
      parts[index].classList.add("active");
      currentPart = index;

      prevBtn.disabled = index === 0;
      nextBtn.disabled = index === parts.length - 1;

      let progress = ((index + 1) / parts.length) * 100;
      progressBar.style.width = progress + "%";

      if (index === parts.length - 1) {
        setTimeout(() => congratsModal.show(), 500);
      }
    }, 150);
  }

  prevBtn.addEventListener("click", () => {
    if (currentPart > 0) showPart(currentPart - 1);
  });

  nextBtn.addEventListener("click", () => {
    if (currentPart < parts.length - 1) showPart(currentPart + 1);
  });

  congratsModalEl.addEventListener("hidden.bs.modal", () => {
    showPart(0);
  });

  showPart(currentPart);
}

document.addEventListener("DOMContentLoaded", loadStoryData);
