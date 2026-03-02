function makePoster9(p) {
  let font;
  let base = "RANDOM";

  let fs = 140;
  let y;
  let originOrder = [];
  let currentOrder = [];
  let xPositions = [];

  let shuffleInterval = 240; // ms
  let lastShuffle = 0;

  p.preload = () => {
    font = p.loadFont("assets/Fredoka-Regular.ttf");
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p9");

    p.textFont(font);

    // auto fit
    fs = 170;
    p.textSize(fs);
    while (p.textWidth(base) > p.width * 0.88) {
      fs -= 6;
      p.textSize(fs);
    }

    y = p.height / 2 + fs / 3;

    originOrder = base.split("");
    currentOrder = originOrder.map(ch => new Letter(ch));

    computeCenteredXPositions(originOrder);

    // ✅ 初始化一下位置（不然可能全挤在 0,0）
    setTargetOrder(originOrder);
    for (let l of currentOrder) {
      l.x = l.tx;
      l.y = l.ty;
    }
  };

  p.draw = () => {
    p.background(15, 18, 30);

    let hovering =
      (p.mouseX >= 0 && p.mouseX <= p.width && p.mouseY >= 0 && p.mouseY <= p.height);

    if (hovering && p.millis() - lastShuffle > shuffleInterval) {
      lastShuffle = p.millis();
      shuffleToNewOrder();
    }

    if (!hovering) {
      setTargetOrder(originOrder);
    }

    for (let i = 0; i < currentOrder.length; i++) {
      currentOrder[i].update();
      currentOrder[i].display();
    }
  };

  function shuffleToNewOrder() {
    let arr = originOrder.slice();
    do {
      arr = shuffleArray(arr);
    } while (arr.join("") === getCurrentString());

    setTargetOrder(arr);
  }

  function setTargetOrder(orderArr) {
    computeCenteredXPositions(orderArr);

    for (let i = 0; i < currentOrder.length; i++) {
      currentOrder[i].setTarget(orderArr[i], xPositions[i], y);
    }
  }

  function computeCenteredXPositions(orderArr) {
    p.textSize(fs);
    let widths = orderArr.map(ch => p.textWidth(ch));
    let total = widths.reduce((a, b) => a + b, 0);

    let startX = (p.width - total) / 2;
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
      this.x = 0;
      this.y = 0;
      this.tx = 0;
      this.ty = 0;
      this.alpha = 255;
    }

    setTarget(newCh, tx, ty) {
      this.ch = newCh;
      this.tx = tx;
      this.ty = ty;
    }

    update() {
      this.x = p.lerp(this.x, this.tx, 0.22);
      this.y = p.lerp(this.y, this.ty, 0.22);
    }

    display() {
      p.noStroke();
      p.fill(255, this.alpha);
      p.textSize(fs);
      p.text(this.ch, this.x, this.y);
    }
  }

  function shuffleArray(arr) {
    let a = arr.slice();
    for (let i = a.length - 1; i > 0; i--) {
      let j = p.floor(p.random(i + 1));
      [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
  }
}

// ✅ 实例化
new p5(makePoster9);
