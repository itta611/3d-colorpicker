import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import TWEEN from '@tweenjs/tween.js';

let camera;
let activeCubes;
let scW, scH;
let scX, scY;
let hoveringColor = null;
let mouseDownX, mouseDownY;
let cubes = [];
let scaledCubes = [];
const size = 6;

function CubeForEach(callback) {
  for (let x = 0; x < size; x++) {
    for (let y = 0; y < size; y++) {
      for (let z = 0; z < size; z++) {
        callback(x, y, z);
      }
    }
  }
}

function setRect(container) {
  const domRect = container.getBoundingClientRect();
  scW = domRect.width;
  scH = domRect.height;
  scX = domRect.x;
  scY = domRect.y;
}

function animationScale(cube, scale) {
  const tween = new TWEEN.Tween(cube.scale)
    .to({ x: scale, y: scale, z: scale }, 100)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
  return tween;
}

function setActiveCube(saturation) {
  activeCubes = [];
  if (cubes.length > 0) {
    CubeForEach((x, y, z) => {
      if (x + y + z < saturation) {
        cubes[x][y][z].visible = true;
        activeCubes.push(cubes[x][y][z]);
      } else {
        cubes[x][y][z].visible = false;
      }
    });
  }
}

function ColorCubes({ saturation, setCurrentColor, popoverOpenRef }) {
  const refContainer = useRef();

  popoverOpenRef.current = () => {
    if (camera) return;
    const { current: container } = refContainer;
    setRect(container);
    const target = new THREE.Vector3(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setSize(scW, scH);
    renderer.outputEncoding = THREE.sRGBEncoding;
    container.appendChild(renderer.domElement);

    const scene = new THREE.Scene();

    camera = new THREE.OrthographicCamera(scW / -2, scW / 2, scH / 2, scH / -2, 1, 1000);
    camera.position.set(400, 200, 400);

    camera.lookAt(target);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = target;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    cubes = [];
    for (let x = 0; x < size; x++) {
      cubes.push([]);
      for (let y = 0; y < size; y++) {
        cubes[x].push([]);
        for (let z = 0; z < size; z++) {
          const cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(15, 15, 15),
            new THREE.MeshBasicMaterial({
              transparent: true,
              color:
                (0xff / (size - 1)) * x * 0x10000 +
                (0xff / (size - 1)) * y * 0x100 +
                (0xff / (size - 1)) * z,
            })
          );
          const spacing = 20;
          const centerDiff = (spacing * (size - 1)) / 2;
          cube.position.x = x * spacing - centerDiff;
          cube.position.y = y * spacing - centerDiff;
          cube.position.z = z * spacing - centerDiff;
          cubes[x][y].push(cube);
          scene.add(cube);
        }
      }
    }

    const animate = () => {
      requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
      TWEEN.update();
    };
    animate();
    setActiveCube(saturation);

    setTimeout(() => {
      setRect(container);
      renderer.setSize(scW, scH);
    }, 300);
  };

  const handleMouseMove = (e) => {
    console.log(scW, scH, scX, scY);
    const clientX = e.clientX - scX;
    const clientY = e.clientY - scY;
    const x = (clientX / scW) * 2 - 1;
    const y = -(clientY / scH) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects(activeCubes);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      if (scaledCubes.indexOf(intersect.object) === -1) {
        const color = `#${intersect.object.material.color.getHexString()}`;
        hoveringColor = color;
        scaledCubes.forEach((cube) => {
          animationScale(cube, 1);
        });
        scaledCubes = [];
        scaledCubes.push(intersect.object);
        animationScale(intersect.object, 1.2);
      }
    } else {
      hoveringColor = null;
      scaledCubes.forEach((cube) => {
        animationScale(cube, 1);
      });
      scaledCubes = [];
    }
  };

  const handleMouseDown = (e) => {
    mouseDownX = e.clientX;
    mouseDownY = e.clientY;
  };

  const handleMouseUp = (e) => {
    const notDrag = e.clientX == mouseDownX && e.clientY == mouseDownY;
    if (hoveringColor && notDrag) setCurrentColor(hoveringColor);
  };

  useEffect(() => {
    setActiveCube(saturation);
  }, [saturation]);

  return (
    <Box
      flexGrow={1}
      h="2xs"
      ref={refContainer}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
}

export default ColorCubes;
