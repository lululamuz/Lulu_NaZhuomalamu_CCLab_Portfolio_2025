let font;
let particles = [];
let center;
let layout;

let leftWord = "hedgeh";
let rightWord = "g";
let fs = 120; // 600x600 里稍微缩小一点更好看

function preload() {
  font = loadFont("Fredoka-Regular.ttf"); 
  // 如果字体在 assets 文件夹：
  // font = loadFont("assets/Fredoka-Regular.ttf");
}

function setup() {
  createCanvas(600, 600); // ✅ 符合作业要求
  textFont(font);
  textSize(fs);

  particles = [];

  // 垂直真正居中
  let y = height / 2 + fs / 3;

  let wLeft = textWidth(leftWord);
  let wO = textWidth("o");
  let wRight = textWidth(rightWord);

  let totalW = wLeft + wO + wRight;
  let startX = (width - totalW) / 2;

  layout = { startX, y, wLeft, wO };

  let ox = startX + wLeft;

  // 用点平均值计算中心（更稳定）
  let pts = font.textToPoints("o", ox, y, fs, {
    sampleFactor: 0.25,
    simplifyThreshold: 0
  });

  let sx = 0, sy = 0;
  for (let p of pts) {
    sx += p.x;
    sy += p.y;
  }
  center = createVector(sx / pts.length, sy / pts.length);

  for (let p of pts) {
    particles.push(new Spike(p.x, p.y, center.x, center.y));
  }
}

function draw() {
  background(210, 190, 160);

  fill(255);
  noStroke();

  text(leftWord, layout.startX, layout.y);
  text("o", layout.startX + layout.wLeft, layout.y);
  text(rightWord, layout.startX + layout.wLeft + layout.wO, layout.y);

  let d = dist(mouseX, mouseY, center.x, center.y);

  let trigger = 180; // 600 画布里稍微扩大一点触发区

  let raw = constrain(map(d, trigger, 0, 0, 1), 0, 1);
  let target = pow(raw, 0.25);

  for (let s of particles) {
    s.update(target);
    s.display();
  }
}

class Spike {
  constructor(x, y, cx, cy) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);

    this.dir = p5.Vector.sub(this.home, createVector(cx, cy));
    this.dir.normalize();

    this.amount = 0;
    this.boost = random(0.85, 1.25);
    this.phase = random(TWO_PI);
  }

  update(target) {
    let speedUp = 0.22;
    let speedDown = 0.10;

    let spd = target > this.amount ? speedUp : speedDown;
    this.amount = lerp(this.amount, target, spd);

    let maxLen = 95; // 画布缩小后刺长度也稍微缩一点
    let len = maxLen * this.boost * this.amount;

    let wiggle = sin(frameCount * 0.25 + this.phase) * 4 * this.amount;
    let perp = createVector(-this.dir.y, this.dir.x);

    this.pos.x = this.home.x + this.dir.x * len + perp.x * wiggle;
    this.pos.y = this.home.y + this.dir.y * len + perp.y * wiggle;
  }

  display() {
    stroke(255);
    strokeWeight(2);
    line(this.home.x, this.home.y, this.pos.x, this.pos.y);

    strokeWeight(3);
    point(this.pos.x, this.pos.y);
  }
}
