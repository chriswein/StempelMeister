function Blur(imageData: ImageData, radius: number,
  quantization: number = 24
) {
  // Extract data from the input ImageData object
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const radiusSquared = radius * radius; // Calculate the squared radius for optimization

  // Create an array to store the blurred image data
  const blurredData = new Uint8ClampedArray(data.length);

  // Initialize variables to track minimum and maximum RGB values
  let minR = 255;
  let minG = 255;
  let minB = 255;
  let maxR = 0;
  let maxG = 0;
  let maxB = 0;

  // Loop through each pixel in the image
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      // Initialize variables for color channels (r, g, b, and a) and pixel count
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;
      let validPixelCount = 0; // Count of valid pixels within the radius

      // Loop through neighboring pixels within the specified radius
      for (let offsetY = -radius; offsetY <= radius; offsetY++) {
        for (let offsetX = -radius; offsetX <= radius; offsetX++) {
          const pixelX = x + offsetX;
          const pixelY = y + offsetY;

          // Check if the neighboring pixel is within the image bounds
          if (
            pixelX >= 0 &&
            pixelX < width &&
            pixelY >= 0 &&
            pixelY < height
          ) {
            // Calculate the index of the neighboring pixel in the image data
            const pixelIndex = (pixelY * width + pixelX) * 4;

            // Accumulate color values and alpha
            r += data[pixelIndex];
            g += data[pixelIndex + 1];
            b += data[pixelIndex + 2];
            a += data[pixelIndex + 3];
            validPixelCount++;
          }
        }
      }

      // Calculate the index of the current pixel in the blurred image data
      const currentIndex = (y * width + x) * 4;

      // Compute the average color values within the radius and update the blurred image data
      blurredData[currentIndex] = r / validPixelCount;
      blurredData[currentIndex + 1] = g / validPixelCount;
      blurredData[currentIndex + 2] = b / validPixelCount;
      blurredData[currentIndex + 3] = a / validPixelCount;

      // Update minimum and maximum RGB values for quantization
      minR = Math.min(minR, blurredData[currentIndex]);
      minG = Math.min(minG, blurredData[currentIndex + 1]);
      minB = Math.min(minB, blurredData[currentIndex + 2]);
      maxR = Math.max(maxR, blurredData[currentIndex]);
      maxG = Math.max(maxG, blurredData[currentIndex + 1]);
      maxB = Math.max(maxB, blurredData[currentIndex + 2]);
    }
  }

  // Calculate quantization step sizes for R, G, and B channels
  const stepR = (maxR - minR) / (quantization - 1);
  const stepG = (maxG - minG) / (quantization - 1);
  const stepB = (maxB - minB) / (quantization - 1);

  // Quantize pixel values to limit the number of brightness variations
  for (let i = 0; i < blurredData.length; i += 4) {
    const quantizedR = Math.round((blurredData[i] - minR) / stepR) * stepR + minR;
    const quantizedG = Math.round((blurredData[i + 1] - minG) / stepG) * stepG + minG;
    const quantizedB = Math.round((blurredData[i + 2] - minB) / stepB) * stepB + minB;

    // Update the blurred image data with quantized values
    blurredData[i] = quantizedR;
    blurredData[i + 1] = quantizedG;
    blurredData[i + 2] = quantizedB;
  }

  // Return a new ImageData object representing the blurred image
  return new ImageData(blurredData, width, height);
}




function redrawCanvas(
  msg: string,
  blurryness: number,
  font: string = "Times New Roman"
) {
  if (msg === '') return;

  let fontSize = 12
  let fontMetrics: TextMetrics
  const safetyX = 8
  const safetyY = 2
  const canvas = document.getElementById("texturecanvas") as HTMLCanvasElement;

  if (canvas == null) return; // Canvas not found?

  const ctx = canvas.getContext("2d");
  if (ctx == null) return; // Context not available?

  // Clear the canvas
  let clear = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }
  clear()

  // Set the text color
  ctx.fillStyle = "black";

  // Figure out fitting font size
  do {
    ctx.font = `${fontSize}px ${font}`; // Set the font size and style
    fontMetrics = ctx.measureText(msg)
    fontSize += 1
  } while (fontMetrics.width <= canvas.width - safetyX
    &&
    Math.abs(
      fontMetrics.actualBoundingBoxAscent + fontMetrics.actualBoundingBoxDescent
    ) <= canvas.height - safetyY)

  // Set last good value
  fontSize -= 1
  ctx.font = `${fontSize}px ${font}`;
  fontMetrics = ctx.measureText(msg)


  ctx.fillText( // Center the text on canvas
    msg,
    ctx.canvas.width / 2 - (fontMetrics.width / 2),
    (ctx.canvas.height / 2) + (
      fontMetrics.actualBoundingBoxAscent / 2 -
      fontMetrics.actualBoundingBoxDescent / 2
    )
  );

  // Get the image data from the canvas
  const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

  // Apply the blur
  const radius = blurryness;
  const blurredImageData = Blur(imageData, radius);

  // Clear canvas
  clear()

  // Reapply blurred image data
  ctx.putImageData(blurredImageData, 0, 0);
}

export { redrawCanvas }