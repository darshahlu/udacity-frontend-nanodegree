// Constants
const clickCount = document.querySelector("#click-count")
const kittenImg = document.querySelector("img")

// Logic
function updateClickCount() {
  clickCount.textContent = parseInt(clickCount.textContent, 10) + 1
}

// Listeners
kittenImg.addEventListener('click', updateClickCount)
