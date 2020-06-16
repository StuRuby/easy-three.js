import * as THREE from 'three';
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


        const orbitControl = new OrbitControls(this.camera, renderer.domElement);
        orbitControl.update();
        this.control = orbitControl;

        document.body.appendChild(renderer.domElement);

        const geom = new THREE.Geometry();
        function createPointCloud(size: number, transparent: boolean, opacity: number, vertexColors: boolean, sizeAttenuation: boolean, colorValue: number, vertexColor: number) {
            const material = new THREE.PointsMaterial({
                size,
                transparent,
                opacity,
                vertexColors,
                sizeAttenuation,
                color: new THREE.Color(colorValue)
            });

            const range = 500;
            for(let i = 0; i < 15000; i++) {
                const point = new THREE.Vector3(
                    Math.random() * range - range / 2,
                    Math.random() * range - range / 2,
                    Math.random() * range - range / 2,
                );
                geom.vertices.push(point);
                const color = new THREE.Color(colorValue);
                const hsl: THREE.HSL = {
                };
                color.setHSL(
                    color.getHSL(hsl).h,
                    color.getHSL(hsl).s,
                    color.getHSL(hsl).l * Math.random()
                )
            }
        }
    }

    start() {
        this.stats.update();
        this.control.update();

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