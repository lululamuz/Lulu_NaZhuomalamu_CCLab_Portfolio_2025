function makePoster2(p) {
  let font;
  let word = "HEDGEHOG";
  let fs = 120;

  let dots = [];
  let center;

  p.preload = () => {
  font = p.loadFont("assets/Fredoka-Regular.ttf");
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p2");

    adjustFontSize();
    buildWord();
  };

  function adjustFontSize() {
    p.textFont(font);
    p.textSize(fs);

    while (p.textWidth(word) > p.width * 0.85) {
      fs -= 5;
      p.textSize(fs);
    }
  }

  function buildWord() {
    dots = [];

    p.textFont(font);
    p.textSize(fs);

    let b = font.textBounds(word, 0, 0, fs);
    let x = p.width / 2 - (b.x + b.w / 2);
    let y = p.height / 2 - (b.y + b.h / 2);

    let pts = font.textToPoints(word, x, y, fs, {
      sampleFactor: 0.18,
      simplifyThreshold: 0
    });

    let sx = 0, sy = 0;
    for (let pt of pts) { sx += pt.x; sy += pt.y; }
    center = p.createVector(sx / pts.length, sy / pts.length);

    for (let pt of pts) {
      dots.push(new Dot(pt.x, pt.y, center.x, center.y));
    }
  }

  p.draw = () => {
    p.background(140, 105, 75);

    let d = p.dist(p.mouseX, p.mouseY, center.x, center.y);
    let trigger = 260;

    let raw = p.constrain(p.map(d, trigger, 0, 0, 1), 0, 1);
    let explode = Math.pow(raw, 0.25);

    for (let dot of dots) {
      dot.update(explode);
      dot.display();
    }
  };

  class Dot {
    constructor(x, y, cx, cy) {
      this.home = p.createVector(x, y);
      this.pos = p.createVector(x, y);

      this.dir = p5.Vector.sub(this.home, p.createVector(cx, cy));
      if (this.dir.mag() < 0.0001) this.dir = p.createVector(1, 0);
      this.dir.normalize();

      this.power = p.random(60, 220);
      this.phase = p.random(p.TWO_PI);
    }

    update(explode) {
      let tx = this.home.x + this.dir.x * this.power * explode;
      let ty = this.home.y + this.dir.y * this.power * explode;

      let j = p.sin(p.frameCount * 0.25 + this.phase) * 4 * explode;
      tx += this.dir.y * j;
      ty -= this.dir.x * j;

      let speedOut = 0.28;
      let speedBack = 0.14;
      let spd = explode > 0.01 ? speedOut : speedBack;

      this.pos.x = p.lerp(this.pos.x, tx, spd);
      this.pos.y = p.lerp(this.pos.y, ty, spd);
    }

    display() {
      p.stroke(255);
      p.strokeWeight(2);
      p.point(this.pos.x, this.pos.y);
    }
  }
}

// ✅ 实例化（放在文件最底部，和 Poster1 一起）：
new p5(makePoster2);
