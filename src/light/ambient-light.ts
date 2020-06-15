import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Stats from 'stats.js';

import * as Utils from '../utils/create';

let step = 0;

class App {
    stats!: Stats;
    perspective!: string;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    cube!: THREE.Mesh;
    sphere!: THREE.Mesh;
    controls!: any;
    constructor() {
        this.stats = this.initStats();
        this.setup();
    }

    setup() {
        this.scene = Utils.createScene();
        this.camera = Utils.createCamera('Perspective', {
            position: [-25, 30, 25]
        });
        this.renderer = Utils.createRender();
        const plane = Utils.createPlane({
            geometry: [60, 20, 1, 1],
            material: { color: 0xffffff },
            position: [15, 0, 0],
            rotation: [-0.5 * Math.PI, 0, 0],
        });
        const cube = Utils.createCube({
            geometry: [4, 4, 4],
            material: { color: 0xff0000 },
            position: [-4, 3, 6],
            rotation: [0, 0, 0]
        });
        this.cube = cube;
        const sphere = Utils.createSphere({
            geometry: [4, 20, 20],
            material: { color: 0x7777ff },
            position: [20, 0, 2],
            rotation: [0, 0, 0]
        });
        this.sphere = sphere;

        this.scene.add(plane);
        this.scene.add(cube);
        this.scene.add(sphere);

        this.camera.lookAt(new THREE.Vector3(10, 0, 0));

        const ambientLight = Utils.createAmbientLight({ color: '#0c0c0c' });
        this.scene.add(ambientLight);

        const spotLight = Utils.createSpotLight({
            color: 0xffffff,
            position: [-40, 60, -10]
        });
        this.scene.add(spotLight);

        const controls = {
            rotationSpeed: 0.02,
            bouncingSpeed: 0.03,
            ambientColor: '#0c0c0c',
            disableSpotlight: false,
            // 光照强度
            intensity: ambientLight.intensity,
        };

        this.controls = controls;

        const gui = new dat.GUI();
        gui.add(controls, 'intensity', 0, 3, 0.1).onChange(e => {
            ambientLight.color = new THREE.Color(controls.ambientColor);
            ambientLight.intensity = controls.intensity;
        });
        gui.addColor(controls, 'ambientColor').onChange(e => {
            ambientLight.color = new THREE.Color(e);
            ambientLight.intensity = controls.intensity;
        });
        gui.add(controls, 'disableSpotlight').onChange(e => spotLight.visible = !e);
    }

    start() {
        this.stats.update();

        this.cube.rotation.x += this.controls.rotationSpeed;
        this.cube.rotation.y += this.controls.rotationSpeed;
        this.cube.rotation.z += this.controls.rotationSpeed;

        step += this.controls.bouncingSpeed;
        this.sphere.position.x = 20 + (10 * (Math.cos(step)));
        this.sphere.position.y = 2 + (10 * Math.abs(Math.sin(step)));

        requestAnimationFrame(this.start.bind(this));
        this.renderer.render(this.scene, this.camera);
    }


    initStats() {
        const stats = new Stats();
        stats.showPanel(0);
        stats.dom.style.position = 'absolute';
        stats.dom.style.left = '0px';
        stats.dom.style.top = '0px';

        document.getElementById('Stats-output')?.appendChild(stats.dom);
        return stats;
    }
}

const app = new App();

app.start();