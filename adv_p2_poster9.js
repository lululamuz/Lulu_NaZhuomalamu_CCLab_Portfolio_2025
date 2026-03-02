let font;
let base = "RANDOM";

let fs = 140;
let y;
let originOrder = [];
let currentOrder = [];
let xPositions = [];

let shuffleInterval = 240; // ms, 越小越疯狂
let lastShuffle = 0;

function preload() {
  font = loadFont("Fredoka-Regular.ttf"); 
  // 最后换成 study guide 字体，比如: loadFont("YourStudyFont.ttf")
}

function setup() {
  createCanvas(600, 600);
  textFont(font);

  // 自动缩放避免出边框
  fs = 170;
  textSize(fs);
  while (textWidth(base) > width * 0.88) {
    fs -= 6;
    textSize(fs);
  }

  y = height / 2 + fs / 3;

  originOrder = base.split("");
  currentOrder = originOrder.map(ch => new Letter(ch));

  computeCenteredXPositions(originOrder);
}

function draw() {
  background(15, 18, 30); // 深蓝黑（你也可以换）

  let hovering = (mouseX >= 0 && mouseX <= width && mouseY >= 0 && mouseY <= height);

  if (hovering && millis() - lastShuffle > shuffleInterval) {
    lastShuffle = millis();
    shuffleToNewOrder();
  }

  if (!hovering) {
    // 离开时回到原顺序
    setTargetOrder(originOrder);
  }

  // 更新动画 & 绘制
  for (let i = 0; i < currentOrder.length; i++) {
    currentOrder[i].update();
    currentOrder[i].display();
  }

  // 可选小提示（想更海报就删掉）
  // drawHint(hovering);
}

function shuffleToNewOrder() {
  // 生成一个新的随机顺序（避免跟上一次完全一样）
  let arr = originOrder.slice();
  do {
    arr = shuffleArray(arr);
  } while (arr.join("") === getCurrentString());

  setTargetOrder(arr);
}

function setTargetOrder(orderArr) {
  // 计算每个位置的 x
  computeCenteredXPositions(orderArr);

  // 给每个 Letter 分配新的目标位置 + 新目标字符
  for (let i = 0; i < currentOrder.length; i++) {
    currentOrder[i].setTarget(orderArr[i], xPositions[i], y);
  }
}

function computeCenteredXPositions(orderArr) {
  textSize(fs);
  let widths = orderArr.map(ch => textWidth(ch));
  let total = widths.reduce((a, b) => a + b, 0);

  let startX = (width - total) / 2;
  xPositions = [];

  let x = startX;
  for (let i = 0; i < orderArr.length; i++) {
    xPositions.push(x);
    x += widths[i];
  }
}

function getCurrentString() {
  return currentOrder.map(l => l.ch).join("");
}

class Letter {
  constructor(ch) {
    this.ch = ch;

    // 初始位置按原顺序摆
    this.x = 0;
    this.y = 0;
    this.tx = 0;
    this.ty = 0;

    // 初始先设置一下
    this.setTarget(ch, 0, 0);
    this.x = this.tx;
    this.y = this.ty;

    this.alpha = 255;
  }

  setTarget(newCh, tx, ty) {
    this.ch = newCh;
    this.tx = tx;
    this.ty = ty;
  }

  update() {
    // 平滑滑动到新位置（动画感）
    this.x = lerp(this.x, this.tx, 0.22);
    this.y = lerp(this.y, this.ty, 0.22);
  }

  display() {
    noStroke();
    fill(255, this.alpha);
    textSize(fs);
    text(this.ch, this.x, this.y);
  }
}

function shuffleArray(arr) {
  // Fisher–Yates
  let a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    let j = floor(random(i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// 可选提示
function drawHint(hovering) {
  noStroke();
  fill(255, 120);
  textSize(14);
  textAlign(CENTER, CENTER);
  text(hovering ? "keep hovering…" : "hover to randomize", width / 2, height - 40);
  textAlign(LEFT, BASELINE);
}
