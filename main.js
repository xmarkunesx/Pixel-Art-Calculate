const container = document.querySelector('.container');
const sizeEl = document.querySelector('.size');
let size = sizeEl.value;
const color = document.querySelector('.color');
const resetBtn = document.querySelector('.btn');
const undoBtn = document.querySelector('.undo-btn'); // Undo button

let draw = false;
let shiftPressed = false;
let history = []; // To store the history of changes

function populate(size) {
  container.style.setProperty('--size', size);
  for (let i = 0; i < size * size; i++) {
    const div = document.createElement('div');
    div.classList.add('pixel');

    // 4 köşe divini oluştur
    const corners = ['top-left', 'top-right', 'bottom-left', 'bottom-right'];
    corners.forEach(corner => {
      const cornerDiv = document.createElement('div');
      cornerDiv.classList.add('corner', corner);

      // Renk değiştirme olayları
      cornerDiv.addEventListener('mouseover', function() {
        if (!draw) return;
        if (shiftPressed) {
          addToHistory(cornerDiv); // Store the change
          drawTriangle(cornerDiv, corner);
        }
      });
      cornerDiv.addEventListener('mousedown', function() {
        if (shiftPressed) {
          addToHistory(cornerDiv); // Store the change
          drawTriangle(cornerDiv, corner);
        }
      });

      div.appendChild(cornerDiv);
    });

    div.addEventListener('mouseover', function() {
      if (!draw) return;
      if (!shiftPressed) {
        addToHistory(div); // Store the change
        div.style.backgroundColor = color.value;
        checkAndColorDiv(div);
      }
    });
    div.addEventListener('mousedown', function() {
      if (!shiftPressed) {
        addToHistory(div); // Store the change
        div.style.backgroundColor = color.value;
        checkAndColorDiv(div);
      }
    });

    container.appendChild(div);
  }
}

function drawTriangle(cornerDiv, corner) {
  const parentDiv = cornerDiv.parentElement;
  const colorValue = color.value;
  const otherColor = 'rgb(61, 61, 61)';

  // Köşe yönlerini belirleme
  const corners = {
    'top-left': 'to bottom right',
    'top-right': 'to bottom left',
    'bottom-left': 'to top right',
    'bottom-right': 'to top left'
  };

  const gradientDirection = corners[corner];
  parentDiv.style.background = `linear-gradient(${gradientDirection}, ${otherColor} 50%, ${colorValue} 50%)`;

  // Ana divin tamamen boyanması
  checkAndColorDiv(parentDiv);
}

function checkAndColorDiv(div) {
  if (areAllCornersColored(div)) {
    div.style.background = color.value;
  }
}

function areAllCornersColored(parentDiv) {
  const corners = parentDiv.querySelectorAll('.corner');
  return Array.from(corners).every(corner => {
    return corner.style.background !== '';
  });
}

window.addEventListener("mousedown", function() {
  draw = true;
});
window.addEventListener("mouseup", function() {
  draw = false;
});

window.addEventListener("keydown", function(event) {
  if (event.key === "Shift") {
    shiftPressed = true;
    document.querySelectorAll('.corner').forEach(corner => {
      corner.style.display = 'block';
    });
  }
});

window.addEventListener("keyup", function(event) {
  if (event.key === "Shift") {
    shiftPressed = false;
    document.querySelectorAll('.corner').forEach(corner => {
      if (!corner.style.backgroundColor) {
        corner.style.display = 'none';
      }
    });
  }
});

function reset() {
  container.innerHTML = '';
  populate(size);
  history = []; // Clear history on reset
}

function addToHistory(div) {
  history.push({
    element: div,
    previousColor: div.style.backgroundColor
  });
}

function undo() {
  if (history.length === 0) return;
  const lastChange = history.pop();
  lastChange.element.style.backgroundColor = lastChange.previousColor;
}

resetBtn.addEventListener('click', reset);
undoBtn.addEventListener('click', undo); // Add event listener for undo button

sizeEl.addEventListener('keyup', function() {
  size = sizeEl.value;
  reset();
});

populate(size);
