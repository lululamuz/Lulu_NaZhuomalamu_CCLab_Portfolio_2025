function makePoster6(p) {
  let font;
  let word = "DANDELION";
  let fs = 110;

  let seeds = [];
  let center;

  p.preload = () => {
    font = p.loadFont("Fredoka-Regular.ttf");
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p6");
    buildWord();
  };

  function buildWord() {
    seeds = [];

    p.textFont(font);
    p.textSize(fs);

    while (p.textWidth(word) > p.width * 0.85) {
      fs -= 5;
      p.textSize(fs);
    }

    let b = font.textBounds(word, 0, 0, fs);
    let x = p.width / 2 - (b.x + b.w / 2);
    let y = p.height / 2 - (b.y + b.h / 2);

    let pts = font.textToPoints(word, x, y, fs, {
      sampleFactor: 0.20,
      simplifyThreshold: 0
    });

    let sx = 0, sy = 0;
    for (let pt of pts) { sx += pt.x; sy += pt.y; }
    center = p.createVector(sx / pts.length, sy / pts.length);

    for (let pt of pts) {
      seeds.push(new Seed(pt.x, pt.y));
    }
  }

  p.draw = () => {
    p.background(255, 210, 70);

    let mx = p.mouseX;
    let my = p.mouseY;

    for (let s of seeds) {
      s.update(mx, my);
      s.display();
    }
  };

  class Seed {
    constructor(x, y) {
      this.home = p.createVector(x, y);
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(0, 0);

      this.r = p.random(20, 110);
      this.angle = p.random(p.TWO_PI);
      this.spin = p.random(0.05, 0.12);

      this.amount = 0;
      this.alpha = 255;
    }

    update(mx, my) {
      let d = p.dist(mx, my, this.home.x, this.home.y);

      let trigger = 90;
      let target = d < trigger ? 1 : 0;

      let spd = target > this.amount ? 0.18 : 0.08;
      this.amount = p.lerp(this.amount, target, spd);

      this.angle += this.spin * (0.6 + this.amount);
      let swirlX = mx + p.cos(this.angle) * this.r;
      let swirlY = my + p.sin(this.angle) * this.r;

      let tx = p.lerp(this.home.x, swirlX, this.amount);
      let ty = p.lerp(this.home.y, swirlY, this.amount);

      this.vel.x = (tx - this.pos.x) * 0.25;
      this.vel.y = (ty - this.pos.y) * 0.25;
      this.pos.add(this.vel);

      this.alpha = p.lerp(255, 140, this.amount);
    }

    display() {
      p.stroke(90, 60, 30, this.alpha);
      p.strokeWeight(2);
      p.point(this.pos.x, this.pos.y);

      if (this.amount > 0.15) {
        p.strokeWeight(1);
        p.line(this.pos.x, this.pos.y, this.pos.x - 6, this.pos.y - 8);
      }
    }
  }

  // ✅ 同页多作品必须这样写
  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") buildWord();
  };
}

// ✅ 实例化
new p5(makePoster6);
