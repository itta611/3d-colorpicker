import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';
import { useState, useRef, createRef, useEffect } from 'react';

function ColorCubes({ saturation }) {
  const refContainer = useRef();
  const [cubes, setcubes] = useState([]);
  const size = 6;

  useEffect(() => {
    const { current: container } = refContainer;
    const scW = container.clientWidth;
    const scH = container.clientHeight;
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

    const camera = new THREE.OrthographicCamera(scW / -2, scW / 2, scH / 2, scH / -2, 1, 1000);
    camera.position.set(400, 200, 400);

    camera.lookAt(target);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = target;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.enableDamping = true;
    controls.dampingFactor = 0.1;

    let cubesTemp = [];
    for (let x = 0; x < size; x++) {
      cubesTemp.push([]);
      for (let y = 0; y < size; y++) {
        cubesTemp[x].push([]);
        for (let z = 0; z < size; z++) {
          const cube = new THREE.Mesh(
            new THREE.BoxBufferGeometry(15, 15, 15),
            new THREE.MeshBasicMaterial({
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
          cubesTemp[x][y].push(cube);
          scene.add(cube);
        }
      }
    }
    setcubes(cubesTemp);

    let req = null;

    const animate = () => {
      req = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    };
    animate();
    return () => cancelAnimationFrame(req);
  }, []);

  useEffect(() => {
    if (cubes.length > 0) {
      for (let x = 0; x < size; x++) {
        for (let y = 0; y < size; y++) {
          for (let z = 0; z < size; z++) {
            cubes[x][y][z].visible = x + y + z < saturation;
            // cubes[x][y][z].visible = false;
          }
        }
      }
    }
  }, [cubes, saturation]);
  return <Box flexGrow={1} h="2xs" ref={refContainer} />;
}

export default ColorCubes;
