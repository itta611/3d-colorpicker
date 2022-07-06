import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { Box } from '@chakra-ui/react';
import { useState, useRef, createRef, useEffect } from 'react';

function ColorCubes() {
  const refContainer = useRef();

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
    camera.position.set(-400, 200, 400);

    camera.lookAt(target);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target = target;

    let cubes = [];
    const size = 6;
    for (let x = 0; x < size; x++) {
      cubes.push([]);
      for (let y = 0; y < size; y++) {
        cubes[x].push([]);
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
          cubes[x][y].push(cube);
          scene.add(cube);
        }
      }
    }

    let req = null;

    const animate = () => {
      req = requestAnimationFrame(animate);
      renderer.render(scene, camera);
      controls.update();
    };
    animate();
    return () => cancelAnimationFrame(req);
  }, []);
  return <Box h="xs" ref={refContainer} />;
}

export default ColorCubes;
