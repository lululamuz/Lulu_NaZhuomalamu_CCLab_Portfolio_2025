let font;
let word = "DANDELION";
let fs = 110;

let seeds = [];
let center;

function preload() {
  font = loadFont("Fredoka-Regular.ttf");
  // 最后记得换成 study guide 的字体文件名
}

function setup() {
  createCanvas(600, 600);
  buildWord();
}

function buildWord() {
  seeds = [];

  textFont(font);
  textSize(fs);

  // 自动缩放避免出边
  while (textWidth(word) > width * 0.85) {
    fs -= 5;
    textSize(fs);
  }

  // 居中
  let b = font.textBounds(word, 0, 0, fs);
  let x = width / 2 - (b.x + b.w / 2);
  let y = height / 2 - (b.y + b.h / 2);

  let pts = font.textToPoints(word, x, y, fs, {
    sampleFactor: 0.20,
    simplifyThreshold: 0
  });

  // 点平均值做中心（不必须，但以后好用）
  let sx = 0, sy = 0;
  for (let p of pts) { sx += p.x; sy += p.y; }
  center = createVector(sx / pts.length, sy / pts.length);

  for (let p of pts) {
    seeds.push(new Seed(p.x, p.y));
  }
}

function draw() {
  background(255, 210, 70); // 亮黄色

  // 鼠标作为旋风中心
  let mx = mouseX;
  let my = mouseY;

  for (let s of seeds) {
    s.update(mx, my);
    s.display();
  }
}

class Seed {
  constructor(x, y) {
    this.home = createVector(x, y);
    this.pos = createVector(x, y);
    this.vel = createVector(0, 0);

    // 每个种子旋风半径/角速度不同
    this.r = random(20, 110);
    this.angle = random(TWO_PI);
    this.spin = random(0.05, 0.12);

    this.amount = 0; // 0=在字形上，1=完全被卷进旋风
    this.alpha = 255;
  }

  update(mx, my) {
    // 如果鼠标靠近“这个点的原位置”，就更容易被卷走（更像风吹到字上）
    let d = dist(mx, my, this.home.x, this.home.y);

    // 触发范围
    let trigger = 90;
    let target = d < trigger ? 1 : 0;

    // 吸入旋风快一点，回形慢一点
    let spd = target > this.amount ? 0.18 : 0.08;
    this.amount = lerp(this.amount, target, spd);

    // 旋风轨道目标点
    this.angle += this.spin * (0.6 + this.amount);
    let swirlX = mx + cos(this.angle) * this.r;
    let swirlY = my + sin(this.angle) * this.r;

    // 在字形(home) 和 旋风(swirl) 之间插值
    let tx = lerp(this.home.x, swirlX, this.amount);
    let ty = lerp(this.home.y, swirlY, this.amount);

    // 加一点惯性让运动更自然
    this.vel.x = (tx - this.pos.x) * 0.25;
    this.vel.y = (ty - this.pos.y) * 0.25;
    this.pos.add(this.vel);

    // 被卷走时稍微变淡（像飞散）
    this.alpha = lerp(255, 140, this.amount);
  }

  display() {
    stroke(90, 60, 30, this.alpha); // 深棕，清晰
    strokeWeight(2);
    point(this.pos.x, this.pos.y);

    // 可选：给种子一点“绒毛感”（小短线）
    if (this.amount > 0.15) {
      strokeWeight(1);
      line(this.pos.x, this.pos.y, this.pos.x - 6, this.pos.y - 8);
    }
  }
}

function keyPressed() {
  if (key === "r" || key === "R") buildWord();
}
