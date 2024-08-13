let dots = [];
const dotSize = 2;
const maxDistance = 150; // Increased for wider effect
const flockStrength = 0.03; // Adjust this to change how strongly dots flock
const returnStrength = 0.01; // Adjust this to change how quickly dots return

function setup() {
  const container = document.getElementById("hero-container");
  canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent("p5-canvas");

  createGrid();
}

function createGrid() {
  dots = [];
  let dsgnText = "dsgn";

  let gridSpacing = max(width / 190, 10);
  let fontSize = max(width / 8, 150);

  let gfx = createGraphics(width, height);
  gfx.background(255);
  gfx.fill(0);
  gfx.textSize(fontSize);
  gfx.textAlign(CENTER, CENTER);
  gfx.text(dsgnText, width / 2, height / 2);

  for (let x = 0; x < width; x += gridSpacing) {
    for (let y = 0; y < height; y += gridSpacing) {
      let c = gfx.get(x, y);
      if (c[0] === 0) {
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            let nx = x + (dx * gridSpacing) / 2;
            let ny = y + (dy * gridSpacing) / 2;
            addDot(nx, ny);
          }
        }
      } else {
        addDot(x, y);
      }
    }
  }

  gfx.remove();
}

function addDot(x, y) {
  dots.push({
    x: x,
    y: y,
    originalX: x,
    originalY: y,
    vx: 0,
    vy: 0,
  });
}

function draw() {
  background(255);

  let isMouseOverCanvas =
    mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height;

  for (let dot of dots) {
    let d = dist(mouseX, mouseY, dot.x, dot.y);

    if (isMouseOverCanvas && d < maxDistance) {
      // Flock towards cursor
      let angle = atan2(mouseY - dot.y, mouseX - dot.x);
      let strength = map(d, 0, maxDistance, flockStrength, 0);
      dot.vx += cos(angle) * strength;
      dot.vy += sin(angle) * strength;
    } else {
      // Return to original position
      let dx = dot.originalX - dot.x;
      let dy = dot.originalY - dot.y;
      dot.vx += dx * returnStrength;
      dot.vy += dy * returnStrength;
    }

    // Apply velocity
    dot.x += dot.vx;
    dot.y += dot.vy;

    // Dampen velocity
    dot.vx *= 0.95;
    dot.vy *= 0.95;

    fill(0);
    noStroke();
    ellipse(dot.x, dot.y, dotSize);
  }
}

function windowResized() {
  const container = document.getElementById("hero-container");
  resizeCanvas(container.offsetWidth, container.offsetHeight);
  createGrid();
}
