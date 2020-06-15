import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as Utils from '../utils/create';

class App {
    stats!: Stats;
    perspective!: string;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    control!: OrbitControls;
    constructor() {
        this.stats = this.initStats();
        this.setup();
    }

    setup() {
        const scene = Utils.createScene();
        this.scene = scene;

        const camera = Utils.createCamera('Perspective', {
            position: [-20, 30, 40]
        });
        this.camera = camera;

        const renderer = Utils.createRender();
        this.renderer = renderer;

        const groundGeometry = new THREE.PlaneGeometry(100, 100, 4, 4);
        const ground = new THREE.Mesh(groundGeometry, new THREE.MeshBasicMaterial({ color: 0x777777 }));
        ground.rotation.x = -Math.PI / 2;
        ground.position.y = -20;
        this.scene.add(ground);

        const sphereGeometry = new THREE.SphereGeometry(14, 20, 20);
        const meshMaterial = new THREE.MeshNormalMaterial({ colorWrite: true, vertexColors: true, flatShading: true, wireframe: true });
        const sphere = new THREE.Mesh(sphereGeometry, meshMaterial);
        sphere.position.set(0, 3, 2);

        for(let i = 0, len = sphere.geometry.faces.length; i < len; i++) {
            const face = sphere.geometry.faces[i];
            const centroid = new THREE.Vector3(0, 0, 0);
            centroid.add(sphere.geometry.vertices[face.a]);
            centroid.add(sphere.geometry.vertices[face.b]);
            centroid.add(sphere.geometry.vertices[face.c]);
            // 将该向量除以标量`s`
            centroid.divideScalar(3);

            const arrow = new THREE.ArrowHelper(
                face.normal,
                centroid,
                2,
                0x3333ff,
                0.5,
                0.5
            );
            // sphere.add(arrow);
        }
        this.scene.add(sphere);

        camera.lookAt(new THREE.Vector3(10, 0, 0));

        const ambientLight = Utils.createAmbientLight({ color: 0x0c0c0c });
        scene.add(ambientLight);

        const spotLight = Utils.createSpotLight({ color: 0xffffff, position: [-40, 60, -10] });
        scene.add(spotLight);

        const orbitControl = new OrbitControls(this.camera, renderer.domElement);
        orbitControl.update();
        this.control = orbitControl;

        document.body.appendChild(renderer.domElement);



    }

    start() {
        this.stats.update();
        this.control.update();

        requestAnimationFrame(this.start.bind(this));
        this.renderer.render(this.scene, this.camera);
    }


    switchCamera() {
        if(this.camera instanceof THREE.PerspectiveCamera) {
            this.camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16, -200, 500);
            this.camera.position.set(120, 60, 180);
            this.camera.lookAt(this.scene.position);
            this.perspective = 'Orthographic';
        } else {
            this.camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera.position.set(120, 60, 180);
            this.camera.lookAt(this.scene.position);
            this.perspective = 'Perspective';
        }
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