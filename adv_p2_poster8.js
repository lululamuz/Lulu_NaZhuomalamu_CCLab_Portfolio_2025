function makePoster8(p) {
  let font;
  let word = "RANDOM";
  let fs = 140;

  let dots = [];
  let center;

  let randomMode = false;

  p.preload = () => {
   font = p.loadFont("assets/Fredoka-Regular.ttf");
  };

  p.setup = () => {
    const c = p.createCanvas(600, 600);
    c.parent("canvas-p8");
    buildWord();
  };

  function buildWord() {
    dots = [];

    p.textFont(font);

    fs = 170;
    p.textSize(fs);
    while (p.textWidth(word) > p.width * 0.86) {
      fs -= 6;
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
      dots.push(new Dot(pt.x, pt.y));
    }
  }

  p.draw = () => {
    p.background(15, 18, 30);

    let d = p.dist(p.mouseX, p.mouseY, center.x, center.y);
    let influence = p.constrain(p.map(d, 260, 0, 0, 1), 0, 1);

    let baseKeep = 0.25;
    let keepProb = baseKeep + influence * 0.70; // 0.25 ~ 0.95

    for (let dot of dots) {
      dot.update(randomMode, keepProb);
      dot.display();
    }
  };

  // ✅ click toggle
  p.mousePressed = () => {
    randomMode = !randomMode;
  };

  class Dot {
    constructor(x, y) {
      this.home = p.createVector(x, y);
      this.pos = p.createVector(x, y);
      this.seed = p.random(10000);
      this.visible = true;
    }

    update(randomMode, keepProb) {
      if (!randomMode) {
        this.visible = true;
        this.pos.x = p.lerp(this.pos.x, this.home.x, 0.25);
        this.pos.y = p.lerp(this.pos.y, this.home.y, 0.25);
        return;
      }

      let r = p.noise(this.seed, p.frameCount * 0.12);
      this.visible = (r < keepProb);

      let jx = (p.noise(this.seed + 50, p.frameCount * 0.10) - 0.5) * 6;
      let jy = (p.noise(this.seed + 90, p.frameCount * 0.10) - 0.5) * 6;

      this.pos.x = p.lerp(this.pos.x, this.home.x + jx, 0.35);
      this.pos.y = p.lerp(this.pos.y, this.home.y + jy, 0.35);
    }

    display() {
      if (!this.visible) return;
      p.stroke(255);
      p.strokeWeight(2);
      p.point(this.pos.x, this.pos.y);
    }
  }

  p.keyPressed = () => {
    if (p.key === "r" || p.key === "R") buildWord();
  };
}

// ✅ 实例化
new p5(makePoster8);
