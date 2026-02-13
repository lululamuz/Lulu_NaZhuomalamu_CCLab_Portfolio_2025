let canvas;

function setup() {

  // create the canvas
  canvas = createCanvas(400, 400);

  // attach the canvas to the div in your HTML
  canvas.parent("sketch-container");
}

function draw() {
  background(225, 255, 255);

  let faceColor = map(mouseY, 0, height, 255, 150); // color changes with mouseY
  fill(faceColor, 220, 200);

  rectMode(CENTER); // face
  noStroke();
  rect(width / 2, height / 2, 200, 200, 30);

  let eyeSize = map(mouseX, 0, width, 10, 40); // eye changes

  fill(0); // eyes
  ellipse(width / 2 - 40, height / 2 - 30, eyeSize, eyeSize);
  ellipse(width / 2 + 40, height / 2 - 30, eyeSize, eyeSize);

  noFill();  // smile mouth
  stroke(0);
  strokeWeight(4);
  arc(width / 2, height / 2 + 30, 80, 40, 0, PI);
}
