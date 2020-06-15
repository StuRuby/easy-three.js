import * as THREE from 'three';
import * as dat from 'dat.gui';
import * as Stats from 'stats.js';

class App {
    stats!: Stats;
    perspective!: string;
    camera!: THREE.Camera;
    scene!: THREE.Scene;
    renderer!: THREE.WebGLRenderer;
    constructor() {
        this.stats = this.initStats();
        this.setup();
    }

    setup() {
        const scene = new THREE.Scene();
        this.scene = scene;
        const camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.camera = camera;
        camera.position.x = 120;
        camera.position.y = 60;
        camera.position.z = 180;

        const renderer = new THREE.WebGLRenderer();
        renderer.setClearColor(new THREE.Color(0, 0, 0));
        renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer = renderer;


        const planeGeometry = new THREE.PlaneGeometry(180, 180);
        const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
        const plane = new THREE.Mesh(planeGeometry, planeMaterial);
        plane.rotation.x = -0.5 * Math.PI;
        plane.position.set(0, 0, 0);

        scene.add(plane);

        const cubeGeometry = new THREE.BoxGeometry(4, 4, 4);

        for(let i = 0; i < planeGeometry.parameters.height / 5; i++) {
            for(let j = 0; j < planeGeometry.parameters.width / 5; j++) {
                const rnd = Math.random() * 0.75 + 0.25;
                const cubeMaterial = new THREE.MeshLambertMaterial();
                cubeMaterial.color = new THREE.Color(rnd, 0, 0);
                const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

                cube.position.z = -((planeGeometry.parameters.height) / 2) + 2 + j * 5;
                cube.position.x = -((planeGeometry.parameters.width) / 2) + 2 + i * 5;
                cube.position.y = 2;

                scene.add(cube);
            }
        }

        const directionalLight = new THREE.DirectionalLight(0xffffff, 0.7);
        directionalLight.position.set(-20, 40, 60);
        scene.add(directionalLight);

        const ambientLight = new THREE.AmbientLight(0x292929);
        scene.add(ambientLight);

        document.body.appendChild(renderer.domElement);


        const controls = {
            perspective: 'Perspective',
            switchCamera: this.switchCamera.bind(this)
        }

        const gui = new dat.GUI();
        gui.add(controls, 'switchCamera');
        gui.add(controls, 'perspective').listen();

        camera.lookAt(scene.position);
    }

    start() {
        this.stats.update();
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