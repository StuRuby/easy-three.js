import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Stats from 'stats.js';
import { SceneUtils } from 'three/examples/jsm/utils/SceneUtils';

import * as Utils from '../utils/create';


class App {
    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    camera!: THREE.Camera;
    stats!: Stats;
    gui!: dat.GUI;
    group!: THREE.Group;
    sphere!: THREE.Object3D;
    cube!: THREE.Object3D;
    bbox!: THREE.Object3D;
    constructor() {
        this.setup();
        this.setupDebug();
    }

    setup() {
        this.scene = Utils.createScene();
        this.camera = Utils.createCamera('Perspective', { position: [30, 30, 30] });
        this.renderer = Utils.createRender();
        this.camera.lookAt(this.scene.position);

        const ambientLight = Utils.createAmbientLight({ color: 0xffffff });
        const directionalLight = Utils.createDirectionLight({ color: 0xffffff, position: [2, 2, 2] });
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);


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
            cubePosX: 0,
            cubePosY: 3,
            cubePosZ: 10,

            spherePosX: 10,
            spherePosY: 5,
            spherePosZ: 0,

            groupPosX: 10,
            groupPosY: 5,
            groupPosZ: 0,

            grouping: false,
            rotate: false,

            groupScale: 1,
            cubeScale: 1,
            sphereScale: 1,

            redraw: () => {
                this.scene.remove(this.group);

                this.sphere = this.createMesh(new THREE.SphereGeometry(5, 10, 10));
                this.cube = this.createMesh(new THREE.BoxGeometry(6, 6, 6));

                this.sphere.position.set(gui.spherePosX, gui.spherePosY, gui.spherePosZ);
                this.cube.position.set(gui.cubePosX, gui.cubePosY, gui.cubePosZ);

                this.group = new THREE.Group();
                this.group.add(this.cube);
                this.group.add(this.sphere);

                this.scene.add(this.group);

                const arrow = new THREE.ArrowHelper(new THREE.Vector3(0, 1, 0), this.group.position, 10, 0x0000ff);
                this.scene.add(arrow);
            },
        }

        gui.redraw();


        document.body.appendChild(this.renderer.domElement);
    }

    setupDebug() {
        this.gui = new dat.GUI();

        // 创建`stats`
        this.stats = new Stats();
        document.body.appendChild(this.stats.dom);
    }

    start() {
        this.stats.update();
        requestAnimationFrame(this.start.bind(this));
        this.renderer.render(this.scene, this.camera);
    }


    private createMesh(geom: THREE.Geometry) {
        const meshMaterial = new THREE.MeshNormalMaterial();
        //  两面都受光
        meshMaterial.side = THREE.DoubleSide;
        const wireFrameMaterial = new THREE.MeshBasicMaterial();
        wireFrameMaterial.wireframe = true;

        const mesh = SceneUtils.createMultiMaterialObject(geom, [
            meshMaterial,
            wireFrameMaterial
        ]);
        return mesh;
    }
}

const app = new App();
app.start();

