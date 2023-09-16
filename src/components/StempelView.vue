<script setup lang="ts">
import * as THREE from 'three';
const props = defineProps<{
  msg:number 
  padding:number
  height:number
  blurryness: number
}>()
import {onMounted, onUpdated} from 'vue'
function redrawCanvas(){
const canvas = document.getElementById("texturecanvas");
const ctx = canvas.getContext("2d");
// Define a custom blur function
function customBlur(imageData, radius) {
  const data = imageData.data;
  const width = imageData.width;
  const height = imageData.height;
  const radiusSquared = radius * radius;

  const blurredData = new Uint8ClampedArray(data.length);

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      let r = 0;
      let g = 0;
      let b = 0;
      let a = 0;

      for (let offsetY = -radius; offsetY <= radius; offsetY++) {
        for (let offsetX = -radius; offsetX <= radius; offsetX++) {
          const pixelX = x + offsetX;
          const pixelY = y + offsetY;

          if (
            pixelX >= 0 &&
            pixelX < width &&
            pixelY >= 0 &&
            pixelY < height
          ) {
            const pixelIndex = (pixelY * width + pixelX) * 4;

            r += data[pixelIndex];
            g += data[pixelIndex + 1];
            b += data[pixelIndex + 2];
            a += data[pixelIndex + 3];
          }
        }
      }

      const currentIndex = (y * width + x) * 4;

      blurredData[currentIndex] = r / (Math.pow(2 * radius + 1, 2));
      blurredData[currentIndex + 1] = g / (Math.pow(2 * radius + 1, 2));
      blurredData[currentIndex + 2] = b / (Math.pow(2 * radius + 1, 2));
      blurredData[currentIndex + 3] = a / (Math.pow(2 * radius + 1, 2));
    }
  }

  return new ImageData(blurredData, width, height);
}
ctx.clearRect(0, 0, canvas.width, canvas.height);
ctx.font = "30px Arial"; // Set the font size and style
ctx.fillStyle = "black"; // Set the text color
ctx.fillText(props.msg, 50, 50); // Dr
// Get the image data from the canvas
const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

// Apply the custom blur with a specified radius
const radius = props.blurryness;
const blurredImageData = customBlur(imageData, radius);

// Put the blurred image data back onto the canvas
ctx.putImageData(blurredImageData, 0, 0);
}

onUpdated(()=>{
	console.log("updated", props.msg)
	redrawCanvas()
})

onMounted(()=>{
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera( 75, window.innerWidth /
window.innerHeight, 0.1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize( window.innerWidth*0.8, window.innerHeight*0.8 );
const app = document.querySelector<HTMLDivElement>("#canvas");
app?.appendChild( renderer.domElement );

const geometry = new THREE.BoxGeometry( 1, 1, 1 );
const material = new THREE.MeshBasicMaterial( { color: 0x00ff00 } );
const cube = new THREE.Mesh( geometry, material );
scene.add( cube );

camera.position.z = 5;
let last  = props.height;
function animate() {
	requestAnimationFrame( animate );
	renderer.render( scene, camera );
	if(props.msg != last){
	last = props.height
	cube.position.set(0,props.height,1)	
	}
}
animate();
redrawCanvas()
//https://threejs.org/docs/#api/en/textures/CanvasTexture
})

</script>

<template>
  <canvas id="texturecanvas" width="400" height="100"></canvas>
  <div id="canvas">
  </div>
</template>

<style scoped>

</style>
