let model;
let modelURL = "https://teachablemachine.withgoogle.com/models/Tt7cjFUxF/";

let video;
let overlay;

let startButton;
let clearButton;
let instructionText;
let statusText;
let titleText;

let cameraStarted = false;
let modelLoaded = false;
let isPredicting = false;

let currentSubtitle = "";
let currentStatus = "Camera off";
let subtitleTimer = 0;
let subtitleDuration = 180;

let label = "idle";
let confidence = 0;

let stableLabel = "";
let stableCount = 0;
let lastTriggeredLabel = "";

const CANVAS_W = 600;
const CANVAS_H = 600;

function setup() {
  let canvas = createCanvas(CANVAS_W, CANVAS_H);
  canvas.parent("sketch-container");

  overlay = createGraphics(CANVAS_W, CANVAS_H);

  setupDOM();
}

function draw() {
  background(0);

  if (cameraStarted && video) {
    drawCamera();
  } else {
    drawCameraPlaceholder();
  }

  drawOverlayUI();
  image(overlay, 0, 0);

  handleSubtitleTimer();
}

function setupDOM() {
  titleText = createDiv("Sign Subtitle Camera");
  titleText.parent("sketch-container");
  titleText.position(20, 20);
  titleText.style("color", "white");

  statusText = createDiv("Status: Camera off");
  statusText.parent("sketch-container");
  statusText.position(360, 20);
  statusText.style("color", "white");

  startButton = createButton("Start Camera");
  startButton.parent("sketch-container");
  startButton.position(20, 550);
  startButton.mousePressed(startCamera);

  clearButton = createButton("Clear");
  clearButton.parent("sketch-container");
  clearButton.position(140, 550);
  clearButton.mousePressed(clearSubtitle);
}

async function startCamera() {
  if (cameraStarted) return;

  video = createCapture(VIDEO);
  video.size(CANVAS_W, CANVAS_H);
  video.hide();

  cameraStarted = true;
  currentStatus = "Camera on";
  updateStatus();

  await loadModel();
}

async function loadModel() {
  try {
    currentStatus = "Loading model...";
    updateStatus();

    const modelURLFile = modelURL + "model.json";
    const metadataURL = modelURL + "metadata.json";

    model = await tmImage.load(modelURLFile, metadataURL);

    modelLoaded = true;
    currentStatus = "Waiting...";
    updateStatus();

    startPredictionLoop();
  } catch (error) {
    console.error(error);
    currentStatus = "Model failed";
    updateStatus();
  }
}

function startPredictionLoop() {
  if (isPredicting || !modelLoaded) return;
  isPredicting = true;
  predictLoop();
}

async function predictLoop() {
  while (cameraStarted && modelLoaded) {
    await predict();
    await sleep(150);
  }
}

async function predict() {
  if (!model || !video || !video.elt) return;

  if (video.width === 0) return; // ⭐️ 关键修复

  const predictions = await model.predict(video.elt);

  let bestPrediction = predictions[0];

  for (let i = 1; i < predictions.length; i++) {
    if (predictions[i].probability > bestPrediction.probability) {
      bestPrediction = predictions[i];
    }
  }

  label = bestPrediction.className;
  confidence = bestPrediction.probability;

  console.log(label, confidence);

  handleStablePrediction(label, confidence);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function drawCamera() {
  push();
  translate(width, 0);
  scale(-1, 1);
  image(video, 0, 0, width, height);
  pop();
}

function drawCameraPlaceholder() {
  background(20);
  fill(255);
  textAlign(CENTER, CENTER);
  text("Click Start Camera", width / 2, height / 2);
}

function drawOverlayUI() {
  overlay.clear();

  if (currentSubtitle !== "") {
    overlay.fill(0, 180);
    overlay.rect(50, height - 120, width - 100, 60, 10);

    overlay.fill(255);
    overlay.textAlign(CENTER, CENTER);
    overlay.textSize(28);
    overlay.text(currentSubtitle, width / 2, height - 90);
  }
}

function handleStablePrediction(label, confidence) {
  if (confidence < 0.5) return;

  if (label === stableLabel) {
    stableCount++;
  } else {
    stableLabel = label;
    stableCount = 1;
  }

  if (stableCount > 2 && label !== lastTriggeredLabel) {
    if (label === "hi") triggerSubtitle("HELLO");
    if (label === "yes") triggerSubtitle("YES");
    if (label === "love") triggerSubtitle("LOVE");

    lastTriggeredLabel = label;
  }
}

function triggerSubtitle(word) {
  currentSubtitle = word;
  subtitleTimer = subtitleDuration;
  currentStatus = "Detected: " + word;
  updateStatus();
}

function clearSubtitle() {
  currentSubtitle = "";
}

function updateStatus() {
  statusText.html("Status: " + currentStatus);
}

function handleSubtitleTimer() {
  if (subtitleTimer > 0) {
    subtitleTimer--;
    if (subtitleTimer === 0) {
      currentSubtitle = "";
    }
  }
}

function keyPressed() {
  if (key === "1") triggerSubtitle("HELLO");
  if (key === "2") triggerSubtitle("YES");
  if (key === "3") triggerSubtitle("LOVE");
}
