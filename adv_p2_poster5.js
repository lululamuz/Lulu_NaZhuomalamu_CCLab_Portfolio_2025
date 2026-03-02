let font;
let word = "DANDELION";
let fs = 110;

let seeds = [];

function preload() {
  font = loadFont("Fredoka-Regular.ttf");
}

function setup() {
  createCanvas(600, 600);
  buildWord();
}

function buildWord() {
  seeds = [];

  textFont(font);
  textSize(fs);

  while (textWidth(word) > width * 0.85) {
    fs -= 5;
    textSize(fs);
  }

  let b = font.textBounds(word, 0, 0, fs);
  let x = width / 2 - (b.x + b.w / 2);
  let y = height / 2 - (b.y + b.h / 2);

  let pts = font.textToPoints(word, x, y, fs, {
    sampleFactor: 0.2
  });

  for (let p of pts) {
    seeds.push(new Seed(p.x, p.y));
  }
}

function draw() {
  background(255, 210, 70); // 亮黄色

  for (let s of seeds) {
    s.update();
    s.display();
  }
}

class Seed {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.falling = false;
    this.alpha = 255;
  }

  update() {
    let d = dist(mouseX, mouseY, this.home.x, this.home.y);

    // 鼠标靠近开始脱落
    if (d < 60 && !this.falling) {
      this.falling = true;
    }

    if (this.falling) {
      this.pos.y += random(1, 3);
      this.pos.x += random(-0.5, 0.5);
      this.alpha -= 2;

      // 掉到一定程度后回到原位
      if (this.alpha <= 0) {
        this.pos = this.home.copy();
        this.alpha = 255;
        this.falling = false;
      }
    }
  }

  display() {
    stroke(90, 60, 30, this.alpha);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
}
