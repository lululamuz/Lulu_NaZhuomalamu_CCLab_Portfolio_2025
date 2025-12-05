function setup() {

  // create the canvas

  canvas = createCanvas(400, 400);

  // attach the canvas to the div in your HTML
}

function draw() {
  background(225, 255, 255);

  let faceColor = map(mouseY, 0, height, 255, 150); // color changes with mouseY
  fill(faceColor, 220, 200);

  rectMode(CENTER); //face
  noStroke();
  rect(200, 200, 200, 200, 30); //x, y, width, height, corner radius

  let eyeSize = map(mouseX, 0, width, 10, 40); // eye changes

  fill(0); //eyes
  ellipse(160, 170, eyeSize, eyeSize); //left eye
  ellipse(240, 170, eyeSize, eyeSize); //right eye

  noFill();  //smile mouth
  stroke(0);
  strokeWeight(4);
  arc(200, 230, 80, 40, 0, PI); //x, y, width, height, start, stop
}


