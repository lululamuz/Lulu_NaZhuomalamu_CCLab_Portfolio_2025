let font;
let word = "RANDOM";
let fs = 140;

let dots = [];
let center;

let randomMode = false;

function preload() {
  font = loadFont("Fredoka-Regular.ttf");
  // 最后换成 study guide 字体文件名
}

function setup() {
  createCanvas(600, 600);
  buildWord();
}

function buildWord() {
  dots = [];

  textFont(font);

  // auto fit
  fs = 170;
  textSize(fs);
  while (textWidth(word) > width * 0.86) {
    fs -= 6;
    textSize(fs);
  }

  // center
  let b = font.textBounds(word, 0, 0, fs);
  let x = width / 2 - (b.x + b.w / 2);
  let y = height / 2 - (b.y + b.h / 2);

  let pts = font.textToPoints(word, x, y, fs, {
    sampleFactor: 0.20,
    simplifyThreshold: 0
  });

  // point-average center
  let sx = 0, sy = 0;
  for (let p of pts) { sx += p.x; sy += p.y; }
  center = createVector(sx / pts.length, sy / pts.length);

  for (let p of pts) {
    dots.push(new Dot(p.x, p.y));
  }
}

function draw() {
  background(15, 18, 30); // 深色海报背景

  // 鼠标越靠近，随机模式下“保留点”的概率越高
  let d = dist(mouseX, mouseY, center.x, center.y);
  let influence = constrain(map(d, 260, 0, 0, 1), 0, 1);

  // baseKeep：随机模式下的基础保留率（越小越碎）
  let baseKeep = 0.25;
  let keepProb = baseKeep + influence * 0.70; // 0.25 ~ 0.95

  for (let dot of dots) {
    dot.update(randomMode, keepProb);
    dot.display();
  }
}

function mousePressed() {
  randomMode = !randomMode; // click toggle
}

class Dot {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.seed = random(10000);
    this.visible = true;
  }

  update(randomMode, keepProb) {
    if (!randomMode) {
      // 稳定模式：全部点都在字形上
      this.visible = true;
      this.pos.x = lerp(this.pos.x, this.home.x, 0.25);
      this.pos.y = lerp(this.pos.y, this.home.y, 0.25);
      return;
    }

    // 随机抽样：每帧用概率决定这个点显不显示
    // 给每个点一点“个性化随机”，避免所有点一起闪
    let r = noise(this.seed, frameCount * 0.12);
    this.visible = (r < keepProb);

    // 即使不飞走，也给一点微抖动（像噪声）
    let jx = (noise(this.seed + 50, frameCount * 0.10) - 0.5) * 6;
    let jy = (noise(this.seed + 90, frameCount * 0.10) - 0.5) * 6;

    this.pos.x = lerp(this.pos.x, this.home.x + jx, 0.35);
    this.pos.y = lerp(this.pos.y, this.home.y + jy, 0.35);
  }

  display() {
    if (!this.visible) return;
    stroke(255);
    strokeWeight(2);
    point(this.pos.x, this.pos.y);
  }
}

function keyPressed() {
  if (key === "r" || key === "R") buildWord();
}

