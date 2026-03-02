let font;
let word = "HEDGEHOG"; // 换成你的第二个词
let fs = 120;

let dots = [];
let center;

function preload() {
  font = loadFont("Fredoka-Regular.ttf");
}

function setup() {
  createCanvas(600, 600);
  adjustFontSize();  // ✅ 自动调整大小
  buildWord();
}

function adjustFontSize() {
  textFont(font);
  textSize(fs);

  // 如果文字太宽就缩小
  while (textWidth(word) > width * 0.85) {
    fs -= 5;
    textSize(fs);
  }
}

function buildWord() {
  dots = [];

  textFont(font);
  textSize(fs);

  let b = font.textBounds(word, 0, 0, fs);
  let x = width / 2 - (b.x + b.w / 2);
  let y = height / 2 - (b.y + b.h / 2);

  let pts = font.textToPoints(word, x, y, fs, {
    sampleFactor: 0.18,
    simplifyThreshold: 0
  });

  let sx = 0, sy = 0;
  for (let p of pts) { sx += p.x; sy += p.y; }
  center = createVector(sx / pts.length, sy / pts.length);

  for (let p of pts) {
    dots.push(new Dot(p.x, p.y, center.x, center.y));
  }
}

function draw() {
  // ✅ 更深、更高级的棕色
  background(140, 105, 75);

  let d = dist(mouseX, mouseY, center.x, center.y);
  let trigger = 260;

  let raw = constrain(map(d, trigger, 0, 0, 1), 0, 1);
  let explode = pow(raw, 0.25);

  for (let dot of dots) {
    dot.update(explode);
    dot.display();
  }
}

class Dot {
  constructor(x, y, cx, cy) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);

    this.dir = p5.Vector.sub(this.home, createVector(cx, cy));
    if (this.dir.mag() < 0.0001) this.dir = createVector(1, 0);
    this.dir.normalize();

    this.power = random(60, 220);
    this.phase = random(TWO_PI);
  }

  update(explode) {
    let tx = this.home.x + this.dir.x * this.power * explode;
    let ty = this.home.y + this.dir.y * this.power * explode;

    let j = sin(frameCount * 0.25 + this.phase) * 4 * explode;
    tx += this.dir.y * j;
    ty -= this.dir.x * j;

    let speedOut = 0.28;
    let speedBack = 0.14;
    let spd = explode > 0.01 ? speedOut : speedBack;

    this.pos.x = lerp(this.pos.x, tx, spd);
    this.pos.y = lerp(this.pos.y, ty, spd);
  }

  display() {
    stroke(255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
}
