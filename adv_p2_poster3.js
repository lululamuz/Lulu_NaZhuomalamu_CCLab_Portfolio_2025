function makePoster3(p) {
  let font;
  let word = "HEDGEHOG";
  let fs = 120;

  let pgMask;     // 用来画文字做“遮罩/碰撞”
  let pgStripes;  // 用来画竖条材质

  let x, y;       // 文字基线位置
  let bg;

  p.preload = () => {
    font = p.loadFont("Fredoka-Regular.ttf"); // 路径不对就改成 assets/...
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p3");

    bg = p.color(140, 105, 75);

    pgMask = p.createGraphics(p.width, p.height);
    pgStripes = p.createGraphics(p.width, p.height);

    p.textFont(font);
    p.textSize(fs);

    while (p.textWidth(word) > p.width * 0.85) {
      fs -= 5;
      p.textSize(fs);
    }

    // 用 textBounds 真·居中
    let b = font.textBounds(word, 0, 0, fs);
    x = p.width / 2 - (b.x + b.w / 2);
    y = p.height / 2 - (b.y + b.h / 2);

    redrawMask();
  };

  function redrawMask() {
    pgMask.clear();
    pgMask.textFont(font);
    pgMask.textSize(fs);
    pgMask.noStroke();
    pgMask.fill(255);
    pgMask.text(word, x, y);
  }

  p.draw = () => {
    p.background(bg);

    const hovering = isMouseOverText(p.mouseX, p.mouseY);

    if (!hovering) {
      // 正常文字
      p.fill(255);
      p.noStroke();
      p.textFont(font);
      p.textSize(fs);
      p.text(word, x, y);
      return;
    }

    // hovering 时：画竖条材质 → mask 成文字形状
    pgStripes.clear();

    let stripeW = 7;
    let gap = 4;
    let jitter = 6;

    pgStripes.noStroke();
    for (let i = 0; i < p.width; i += stripeW + gap) {
      let offset = Math.sin((p.frameCount * 0.06) + i * 0.03) * jitter;
      pgStripes.fill(255);
      pgStripes.rect(i, 0 + offset, stripeW, p.height);
    }

    let stripesImg = pgStripes.get();
    let maskImg = pgMask.get();
    stripesImg.mask(maskImg);

    p.image(stripesImg, 0, 0);

    // 可选：淡淡描一层正常字增强可读性
    p.fill(255, 35);
    p.noStroke();
    p.text(word, x, y);
  };

  function isMouseOverText(mx, my) {
    if (mx < 0 || mx >= p.width || my < 0 || my >= p.height) return false;
    let c = pgMask.get(mx, my); // [r,g,b,a]
    return c[3] > 10;
  }
}

// ✅ 实例化（文件最底部统一写也行）
new p5(makePoster3);
