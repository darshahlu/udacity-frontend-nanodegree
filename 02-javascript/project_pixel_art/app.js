// Elements
const gridHeightInput = document.querySelector("#grid-height");
const gridWidthInput = document.querySelector("#grid-width");
const colorPickerInput = document.querySelector("#color-picker");
const createGridButton = document.querySelector("#create-grid-button");
const canvasTable = document.querySelector("#canvas");

// Add Listeners to Events
createGridButton.addEventListener("click", createCanvas);
canvasTable.addEventListener("click", paintCell);

// Listeners
function paintCell(event) {
  if (event.target.nodeName === 'TD') {
    console.log('paintCell');
    const cell = event.target;
    const color = colorPickerInput.value;
    cell.style.backgroundColor = color;
  }
}

function createCanvas() {
  console.log("createCanvas");

  console.log("removing canvas elements")
  while (canvasTable.firstChild) {
    canvasTable.removeChild(canvasTable.firstChild);
  }

  const gridHeight = gridHeightInput.value;
  const gridWidth = gridWidthInput.value;

  console.log(`making new canvas: ${gridHeight} x ${gridWidth}`)
  for (let row = 0; row < gridHeight; row++) {
    const newRow = document.createElement('tr');
    for (let col = 0; col < gridWidth; col++) {
      const newCol = document.createElement('td');
      newRow.appendChild(newCol);
    }
    canvasTable.appendChild(newRow);
  }
}

createCanvas();
