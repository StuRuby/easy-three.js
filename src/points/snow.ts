import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as stats from 'stats.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import * as Utils from '../utils/create';

class App {
    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    camera!: THREE.Camera;
    orbitControl!: OrbitControls;
    stats!: stats;
    gui!: dat.GUI;
    cloud!: THREE.Points;
    constructor() {
        this.setup();
        this.setupDebug();
    }

    setup() {
        this.scene = Utils.createScene();
        this.scene.background = new THREE.TextureLoader().load('/timg.jpeg');
        this.camera = Utils.createCamera('Perspective', {
            position: [-40, 40, 40]
        });
        this.camera.lookAt(this.scene.position);

        const renderer = Utils.createRender();
        this.renderer = renderer;

        const ambientLight = Utils.createAmbientLight({ color: 0xffffff });
        const directionalLight = Utils.createDirectionLight({ color: 0xffffff, position: [1, 1, 1] });
        this.scene.add(ambientLight);
        this.scene.add(directionalLight);

        // const orbitControl = new OrbitControls(this.camera, this.renderer.domElement);
        // this.orbitControl = orbitControl;
        // 使用阻尼
        // this.orbitControl.enableDamping = true;
        // this.orbitControl.enableZoom = true;
        // this.orbitControl.autoRotate = false;
        // this.orbitControl.minDistance = 20;
        // this.orbitControl.maxDistance = 10000;
        // this.orbitControl.enablePan = true;
        // orbitControl.update();

        document.body.appendChild(renderer.domElement);
    }

    start() {
        this.stats.update();
        // this.orbitControl.update();

        const vertices = this.cloud.geometry.vertices;
        vertices.forEach(function (v) {

            v.y = v.y - (v.velocityY);
            v.x = v.x - (v.velocityX) * .5;

            if(v.y <= -60) v.y = 60;
            if(v.x <= -20 || v.x >= 20) v.velocityX = v.velocityX * -1;
        });

        //设置实时更新网格的顶点信息
        this.cloud.geometry.verticesNeedUpdate = true;



        requestAnimationFrame(this.start.bind(this));
        this.renderer.render(this.scene, this.camera);
    }

    setupDebug() {
        this.stats = new stats();
        document.body.appendChild(this.stats.dom);

        this.gui = new dat.GUI();

        const gui = {
            size: 2,
            transparent: true,
            opacity: 0.6,
            vertexColors: true,
            color: 0xffffff,
            sizeAttenuation: true,
            rotateSystem: false,
            redraw: () => {
                if(this.cloud) {
                    this.scene.remove(this.cloud);
                }
                this.createPointCloud(
                    gui.size,
                    gui.transparent,
                    gui.opacity,
                    gui.vertexColors,
                    gui.sizeAttenuation,
                    gui.color
                );
                // this.orbitControl.autoRotate = gui.rotateSystem;
            }
        }

        this.gui.add(gui, 'size', 0.1, 10).onChange(gui.redraw);
        this.gui.add(gui, 'transparent').onChange(gui.redraw);
        this.gui.add(gui, 'opacity', 0, 1).onChange(gui.redraw);
        this.gui.add(gui, 'vertexColors').onChange(gui.redraw);
        this.gui.add(gui, 'color').onChange(gui.redraw);
        this.gui.add(gui, 'sizeAttenuation').onChange(gui.redraw);
        this.gui.add(gui, 'rotateSystem').onChange(gui.redraw);

        gui.redraw();
    }

    createPointCloud(size: number, transparent: boolean, opacity: number, vertexColors: boolean, sizeAttenuation: boolean, color: number) {
        const texture = new THREE.TextureLoader().load('/snow.png');
        const geom = new THREE.Geometry();
        const material = new THREE.PointsMaterial({
            size,
            transparent,
            opacity,
            vertexColors,
            sizeAttenuation,
            color,
            map: texture,
            depthTest: false // 解决透明度有问题的情况
        });

        const range = 120;
        for(let i = 0; i < 15000; i++) {
            const particle = new THREE.Vector3(
                Math.random() * range - range / 2,
                Math.random() * range - range / 2,
                Math.random() * range - range / 2,
            );
            particle.velocityX = (Math.random() - 0.5) / 3;
            particle.velocityY = 0.1 + Math.random() / 5;
            geom.vertices.push(particle);

            const color = new THREE.Color(0xffffff);
            geom.colors.push(color);
        }

        const cloud = new THREE.Points(geom, material);
        this.cloud = cloud;
        this.cloud.sortParticles = true;
        this.scene.add(cloud);
    }
}

const app = new App();
app.start();