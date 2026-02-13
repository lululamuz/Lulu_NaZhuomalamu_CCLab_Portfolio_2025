let canvas;

function setup() {
  // create the canvas
  canvas = createCanvas(600, 600);

  // attach canvas to the HTML container
  canvas.parent("sketch-container");

  angleMode(DEGREES);
}

function draw() {
  background(255, 255, 102);
  noStroke();

  let sc = second();
  let scAngle = sc * 6;

  let leftClosed = false;
  let rightClosed = false;

  // left side dog closes eyes during first half
  if (scAngle > 0 && scAngle < 180) {
    leftClosed = true;
  } else {
    rightClosed = true;
  }

  /* ===== RIGHT DOG ===== */

  fill(41, 0, 102);
  rect(width / 2, 0, width / 2, height);

  fill(10, 0, 26);
  circle(450, 333, 120);
  triangle(390, 333, 449, 295, 392, 235);
  triangle(390, 333, 497, 232, 510, 327);
  triangle(450, 387, 600, 600, 300, 600);

  if (rightClosed) {
    stroke(10, 0, 26);
    strokeWeight(3);
    line(400, 345, 440, 345);
    line(460, 345, 500, 345);
    noStroke();
  } else {
    fill(255);
    circle(420, 345, 35);
    circle(480, 345, 35);
    fill(10, 0, 26);
    ellipse(420, 350, 10, 40);
    ellipse(480, 350, 10, 40);
  }

  fill(255, 179, 255);
  ellipse(450, 370, 15, 8);

  /* ===== LEFT DOG ===== */

  fill(204, 153, 102);
  circle(145, 333, 120);
  triangle(143, 380, 0, 600, 300, 600);

  fill(172, 115, 57);
  ellipse(90, 270, 40, 70);
  ellipse(200, 270, 40, 70);

  if (leftClosed) {
    stroke(10, 0, 26);
    strokeWeight(3);
    line(100, 345, 128, 345);
    line(155, 345, 185, 345);
    noStroke();
  } else {
    fill(255);
    circle(114, 345, 35);
    circle(170, 345, 35);
    fill(10, 0, 26);
    circle(114, 345, 20);
    circle(170, 345, 20);
  }

  fill(255, 179, 255);
  ellipse(140, 370, 20, 10);

  /* ===== CLOCK ===== */

  fill(10, 0, 26);
  circle(width / 2, 120, 160);

  fill(255);
  circle(width / 2, 120, 140);

  push();
  translate(width / 2, 120);
  rotate(-90);

  stroke(200, 0, 0);
  strokeWeight(2);
  line(0, 0, cos(scAngle) * 60, sin(scAngle) * 60);

  fill(0);
  noStroke();
  circle(0, 0, 10);
  pop();

  /* ===== Mouse coordinate display ===== */

  fill(0);
  text("(" + mouseX + ", " + mouseY + ")", mouseX, mouseY);
}
