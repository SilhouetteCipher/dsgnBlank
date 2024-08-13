let dots = [];
const dotSize = 2; // Size of each dot. Increase for larger dots.
const maxDistance = 80; // Maximum distance for cursor interaction. Increase for wider effect area.

function setup() {
  const container = document.getElementById("hero-container");
  canvas = createCanvas(container.offsetWidth, container.offsetHeight);
  canvas.parent("p5-canvas");

  createGrid();
}

function createGrid() {
  dots = [];
  let dsgnText = "dsgn"; // The text to display. Change this to display different text.

  // Adjust grid spacing based on screen width
  // Increase the divisor (60) for a denser grid, decrease for a sparser grid
  // Increase the minimum value (10) for a sparser grid on small screens
  let gridSpacing = max(width / 190, 10);

  // Adjust font size based on screen width
  // Increase the divisor (4) for smaller text, decrease for larger text
  // Increase the minimum value (80) for larger text on small screens
  let fontSize = max(width / 8, 150);

  // Create a temporary graphics buffer to draw the text
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
        // If the pixel is black (text), add more dots around it
        // This nested loop controls the density of dots for text
        // Current setting adds 9 dots (3x3 grid) for each text pixel
        // Modify the loop bounds to change text dot density
        for (let dx = -1; dx <= 1; dx++) {
          for (let dy = -1; dy <= 1; dy++) {
            // Adjust the division factor (2) to change dot spacing within text
            // Smaller values = denser text, larger values = sparser text
            let nx = x + (dx * gridSpacing) / 2;
            let ny = y + (dy * gridSpacing) / 2;
            dots.push({ x: nx, y: ny, originalX: nx, originalY: ny });
          }
        }
      } else {
        // Regular grid dot
        dots.push({ x, y, originalX: x, originalY: y });
      }
    }
  }

  gfx.remove();
}

function draw() {
  background(255); // White background. Change to another color if desired.

  for (let dot of dots) {
    let d = dist(mouseX, mouseY, dot.x, dot.y);
    if (d < maxDistance) {
      let angle = atan2(dot.y - mouseY, dot.x - mouseX);
      // Adjust the division factor (2) to change how far dots move
      // Smaller values = larger movement, larger values = smaller movement
      let pushDistance = map(d, 0, maxDistance, maxDistance / 2, 0);
      dot.x = dot.originalX + cos(angle) * pushDistance;
      dot.y = dot.originalY + sin(angle) * pushDistance;
    } else {
      // Adjust the factor (0.1) to change how quickly dots return
      // Smaller values = slower return, larger values = faster return
      dot.x = lerp(dot.x, dot.originalX, 0.1);
      dot.y = lerp(dot.y, dot.originalY, 0.1);
    }

    fill(0); // Black dots. Change to another color if desired.
    noStroke();
    ellipse(dot.x, dot.y, dotSize);
  }
}

function windowResized() {
  const container = document.getElementById("hero-container");
  resizeCanvas(container.offsetWidth, container.offsetHeight);
  createGrid();
}
