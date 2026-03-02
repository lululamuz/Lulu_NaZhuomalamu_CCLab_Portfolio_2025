function makePoster5(p) {
  let font;
  let word = "DANDELION";
  let fs = 110;

  let seeds = [];

  p.preload = () => {
    font = p.loadFont("assets/Fredoka-Regular.ttf");
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p5");

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
      sampleFactor: 0.2
    });

    for (let pt of pts) {
      seeds.push(new Seed(pt.x, pt.y));
    }
  }

  p.draw = () => {
    p.background(255, 210, 70);

    for (let s of seeds) {
      s.update();
      s.display();
    }
  };

  class Seed {
    constructor(x, y) {
      this.home = p.createVector(x, y);
      this.pos = p.createVector(x, y);
      this.falling = false;
      this.alpha = 255;
    }

    update() {
      let d = p.dist(p.mouseX, p.mouseY, this.home.x, this.home.y);

      if (d < 60 && !this.falling) {
        this.falling = true;
      }

      if (this.falling) {
        this.pos.y += p.random(1, 3);
        this.pos.x += p.random(-0.5, 0.5);
        this.alpha -= 2;

        if (this.alpha <= 0) {
          this.pos = this.home.copy();
          this.alpha = 255;
          this.falling = false;
        }
      }
    }

    display() {
      p.stroke(90, 60, 30, this.alpha);
      p.strokeWeight(2);
      p.point(this.pos.x, this.pos.y);
    }
  }
}

// ✅ 实例化
new p5(makePoster5);
