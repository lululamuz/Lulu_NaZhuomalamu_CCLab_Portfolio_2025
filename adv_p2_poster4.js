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

  // 自动缩放避免溢出
  while (textWidth(word) > width * 0.85) {
    fs -= 5;
    textSize(fs);
  }

  let b = font.textBounds(word, 0, 0, fs);
  let x = width / 2 - (b.x + b.w / 2);
  let y = height / 2 - (b.y + b.h / 2);

  let pts = font.textToPoints(word, x, y, fs, {
    sampleFactor: 0.20
  });

  for (let p of pts) {
    seeds.push(new Seed(p.x, p.y));
  }
}

function draw() {
background(255, 220, 90);

  for (let s of seeds) {
    s.update();
    s.display();
  }
}

class Seed {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);
    this.alpha = 255;
  }

  update() {
    // 鼠标像风一样推动种子
    let d = dist(mouseX, mouseY, this.pos.x, this.pos.y);

    if (d < 80) {
      let wind = createVector(this.pos.x - mouseX, this.pos.y - mouseY);
      wind.normalize();
      wind.mult(0.8);
      this.vel.add(wind);
    }

    // 慢慢减速
    this.vel.mult(0.96);
    this.pos.add(this.vel);

    // 透明度随距离变化
    let distFromHome = p5.Vector.dist(this.pos, this.home);
    this.alpha = map(distFromHome, 0, 120, 255, 80);

    // 如果鼠标远离，慢慢回家
    if (dist(mouseX, mouseY, this.pos.x, this.pos.y) > 120) {
      this.pos.x = lerp(this.pos.x, this.home.x, 0.02);
      this.pos.y = lerp(this.pos.y, this.home.y, 0.02);
    }
  }

  display() {
    stroke(255, this.alpha);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
}
