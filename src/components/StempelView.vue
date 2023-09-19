<script setup lang="ts">
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { STLExporter } from "three/examples/jsm/exporters/STLExporter";
import { redrawCanvas } from '../utils'
const props = defineProps<{
  msg: string
  padding: number
  height: number
  blurryness: number
}>()
import { onMounted, onUpdated } from 'vue'
let stempel: THREE.Mesh<any, THREE.MeshBasicMaterial, THREE.Object3DEventMap>;
let parametersUpdated = false;
let currentTexture: THREE.CanvasTexture
let aspectRatioX = 4
let aspectRatioY = 1

function onDownloadButtonPressed() {
  let copy = stempel.clone()
  const vertices = copy.geometry.attributes.position.array;
  const canvas = document.getElementById("texturecanvas") as HTMLCanvasElement;
  if (canvas == null) return;
  const context = canvas.getContext("2d")
  if (context == null) return;
  // Access the canvas width and height
  const canvasWidth = canvas.width;
  const canvasHeight = canvas.height;



  // Get the entire canvas pixel data
  const pixelData = context.getImageData(0, 0, canvasWidth, canvasHeight).data;

  const heightmapData = pixelData // Assuming heightmap is grayscale


  for (let i = 0; i < vertices.length; i += 3) {
    const x = vertices[i];
    const y = vertices[i + 1];
    const z = vertices[i + 2];
    // console.log(x, y, z, vertices.length)

    // Adjust the 'z' coordinate of the vertices based on heightmap data
    const xn = (x + aspectRatioX / 2) / aspectRatioX * (canvasWidth - 1); // Adjust for your mesh size
    const yn = (aspectRatioY / 2 - y) / aspectRatioY * (canvasHeight - 1); // Adjust for your mesh size
    const pixelIndex = (Math.floor(yn) * canvasWidth + Math.floor(xn)) * 4;

    let displacement = heightmapData[pixelIndex] / 255 * -props.height; // Adjust maxHeight as needed
    // console.log(pixelIndex, displacement, heightmapData[pixelIndex])
    if (displacement < -props.height * 0.7) displacement = -props.height;
    vertices[i + 2] = displacement;
  }

  copy.geometry.attributes.position.needsUpdate = true;
  const exporter = new STLExporter();
  const stlData = exporter.parse(copy);
  const stlBlob = new Blob([stlData], { type: 'application/octet-stream' });
  const stlUrl = URL.createObjectURL(stlBlob);

  const downloadLink = document.createElement('a');
  downloadLink.href = stlUrl;
  downloadLink.download = 'exported_mesh.stl';
  downloadLink.textContent = 'Download STL';
  document.body.appendChild(downloadLink);
  copy.clear()
  // To trigger the download automatically, you can do:
  downloadLink.click();

}

onUpdated(() => {
  console.log("updated", props.msg)
  parametersUpdated = true
  redrawCanvas(props.msg, props.blurryness)

})


onMounted(() => {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(75, window.innerWidth /
    window.innerHeight, 0.1, 1000);
  const renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setSize(window.innerWidth * 0.8, window.innerHeight * 0.8);
  renderer.setClearColor(0xe6f7eb)
  const app = document.querySelector<HTMLDivElement>("#canvas");
  app?.appendChild(renderer.domElement);

  const controls = new OrbitControls(camera, renderer.domElement);
  const geometry = new THREE.BoxGeometry(aspectRatioX, aspectRatioY, 1);
  redrawCanvas(props.msg, props.blurryness)
  const canvas = document.getElementById("texturecanvas") as HTMLCanvasElement;
  let material: any
  let createTexture = (canvas: HTMLCanvasElement, height: number) => {
    const canvasTexture = new THREE.CanvasTexture(canvas);
    canvasTexture.needsUpdate = true;
    currentTexture = canvasTexture
    material = new THREE.MeshPhongMaterial({ displacementMap: canvasTexture, displacementScale: -height });

    return material
  }
  if (canvas) {
    material = createTexture(canvas, props.height)
  } else {
    material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
  }
  const planeGeometry = new THREE.PlaneGeometry(aspectRatioX, aspectRatioY, 256, 256);
  const cube = new THREE.Mesh(planeGeometry, material);
  stempel = cube;
  scene.add(cube);
  const directionalLight = new THREE.DirectionalLight(0xeddc7e, 6); // Parameters: (color, intensity)
  directionalLight.position.set(3, 4, 3); // Set the direction of the light
  directionalLight.castShadow = true
  scene.add(directionalLight);
  const ambientLight = new THREE.AmbientLight(0xffffff, 0.2); // Parameters: (color, intensity)
  scene.add(ambientLight);
  camera.position.z = 5;
  renderer.shadowMap.enabled = true
  renderer.shadowMap.type = THREE.PCFSoftShadowMap
  stempel.castShadow = true
  stempel.receiveShadow = true
  function animate() {
    requestAnimationFrame(animate);
    renderer.render(scene, camera);
    if (parametersUpdated) {
      const canvas = document.getElementById("texturecanvas") as HTMLCanvasElement;
      if (canvas) {
        let material = createTexture(canvas, props.height)
        stempel.material = material
      }
      cube.position.set(0, props.height, 1)
      parametersUpdated = false
    }
  }
  animate();
  redrawCanvas(props.msg, props.blurryness)
})

</script>

<template>
  <canvas id="texturecanvas" width="400" height="100"></canvas>
  <div id="canvas">
  </div>
  <button class="mt-4 bg-blue-300 hover:bg-blue-400 text-gray-800 font-bold py-2 px-4 rounded inline-flex items-center"
    @click="onDownloadButtonPressed">
    <svg class="fill-current w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
      <path d="M13 8V2H7v6H2l8 8 8-8h-5zM0 18h20v2H0v-2z" />
    </svg>
    <span>Download</span>
  </button>
</template>

<style scoped></style>
