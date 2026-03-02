let font;
let word = "HEDGEHOG";
let fs = 120;

let pgMask;     // 用来画文字做“遮罩/碰撞”
let pgStripes;  // 用来画竖条材质

let x, y;       // 文字基线位置
let bg;

function preload() {
  font = loadFont("Fredoka-Regular.ttf"); 
  // 换成 study guide 的字体文件名，比如:
  // font = loadFont("StudyGuideFont-Regular.ttf");
}

function setup() {
  createCanvas(600, 600);
  bg = color(140, 105, 75); // 深一点的棕色（你可继续调）

  pgMask = createGraphics(width, height);
  pgStripes = createGraphics(width, height);

  textFont(font);
  textSize(fs);

  // 自动缩放：不出边框
  while (textWidth(word) > width * 0.85) {
    fs -= 5;
    textSize(fs);
  }

  // 用 textBounds 真·居中
  let b = font.textBounds(word, 0, 0, fs);
  x = width / 2 - (b.x + b.w / 2);
  y = height / 2 - (b.y + b.h / 2);

  // 预先生成一次 mask（文字形状）
  redrawMask();
}

function redrawMask() {
  pgMask.clear();
  pgMask.textFont(font);
  pgMask.textSize(fs);
  pgMask.noStroke();
  pgMask.fill(255);
  pgMask.text(word, x, y);
}

function draw() {
  background(bg);

  const hovering = isMouseOverText(mouseX, mouseY);

  if (!hovering) {
    // 正常文字
    fill(255);
    noStroke();
    textFont(font);
    textSize(fs);
    text(word, x, y);
    return;
  }

  // hovering 时：画竖条材质（覆盖整个画布），再用文字 mask 裁切成“竖条文字”
  pgStripes.clear();

  // 竖条参数：你可以调
  let stripeW = 7;       // 每条宽度
  let gap = 4;           // 条间距
  let jitter = 6;        // 鼠标导致的抖动幅度（更有生命感）

  pgStripes.noStroke();
  for (let i = 0; i < width; i += stripeW + gap) {
    // 让竖条随着鼠标轻微波动
    let offset = sin((frameCount * 0.06) + i * 0.03) * jitter;
    pgStripes.fill(255);
    pgStripes.rect(i, 0 + offset, stripeW, height);
  }

  // 把竖条图像裁成文字形状
  let stripesImg = pgStripes.get();
  let maskImg = pgMask.get();
  stripesImg.mask(maskImg);

  image(stripesImg, 0, 0);

  // 可选：加一层很淡的正常文字轮廓，让海报更“读得清”
  fill(255, 35);
  noStroke();
  text(word, x, y);
}

// 用 mask 画布做碰撞检测：鼠标点到文字像素就算 hover
function isMouseOverText(mx, my) {
  // 防止越界
  if (mx < 0 || mx >= width || my < 0 || my >= height) return false;

  // pgMask 里文字是白色，背景透明
  let c = pgMask.get(mx, my); // [r,g,b,a]
  return c[3] > 10; // alpha 有值说明在文字上
}
