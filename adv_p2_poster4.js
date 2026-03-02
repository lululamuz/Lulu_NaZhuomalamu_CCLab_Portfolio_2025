function makePoster4(p) {
  let font;
  let word = "DANDELION";
  let fs = 110;

  let seeds = [];

  p.preload = () => {
    font = p.loadFont("Fredoka-Regular.ttf"); // 路径要确认
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p4");

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
      sampleFactor: 0.20
    });

    for (let pt of pts) {
      seeds.push(new Seed(pt.x, pt.y));
    }
  }

  p.draw = () => {
    p.background(255, 220, 90);

    for (let s of seeds) {
      s.update();
      s.display();
    }
  };

  class Seed {
    constructor(x, y) {
      this.home = p.createVector(x, y);
      this.pos = p.createVector(x, y);
      this.vel = p.createVector(0, 0);
      this.alpha = 255;
    }

    update() {
      let d = p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y);

      if (d < 80) {
        let wind = p.createVector(this.pos.x - p.mouseX, this.pos.y - p.mouseY);
        wind.normalize();
        wind.mult(0.8);
        this.vel.add(wind);
      }

      this.vel.mult(0.96);
      this.pos.add(this.vel);

      let distFromHome = p5.Vector.dist(this.pos, this.home);
      this.alpha = p.map(distFromHome, 0, 120, 255, 80);

      if (p.dist(p.mouseX, p.mouseY, this.pos.x, this.pos.y) > 120) {
        this.pos.x = p.lerp(this.pos.x, this.home.x, 0.02);
        this.pos.y = p.lerp(this.pos.y, this.home.y, 0.02);
      }
    }

    display() {
      p.stroke(255, this.alpha);
      p.strokeWeight(2);
      p.point(this.pos.x, this.pos.y);
    }
  }
}

// ✅ 别忘了实例化
new p5(makePoster4);
