import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';

import * as Utils from '../utils/create';


class App {
    scene!: THREE.Scene;
    camera!: THREE.PerspectiveCamera;
    renderer!: THREE.WebGLRenderer;
    gui!: dat.GUI;
    rotation!: number;
    stats!: Stats;
    control!: OrbitControls;
    constructor() {
        this.setup();
        this.setupDebug();
    }

    setup() {
        this.scene = Utils.createScene();
        this.camera = Utils.createCamera('Perspective', { position: [0, 40, 50] }) as THREE.PerspectiveCamera;
        this.renderer = Utils.createRender();
        this.renderer.shadowMapEnabled = true;
        this.camera.lookAt(this.scene.position);

        const ambientLight = Utils.createAmbientLight({ color: 0xffffff });
        this.scene.add(ambientLight);
        const directionalLight = Utils.createDirectionLight({ color: 0x00ff00, position: [30, 30, 30] });
        this.scene.add(directionalLight);

        const cubeMaterial = new THREE.MeshNormalMaterial({ colorWrite: true, transparent: true, opacity: 0.5 });


        const groundGeometry = new THREE.PlaneGeometry(100, 100, 50, 50);
        const wireFrameMaterial = new THREE.MeshBasicMaterial({ wireframe: true, color: 0x000000 });
        const basicMaterial = new THREE.MeshBasicMaterial({ color: 0x00ff00, transparent: true, opacity: 0.5 });
        const groundMesh = SceneUtils.createMultiMaterialObject(
            groundGeometry, [wireFrameMaterial, basicMaterial]
        );
        // 旋转`ground`，由xy平面，至xz平面
        groundMesh.rotation.x = -0.5 * Math.PI;

        this.scene.add(groundMesh);

        const gui = {
            cameraNear: this.camera.near,
            cameraFar: this.camera.far,
            rotationSpeed: 0.02,
            combined: false,
            numberOfObjects: 500,
            addCube: addCube,
            export: false,
            redraw: () => {
                const toRemoved: THREE.Object3D[] = [];
                this.scene.traverse(e => {
                    if(e instanceof THREE.Mesh) {
                        toRemoved.push(e);
                    }
                });
                toRemoved.forEach(e => this.scene.remove(e));
                if(gui.combined) {
                    const geometry = new THREE.Geometry();
                    for(let i = 0; i < gui.numberOfObjects; i++) {
                        const cubeMesh = addCube();
                        cubeMesh.updateMatrix();
                        geometry.merge(cubeMesh.geometry, cubeMesh.matrix);
                    }
                    this.scene.add(new THREE.Mesh(geometry, cubeMaterial));
                } else {
                    for(let i = 0; i < gui.numberOfObjects; i++) {
                        this.scene.add(gui.addCube());
                    }
                }
            },
            outputObjects: () => console.log(this.scene.children)
        }

        this.gui = new dat.GUI();
        this.gui.add(gui, 'cameraNear', 0.1, 10);
        this.gui.add(gui, 'cameraFar', 100, 2000);
        this.gui.add(gui, 'numberOfObjects', 0, 20000);
        this.gui.add(gui, 'combined').onChange(gui.redraw);
        this.gui.add(gui, 'redraw');
        this.gui.add(gui, 'outputObjects');
        this.gui.add(gui, 'export').onChange(() => {
            console.log(this.scene.toJSON());
        });
        gui.redraw();

        function addCube() {
            const cubeSize = 1.0;
            const cubeGeometry = new THREE.BoxGeometry(cubeSize, cubeSize, cubeSize);
            const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
            cube.castShadow = true;
            cube.position.set(
                -60 + Math.round((Math.random() * 100)),
                Math.round((Math.random() * 10)),
                Math.round((Math.random() * 175)) - 150
            );
            return cube;
        }

        const control = new OrbitControls(this.camera, this.renderer.domElement);
        this.control = control;
        control.update();

        document.body.appendChild(this.renderer.domElement);
    }

    setupDebug() {
        const stats = new Stats();
        this.stats = stats;
        stats.showPanel(0);
        stats.dom.style.position = 'absolute';
        stats.dom.style.left = '0px';
        stats.dom.style.top = '0px';
        document.getElementById('Stats-output')?.appendChild(stats.dom);
    }

    start() {
        this.rotation += 0.005;
        this.stats.update();
        this.control.update();

        // this.camera.position.x = Math.sin(this.rotation) * 50;
        // this.camera.position.z = Math.cos(this.rotation) * 50;
        // this.camera.lookAt(this.scene.position);

        requestAnimationFrame(this.start.bind(this));
        this.renderer.render(this.scene, this.camera);
    }
}

const app = new App();
app.start();