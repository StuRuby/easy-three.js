import * as THREE from 'three';

export function createScene() {
    const scene = new THREE.Scene();
    return scene;
}

export function createCamera(
    type: 'Perspective' | 'Orthographic',
    params: {
        position: [number, number, number],
    }
) {
    let camera;
    if(type === 'Perspective') {
        camera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(params.position[0], params.position[1], params.position[2]);
    } else if(type === 'Orthographic') {
        camera = new THREE.OrthographicCamera(window.innerWidth / -16, window.innerWidth / 16, window.innerHeight / 16, window.innerHeight / -16);
        camera.position.set(params.position[0], params.position[1], params.position[2]);
    } else {
        throw new Error('不支持该摄像机类型');
    }
    return camera;
}


export function createRender() {
    const render = new THREE.WebGLRenderer();
    render.setSize(window.innerWidth, window.innerHeight);
    render.setClearColor(new THREE.Color(0, 0, 0));
    document.getElementById("WebGL-output")!.appendChild(render.domElement);
    return render;
}

export function createPlane(
    params: {
        geometry: [number, number, number, number],
        material: { color: any },
        position: [number, number, number],
        rotation: [number, number, number]
    }
) {
    const { geometry, material, position, rotation } = params;
    const planeGeometry = new THREE.PlaneGeometry(geometry[0], geometry[1], geometry[2], geometry[3]);
    const planeMaterial = new THREE.MeshLambertMaterial(material);
    const plane = new THREE.Mesh(planeGeometry, planeMaterial);
    plane.position.set(position[0], position[1], position[2]);
    plane.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
    plane.receiveShadow = true;
    return plane;
}

export function createCube(
    params: {
        geometry: [number, number, number],
        material: { color: any },
        position: [number, number, number],
        rotation: [number, number, number]
    }
) {
    const { geometry, material, position, rotation = [0, 0, 0] } = params;
    const cubeGeometry = new THREE.BoxGeometry(geometry[0], geometry[1], geometry[2]);
    const cubeMaterial = new THREE.MeshLambertMaterial(material);
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.set(position[0], position[1], position[2]);
    cube.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
    cube.castShadow = true;
    return cube;
}

export function createSphere(
    params: {
        geometry: [number, number, number],
        material: { color: any },
        position: [number, number, number],
        rotation: [number, number, number]
    }
) {
    const { geometry, material, position, rotation = [0, 0, 0] } = params;
    const sphereGeometry = new THREE.SphereGeometry(geometry[0], geometry[1], geometry[2]);
    const sphereMaterial = new THREE.MeshLambertMaterial(material);
    const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    sphere.position.set(position[0], position[1], position[2]);
    sphere.rotation.set(rotation[0] || 0, rotation[1] || 0, rotation[2] || 0);
    sphere.castShadow = true;
    return sphere;
}

export function createAmbientLight(
    params: {
        color: any,
    }
) {
    const { color } = params;
    const ambientColor = new THREE.AmbientLight(color);
    return ambientColor;
}

export function createSpotLight(
    params: {
        color: any,
        position: [number, number, number],
        shadowCameraNear?: number,
        shadowCameraFar?: number,
        shadowCameraFov?: number,
        target?: any,
        distance?: number,
        angle?: number
    }
) {
    const { color, position } = params;
    const spotLight = new THREE.SpotLight(color);
    spotLight.position.set(position[0], position[1], position[2]);
    if(params.shadowCameraNear) spotLight.shadowCameraNear = params.shadowCameraNear;
    if(params.shadowCameraFar) spotLight.shadowCameraFar = params.shadowCameraFar;
    if(params.shadowCameraFov) spotLight.shadowCameraFov = params.shadowCameraFov;
    if(params.target) spotLight.target = params.target;
    if(params.distance) spotLight.distance = params.distance;
    if(params.angle) spotLight.angle = params.angle;
    return spotLight;
}

export function createDirectionLight(
    params: {
        color: number | string,
        position: [number, number, number],
        shadowCameraNear?: number,
        shadowCameraFar?: number,
        shadowCameraFov?: number,
        shadowCameraLeft?: number,
        shadowCameraRight?: number,
        shadowCameraTop?: number,
        shadowCameraBottom?: number,
        distance?: number,
        intensity?: number,
        shadowMapHeight?: number,
        shadowMapWidth?: number
    }
) {
    const { color, position, shadowCameraNear, shadowCameraFar, shadowCameraFov, shadowCameraLeft, shadowCameraRight, shadowCameraTop, shadowCameraBottom, shadowMapWidth, shadowMapHeight, distance, intensity } = params;
    const directionLight = new THREE.DirectionalLight(color, intensity || 1);
    directionLight.position.set(position[0], position[1], position[2]);
    if(shadowCameraNear) directionLight.shadowCameraNear = shadowCameraNear;
    if(shadowCameraFar) directionLight.shadowCameraFar = shadowCameraFar;
    if(shadowCameraFov) directionLight.shadowCameraFov = shadowCameraFov;
    if(shadowCameraLeft) directionLight.shadowCameraLeft = shadowCameraLeft;
    if(shadowCameraRight) directionLight.shadowCameraRight = shadowCameraRight;
    if(shadowCameraTop) directionLight.shadowCameraTop = shadowCameraTop;
    if(shadowCameraBottom) directionLight.shadowCameraBottom = shadowCameraBottom;
    if(shadowMapWidth) directionLight.shadowMapWidth = shadowMapWidth;
    if(shadowMapHeight) directionLight.shadowMapHeight = shadowMapHeight;
    return directionLight;
}

export function createHemisphereLight(
    params: {
        skyColor?: number,
        groundColor?: number,
        intensity?: number
    }
) {

}
