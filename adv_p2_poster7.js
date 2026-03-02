let font;
let word = "RANDOM";
let fs = 140;

let dots = [];
let wordCenter;
let trigger = 170;

function preload() {
  // Replace with a font from your study guide
  font = loadFont("Fredoka-Regular.ttf");
}

function setup() {
  createCanvas(600, 600);
  buildWord();
}

function buildWord() {
  dots = [];

  textFont(font);

  // Auto scale so the word fits
  fs = 160;
  textSize(fs);
  while (textWidth(word) > width * 0.86) {
    fs -= 6;
    textSize(fs);
  }

  // Center the word precisely
  let b = font.textBounds(word, 0, 0, fs);
  let x = width / 2 - (b.x + b.w / 2);
  let y = height / 2 - (b.y + b.h / 2);

  let pts = font.textToPoints(word, x, y, fs, {
    sampleFactor: 0.20,
    simplifyThreshold: 0
  });

  // Word center (average of points)
  let sx = 0, sy = 0;
  for (let p of pts) { sx += p.x; sy += p.y; }
  wordCenter = createVector(sx / pts.length, sy / pts.length);

  for (let p of pts) {
    dots.push(new Dot(p.x, p.y));
  }
}

function draw() {
background(20);

  // Mouse proximity strength (0..1)
  let d = dist(mouseX, mouseY, wordCenter.x, wordCenter.y);
  let raw = constrain(map(d, trigger, 0, 0, 1), 0, 1);
  let shatter = pow(raw, 0.22); // snappier

  for (let dot of dots) {
    dot.update(shatter);
    dot.display();
  }
}

class Dot {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);

    // Each dot gets a "random" screen destination
    this.dest = createVector(random(width), random(height));

    // Add some variation so it feels chaotic
    this.seed = random(1000);
  }

  update(shatter) {
    // Target position blends between word (home) and random (dest)
    let tx = lerp(this.home.x, this.dest.x, shatter);
    let ty = lerp(this.home.y, this.dest.y, shatter);

    // Micro-jitter when shattering (looks more random)
    let j = (noise(this.seed, frameCount * 0.03) - 0.5) * 16 * shatter;
    tx += j;
    ty -= j * 0.6;

    // Shatter fast, return slower (feels nice)
    let speedOut = 0.30;
    let speedBack = 0.12;
    let spd = shatter > 0.02 ? speedOut : speedBack;

    this.pos.x = lerp(this.pos.x, tx, spd);
    this.pos.y = lerp(this.pos.y, ty, spd);
  }

  display() {
    stroke(255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
}

// Press R to re-randomize the shatter pattern (nice for iteration)
function keyPressed() {
  if (key === "r" || key === "R") buildWord();
}
