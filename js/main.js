import { getMs } from "./helpers.js";
import { Vector } from "./classes.js";

const canvas = document.getElementById("canvas");
/** @type {CanvasRenderingContext2D} */ const ctx = canvas.getContext("2d");
const optionsDiv = document.getElementById("optionsDiv");
const lengthRange = document.getElementById("rangeInput");
const resetButton = document.getElementById("resetButton");
const width = Math.min(window.innerWidth, window.innerHeight) / 1.1;
const height = Math.min(window.innerWidth, window.innerHeight) / 1.76;

let angle = 0;
let length = 5;
let wave = [];
let scale = width / 10;

function setup() {
  canvas.width = width;
  canvas.height = height;
  ctx.fillStyle = getComputedStyle(document.documentElement).getPropertyValue("--fuchsia");
  ctx.strokeStyle = getComputedStyle(document.documentElement).getPropertyValue("--fuchsia");
  ctx.lineWidth = 2;
  lengthRange.addEventListener("input", () => {
    length = parseInt(lengthRange.value);
  });
  resetButton.addEventListener("click", () => {
    reset();
  });
}

function draw() {
  ctx.save();
  ctx.translate(3 * scale, height / 2);
  const point = new Vector(0, 0);
  for (let k = 1; k <= length; k++) {
    const prevPoint = new Vector(point.x, point.y);
    let n = 2 * k - 1;
    let r = (scale / 1.25) * (4 / (n * Math.PI));
    point.add(new Vector(r * Math.cos(n * angle), r * Math.sin(n * angle)));

    //Draw Circles
    ctx.globalAlpha = 0.25;
    ctx.beginPath();
    ctx.arc(prevPoint.x, prevPoint.y, r, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.stroke();
    ctx.globalAlpha = 1;

    //Draw Lines
    ctx.beginPath();
    ctx.moveTo(prevPoint.x, prevPoint.y);
    ctx.lineTo(point.x, point.y);
    ctx.closePath();
    ctx.stroke();

    //Draw joints
    ctx.beginPath();
    ctx.arc(point.x, point.y, scale / 25, 0, 2 * Math.PI);
    ctx.closePath();
    ctx.fill();
  }
  wave.unshift(point.y);

  //Draw pencil
  ctx.beginPath();
  ctx.moveTo(point.x, point.y);
  ctx.lineTo(width / 5, point.y);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(width / 5, point.y);
  ctx.lineTo(width / 5 - scale / 13, point.y + scale / 13);
  ctx.lineTo(width / 5 - scale / 13, point.y - scale / 13);
  ctx.closePath();
  ctx.fill();

  //Draw wave
  ctx.translate(width / 5, 0);
  for (let i = 0; i < wave.length - 1; i++) {
    ctx.beginPath();
    ctx.moveTo(i, wave[i]);
    ctx.lineTo(i + 1, wave[i + 1]);
    ctx.stroke();
  }
  ctx.restore();
}

function update() {
  angle -= 0.025;
  if (wave.length > width)
    wave.pop();
}

function reset() {
  length = 5;
  lengthRange.value = 5;
  angle = 0;
  wave = [];
}

function clear() {
  ctx.clearRect(0, 0, width, height);
}

setup();
setInterval(() => {
  clear();
  draw();
  update();
}, getMs(60));
