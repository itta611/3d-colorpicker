import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';
import { useRef, useEffect } from 'react';
import TWEEN from '@tweenjs/tween.js';

let camera;
let activeCubes = [];
let scX, scY;
let hoveringColor = null;
let mouseDownX, mouseDownY;
let cubes = [];
let scaledCube;
const scW = 200;
const scH = 200;
const size = 6;

function setRect(container) {
  const domRect = container.getBoundingClientRect();
  scX = domRect.x;
  scY = domRect.y;
}

function animationScale(cube, scale) {
  if (!cube) return;
  const tween = new TWEEN.Tween(cube.scale)
    .to({ x: scale, y: scale, z: scale }, 100)
    .easing(TWEEN.Easing.Quadratic.Out)
    .start();
  return tween;
}

function setActiveCube(saturation, animate = true) {
  activeCubes = [];
  if (cubes.length > 0) {
    for (let x = 0; x < size; x++) {
      for (let y = 0; y < size; y++) {
        for (let z = 0; z < size; z++) {
          const cube = cubes[x][y][z];
          if (x + y + z < saturation) {
            if (animate && !cube.userData.isActive) {
              cube.scale.set(0, 0, 0);
              animationScale(cube, 1);
            }
            cube.visible = true;
            cube.userData.isActive = true;
            activeCubes.push(cube);
          } else {
            if (animate && cube.userData.isActive) {
              cube.scale.set(1, 1, 1);
              animationScale(cube, 0).onComplete(() => {
                cube.visible = false;
              });
              cube.userData.isActive = false;
            }
          }
        }
      }
    }
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
    setActiveCube(saturation, false);

    setTimeout(() => {
      setRect(container);
      renderer.setSize(scW, scH);
    }, 300);
  };

  const handleMouseMove = (e) => {
    const clientX = e.clientX - scX;
    const clientY = e.clientY - scY;
    const x = (clientX / scW) * 2 - 1;
    const y = -(clientY / scH) * 2 + 1;
    const raycaster = new THREE.Raycaster();
    raycaster.setFromCamera(new THREE.Vector2(x, y), camera);
    const intersects = raycaster.intersectObjects(activeCubes);

    if (intersects.length > 0) {
      const intersect = intersects[0];
      if (scaledCube !== intersect.object) {
        const color = `#${intersect.object.material.color.getHexString()}`;
        hoveringColor = color;
        animationScale(scaledCube, 1);
        scaledCube = intersect.object;
        animationScale(intersect.object, 1.2);
      }
    } else {
      hoveringColor = null;
      animationScale(scaledCube, 1);
      scaledCube = null;
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

  useEffect(() => setRect(refContainer.current), []);

  useEffect(() => {
    setActiveCube(saturation);
  }, [saturation]);

  return (
    <Box
      h="200px"
      w="200px"
      ref={refContainer}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onMouseMove={handleMouseMove}
    />
  );
}

export default ColorCubes;
