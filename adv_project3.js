let model;
let modelURL = "https://teachablemachine.withgoogle.com/models/Tt7cjFUxF/";

let video;

let statusText;
let titleText;

let label = "";
let confidence = 0;
let currentSubtitle = "";

const W = 600;
const H = 600;

function setup() {
  let canvas = createCanvas(W, H);
  canvas.parent("sketch-container");

  // UI
  titleText = createDiv("Sign Subtitle Camera");
  titleText.parent("sketch-container");
  titleText.position(20, 20);
  titleText.style("color", "white");

  statusText = createDiv("Status: Loading...");
  statusText.parent("sketch-container");
  statusText.position(360, 20);
  statusText.style("color", "white");

  // camera
  video = createCapture(VIDEO);
  video.size(W, H);
  video.hide();

  loadModel();
}

function draw() {
  background(0);

  // camera
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();

  // subtitle UI
  if (currentSubtitle !== "") {
    fill(0, 180);
    rect(50, height - 120, width - 100, 60, 10);

    fill(255);
    textAlign(CENTER, CENTER);
    textSize(28);
    text(currentSubtitle, width / 2, height - 90);
  }
}

async function loadModel() {
  try {
    statusText.html("Status: Loading model...");

    const modelURLFile = modelURL + "model.json";
    const metadataURL = modelURL + "metadata.json";

    model = await tmImage.load(modelURLFile, metadataURL);

    statusText.html("Status: Ready");

    predictLoop();
  } catch (e) {
    console.error(e);
    statusText.html("Status: Model failed");
  }
}

async function predictLoop() {
  while (true) {
    await predict();
    await sleep(150);
  }
}

async function predict() {
  if (!model || !video || !video.elt) return;
  if (video.width === 0) return;

  const predictions = await model.predict(video.elt);

  let best = predictions[0];

  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i].probability > best.probability) {
      best = predictions[i];
    }
  }

  label = best.className;
  confidence = best.probability;

  console.log(label, confidence);

  if (confidence > 0.5) {
    if (label === "hi") currentSubtitle = "HELLO";
    if (label === "yes") currentSubtitle = "YES";
    if (label === "love") currentSubtitle = "LOVE";
  }
}

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

// keyboard backup
function keyPressed() {
  if (key === "1") currentSubtitle = "HELLO";
  if (key === "2") currentSubtitle = "YES";
  if (key === "3") currentSubtitle = "LOVE";
}
