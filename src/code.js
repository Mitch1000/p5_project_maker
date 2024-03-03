import P5 from 'p5';

let leftAnimating = false;
let rightAnimating = false;
const vScale = 8;
let splashModifier = 1;



function overlay(p5) {
  return {
    setup() {
      p5.createCanvas(window.innerWidth, window.innerHeight);
      p5.pixelDensity(1);
    },

    draw() {
      if (leftAnimating) {
        const w = p5.map(bright, 0, 255, 0, vScale) * splashModifier;
        p5.rect(x * vScale, y * vScale, w, w, w / 3);
      }
    },
  };
}

function code(p5) {
  // Daniel Shiffman
  // https://youtu.be/rNqaw8LT2ZU
  // http://thecodingtrain.com

  let video;
  let videoArray = [];
  let previousVideoArray = [];
  let initialVideoArray = [];

  function handleLeft(bright, splashModifier, x, y) {
    console.log('handleLeft');
  }

  function handleRight(bright, splashModifier, x, y) {
    console.log('handleRight');
    // const w = p5.map(bright, 0, 255, 0, vScale) * splashModifier;
    // p5.rect(x * vScale, y * vScale, w, w, w / 3);
  }

  function drawRectPixel(pixel, index) {
    const {
      r,
      g,
      b,
      y,
      x,
      bright,
    } = pixel;

    p5.noStroke();
    const sideWidth = vScale * 1.2;
    const sideHeight = vScale * 0.8;
    const alpha = 0.7;

    const getColor = ((c2, c1) => alpha * c1 + (1 - alpha) * c2);
    let hasRightTriggered = false;
    let hasLeftTriggered = false;
    const splashDistance = 20;
    if (y <= sideHeight || y >= video.width - sideHeight) {
      const rr = getColor(r, 144);
      const rg = getColor(g, 238);
      const rb = getColor(b, 144);
      // p5.fill(144, 238, 144);
      p5.fill(rr, rg, rb);
    } else if (x <= sideWidth || x >= video.width - sideWidth) {
      const triggerThreshold = 16;
      const prevBright = previousVideoArray[index].bright;
      const hasBrightChanged = bright > prevBright + triggerThreshold
        || bright < prevBright - triggerThreshold;
      if (x <= sideWidth) {
        if (!hasLeftTriggered && hasBrightChanged) {
          handleLeft(bright, splashModifier, x, y);
          // console.log(video.pixels[10]);
          hasLeftTriggered = true;
        }
        if (hasLeftTriggered) {
          splashModifier = splashDistance;
        }
      }

      if (x >= (video.width - sideWidth)) {
        if (!hasRightTriggered && hasBrightChanged) {
          handleRight(bright, splashModifier, x, y);
          hasRightTriggered = true;
        }
        if (hasRightTriggered) {
          splashModifier = splashDistance;
        }
      }

      const gr = getColor(r, 255);
      const gg = getColor(g, 87);
      const gb = getColor(b, 51);
      p5.fill(gr, gg, gb);
    } else {
      // p5.fill(255, 246, 193);
      p5.fill(r, g, b);
    }

    p5.rectMode(p5.CENTER);
    const w = p5.map(bright, 0, 255, 0, vScale) * splashModifier;
    p5.rect(x * vScale, y * vScale, w, w, w / 3);
  }

  function makeBrightnessMap() {
    previousVideoArray = videoArray;
    videoArray = [];
    for (let y = 0; y < video.height; y += 1) {
      for (let x = 0; x < video.width; x += 1) {
        const index = (video.width - x - 1 + (y * video.width)) * 4;

        const r = video.pixels[index + 0];
        const g = video.pixels[index + 1];
        const b = video.pixels[index + 2];
        const bright = (r + g + b) / 3;
        videoArray.push({
          value: video.pixels[index],
          index,
          x,
          y,
          r,
          g,
          b,
          bright,
        });
      }
    }

    if (previousVideoArray.length < videoArray.length) {
      previousVideoArray = videoArray;
    }
  }

  function showPixels() {
    p5.background(51);
    for (let i = 0; i < videoArray.length; i += 1) {
      const pixel = videoArray[i];
      drawRectPixel(pixel, i);
    }
  }

  window.setInitialArray = () => {
    initialVideoArray = videoArray;
    console.log(initialVideoArray);
  };

  window.logVideoArray = () => {
    console.log(videoArray);
  };

  return {
    setup() {
      p5.createCanvas(window.innerWidth, window.innerHeight);
      p5.pixelDensity(1);
      video = p5.createCapture(p5.VIDEO);
      video.size(p5.width / vScale, p5.height / vScale);
      p5.background(51);
      video.loadPixels();
    },

    draw() {
      video.loadPixels();
      makeBrightnessMap();
      showPixels();
    },
  };
}

function main() {
  const canvas1 = (p5) => Object.assign(p5, code(p5));
  // const canvas2 = (p5) => Object.assign(p5, overlay(p5));

  return {
    one: new P5(canvas1),
 //   two: new P5(canvas2),
  };
}

export default main;
