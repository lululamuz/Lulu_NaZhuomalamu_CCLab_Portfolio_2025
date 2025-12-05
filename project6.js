let data = [
  { day: "Mon", count: 180, notified: true, viewed: false },
  { day: "Tue", count: 175, notified: true, viewed: false }, // ★ 175 -> 粉色
  { day: "Wed", count: 158, notified: true, viewed: false }, // ★ 158 -> 橘色
  { day: "Thu", count: 118, notified: true, viewed: false },
  { day: "Fri", count: 137, notified: true, viewed: false },
  { day: "Sat", count: 189, notified: true, viewed: false },
  { day: "Sun", count: 146, notified: true, viewed: false }  // ★ 146 -> 橘色
];

let minCount, maxCount;

// 布局常量 —— 顶部大卡片保持不变
const CARD_W = 200;
const LEFT_CARD_X = 80;
const RIGHT_CARD_X = 320;
const CARD_Y = 80;

// 小 blocks 对齐到大卡片：两列在左卡片内、两列在右卡片内
const BOX_SIZE = 90;     // 两个 90 的方块 + 20 的 gap = 200，刚好对齐卡片宽度
const COL_GAP  = 20;
const COL_XS   = [
  LEFT_CARD_X,                          // 第一列 与左卡片左边对齐
  LEFT_CARD_X + BOX_SIZE + COL_GAP,     // 第二列 与左卡片右边对齐
  RIGHT_CARD_X,                         // 第三列 与右卡片左边对齐
  RIGHT_CARD_X + BOX_SIZE + COL_GAP     // 第四列 与右卡片右边对齐
];

// 小 blocks 整体上移（只动小 blocks）
let rowYTop = 335;             // 第一排（Mon–Thu）—— 相比之前整体上移
const ROW_GAP = 15;
const BOTTOM_ROW_EXTRA = 14;   // 第二排（Fri–Sun）在正常行距基础上再下移一点，避免与上排文字重叠
let rowYBottom = rowYTop + BOX_SIZE + ROW_GAP + BOTTOM_ROW_EXTRA;

function setup() {
  createCanvas(600, 600);
  textAlign(CENTER, CENTER);
  textFont('Helvetica');
  noStroke();
  cursor(HAND);
  minCount = min(data.map(d => d.count));
  maxCount = max(data.map(d => d.count));
}

function draw() {
  background(250, 246, 246);

  // ===== 顶部两张大卡片（位置不变） =====
  drawRoundedBox(LEFT_CARD_X, CARD_Y, CARD_W, CARD_W, color(235, 228, 228), 25);
  fill(80);
  textSize(16); text("Today", LEFT_CARD_X + CARD_W/2, CARD_Y + 30);
  textSize(42); text("Oct 10", LEFT_CARD_X + CARD_W/2, CARD_Y + 90);
  textSize(28); text("2025",   LEFT_CARD_X + CARD_W/2, CARD_Y + 130);
  textSize(14); fill(120); text("Friday", LEFT_CARD_X + CARD_W/2, CARD_Y + 160);

  drawRoundedBox(RIGHT_CARD_X, CARD_Y, CARD_W, CARD_W, color(235, 228, 228), 25);
  fill(80);
  textSize(20); text("Data Tracker", RIGHT_CARD_X + CARD_W/2, CARD_Y + 70);
  fill(130); textSize(14);
  text("How many times does Lulu", RIGHT_CARD_X + CARD_W/2, CARD_Y + 110);
  text("pick up her phone?",       RIGHT_CARD_X + CARD_W/2, CARD_Y + 130);

  // ===== 下方小 blocks（严格对齐到上方大卡片左右边界） =====
  for (let i = 0; i < data.length; i++) {
    const col = i % 4;
    const x = COL_XS[col];
    const y = (i < 4) ? rowYTop : rowYBottom; // 第二排仅用于 Fri–Sun

    // 背景色：默认淡粉；点击(viewed)后根据规则着色
    let baseColor = color(240, 233, 233);
    if (data[i].viewed) baseColor = viewedColor(data[i].count);

    fill(baseColor);
    rect(x, y, BOX_SIZE, BOX_SIZE, 22);

    // 日期
    fill(100);
    textSize(15);
    text(data[i].day, x + BOX_SIZE / 2, y + BOX_SIZE / 2);

    // 次数（只有点击后显示）
    if (data[i].viewed) {
      fill(70);
      textSize(14);
      text(`${data[i].count} times`, x + BOX_SIZE / 2, y - 18);
    }

    // 红点通知（未查看前）
    if (data[i].notified) {
      fill(220, 90, 90);
      ellipse(x + BOX_SIZE - 12, y + 12, 15, 15);
    }
  }
}

// 点击：红点消失 + 显示次数 + 着色
function mousePressed() {
  for (let i = 0; i < data.length; i++) {
    const col = i % 4;
    const x = COL_XS[col];
    const y = (i < 4) ? rowYTop : rowYBottom;

    if (mouseX > x && mouseX < x + BOX_SIZE && mouseY > y && mouseY < y + BOX_SIZE) {
      data[i].notified = false;
      data[i].viewed = true;
    }
  }
}

// 规则：点击后着色（马卡龙调）
// - 158 / 146 => 橘色
// - 175 => 粉色
// - 其余 => 从低到高，薄荷绿 -> 淡黄 -> 桃粉 -> 粉红（马卡龙渐变）
function viewedColor(count) {
  // 特定覆盖
  if (count === 175) return color(255, 192, 203);   // pastel pink（粉）
  if (count === 158 || count === 146) return color(255, 214, 165); // pastel orange（橘）

  // 渐变（低 -> 高）
  const norm = map(count, minCount, maxCount, 0, 1);
  const c1 = color(193, 255, 193); // mint green
  const c2 = color(255, 239, 186); // soft yellow
  const c3 = color(255, 203, 186); // peach pink
  const c4 = color(255, 170, 170); // pastel red
  const inter1 = lerpColor(c1, c2, constrain(norm * 1.5, 0, 1));
  const inter2 = lerpColor(c3, c4, constrain(norm, 0, 1));
  return lerpColor(inter1, inter2, norm);
}

function drawRoundedBox(x, y, w, h, c, r) {
  fill(c);
  rect(x, y, w, h, r);
}
