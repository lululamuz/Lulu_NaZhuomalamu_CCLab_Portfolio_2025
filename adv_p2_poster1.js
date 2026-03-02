function makePoster1(p) {
  let font;
  let particles = [];
  let center;
  let layout;

  let leftWord = "hedgeh";
  let rightWord = "g";
  let fs = 120;

  p.preload = () => {
    // 注意：字体路径要对！如果字体在根目录，就这样；
    // 如果在 assets 文件夹，用 "assets/Fredoka-Regular.ttf"
    font = p.loadFont("assets/Fredoka-Regular.ttf");
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p1"); // ✅ 关键：挂到 adv_project2.html 里的容器

    p.textFont(font);
    p.textSize(fs);

    particles = [];

    let y = p.height / 2 + fs / 3;

    let wLeft = p.textWidth(leftWord);
    let wO = p.textWidth("o");
    let wRight = p.textWidth(rightWord);

    let totalW = wLeft + wO + wRight;
    let startX = (p.width - totalW) / 2;

    layout = { startX, y, wLeft, wO };

    let ox = startX + wLeft;

    let pts = font.textToPoints("o", ox, y, fs, {
      sampleFactor: 0.25,
      simplifyThreshold: 0
    });

    let sx = 0, sy = 0;
    for (let pt of pts) {
      sx += pt.x;
      sy += pt.y;
    }
    center = p.createVector(sx / pts.length, sy / pts.length);

    for (let pt of pts) {
      particles.push(new Spike(pt.x, pt.y, center.x, center.y));
    }
  };

  p.draw = () => {
    p.background(210, 190, 160);

    p.fill(255);
    p.noStroke();

    p.text(leftWord, layout.startX, layout.y);
    p.text("o", layout.startX + layout.wLeft, layout.y);
    p.text(rightWord, layout.startX + layout.wLeft + layout.wO, layout.y);

    let d = p.dist(p.mouseX, p.mouseY, center.x, center.y);

    let trigger = 180;
    let raw = p.constrain(p.map(d, trigger, 0, 0, 1), 0, 1);
    let target = Math.pow(raw, 0.25);

    for (let s of particles) {
      s.update(target);
      s.display();
    }
  };

  class Spike {
    constructor(x, y, cx, cy) {
      this.home = p.createVector(x, y);
      this.pos = p.createVector(x, y);

      this.dir = p5.Vector.sub(this.home, p.createVector(cx, cy));
      this.dir.normalize();

      this.amount = 0;
      this.boost = p.random(0.85, 1.25);
      this.phase = p.random(p.TWO_PI);
    }

    update(target) {
      let speedUp = 0.22;
      let speedDown = 0.10;

      let spd = target > this.amount ? speedUp : speedDown;
      this.amount = p.lerp(this.amount, target, spd);

      let maxLen = 95;
      let len = maxLen * this.boost * this.amount;

      let wiggle = p.sin(p.frameCount * 0.25 + this.phase) * 4 * this.amount;
      let perp = p.createVector(-this.dir.y, this.dir.x);

      this.pos.x = this.home.x + this.dir.x * len + perp.x * wiggle;
      this.pos.y = this.home.y + this.dir.y * len + perp.y * wiggle;
    }

    display() {
      p.stroke(255);
      p.strokeWeight(2);
      p.line(this.home.x, this.home.y, this.pos.x, this.pos.y);

      p.strokeWeight(3);
      p.point(this.pos.x, this.pos.y);
    }
  }
}

// ✅ 最后别忘了实例化：
new p5(makePoster1);
