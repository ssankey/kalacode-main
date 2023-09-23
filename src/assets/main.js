import './style.css';

import * as THREE from 'three';


import gsap from 'gsap';


//------------------------- Variables 

//Particles configuration
const debug = {
    //Fingerprint
    fingerprintBaseColor1: '#e17209',
    fingerprintBaseColor2: '#ffffff',
    fingerprintBaseColor3: '#1d5ef7',
    fingerprintWidth: 10,
    fingerprintHeight: 14,
    fingerprintResolution: 110,
    fingerprintParticlesSize : 70,
    fingerprintparticlesRandomOffset: 0.3,

    //Random particles 
    ranodmCount: 500,
    randomSize: 20,
    randomParticlesDepth: 50,

    
};

let experienceStarted = false;

let randomColors = null;

let fingerprintParticlesMaterial = null;
let fingerprintParticlesGeometry = null;
let fingerprintParticles = null;

let randomParticlesGeometry = null;
let randomParticlesMaterial = null;
let randomParticles = null;
let randomPositions = null;

let qrCodes = [
    {
        'image': '/textures/QrCode.png',
        'prompt': 'The best Qr Ever 1',
        'id': '1'
    },
    {
        'image': '/textures/QrCode1.jpeg',
        'prompt': 'The best Qr Ever 2',
        'id': '2'
    },
    {
        'image': '/textures/QrCode.png',
        'prompt': 'The best Qr Ever',
        'id': '3'
    }
]

let countQrCodes = 400;
const qrCodeGeometry = new THREE.PlaneGeometry(0.5, 0.5);
let qrCodesArray = [];
let qrCodeMaterial  = null;

let texts = null;

// let currentIntersect = false;
let mouseIntersects = null;
let isObjectSelected = false;
let qrCodeSelected = null;


//-------------------------------- Utils ----------------------------------------------------------
//Sizes 
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight
}

//Resize

window.addEventListener('resize', ()=>{
    //Update Sizes 
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    //Update camera
    camera.aspect = sizes.width/sizes.height;
    camera.updateProjectionMatrix();

    //Update Renderer
    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    //Update Material
    fingerprintParticlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    randomParticlesMaterial.uniforms.uPixelRatio.value = Math.min(window.devicePixelRatio, 2);
    
    //Scroll speed update
    if(sizes.width > 700){
        scrollVelocity = 0.12;
        scrollContainer.style.height = '26000px';    
    }else{
        scrollVelocity = 0.075;
        scrollContainer.style.height = '40500px';
    }
});

//------------------------------ Loaders --------------------------------------------------

const loadingManager = new THREE.LoadingManager();
const textureLoader = new THREE.TextureLoader(loadingManager);

loadingManager.onLoad = ()=>{
    loaded();
}


//Fingerprint
const fingerprintTexture = textureLoader.load('/textures/fingerprint2.jpg');

//QrCodes
const qrCodesTextures = [];
//Function will fill QrCodesTextures array wich will be used to generate each QrCode with random textures
for(let i = 0; i < (qrCodes.length > countQrCodes ? countQrCodes : qrCodes.length ); i++){
    const texture = textureLoader.load(qrCodes[i].image)
    texture .generateMipmaps = false;
    texture.magFilter = THREE.NearestFilter;
    texture.minFilter = THREE.NearestFilter;
    qrCodesTextures.push(texture)
}


//--------------------------------------------- Setup ----------------------------

//Scene 
const scene = new THREE.Scene();
scene.fog = new THREE.Fog(new THREE.Color('#000000'), 1, 40);

//Camera 
const cameraGroup = new THREE.Group()
scene.add(cameraGroup)

const camera = new THREE.PerspectiveCamera(50, sizes.width/sizes.height, 0.01, 50);
camera.position.set(0, 0, 0);
cameraGroup.add(camera)

//Renderer
const canvas = document.querySelector('.experience')
const renderer = new THREE.WebGLRenderer({
    canvas: canvas, 
    alpha:true
}); 

renderer.setClearAlpha = 0;

renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setSize(sizes.width, sizes.height);


//---------------------------------------------- Overlay------------------------------

const scrollContainer = document.querySelector('.scrollable-container');

const buttonGenerateThenActive = document.querySelector('.button_generate-then--active')
const buttonGenerateThen = document.querySelector('.button_generate-then')
const generate = document.querySelector('.button_generate-now');

const loaded = ()=>{
    setTimeout(()=>{
        experienceStarted = true;
    }, 500)
    if(sizes.width > 700){
        scrollVelocity = 0.12;
        scrollContainer.style.height = '26000px';    
    }else{
        scrollVelocity = 0.075;
        scrollContainer.style.height = '40500px';
    }
}


// generate.addEventListener('pointerdown',()=> {
//     window.scrollTo(0, sizes.width > 21700 ? 35300 : 18400);
// })

buttonGenerateThen.addEventListener('pointerdown', ()=>{
    window.scrollTo(0, sizes.width > 700 ? 5300 : 8400);
    // gsap.to(window, {duration: 1, delay: 0, scrollY: 5300})
})
buttonGenerateThenActive.addEventListener('pointerdown', ()=>{
    // gsap.to(window, {duration: 1, delay: 0, scrollY: 5300})
    window.scrollTo(0, sizes.width > 700 ? 5300 : 8400);
})

//-------------------------------------------- Creating elements ---------------------------

createFingerprint();
// fingerprintParticles.visible = false;
createRandomParticles();
// randomParticles.visible = false;
createQrCodes();

createText();

//-------------------------------------------- Ray caster & Qr Interaction ---------------------
const raycaster = new THREE.Raycaster();

const qrCodeInfo = document.querySelector('.QrCodeInfo')
const qrCodePrompt = document.getElementById('QrCodeInfo__prompt')


const qrCodeOnClick = (event)=>{
    const clickCoord = new THREE.Vector2(
        (event.clientX/sizes.width-0.5)*2,
        -(event.clientY/sizes.height-0.5)*2,
    )

    raycaster.setFromCamera(clickCoord, camera);
    mouseIntersects = raycaster.intersectObjects(qrCodesArray);

    if(mouseIntersects.length > 0 && mouseIntersects[0].distance < 35 && !isObjectSelected){
        qrCodeSelected = mouseIntersects[0].object;
        qrCodeSelected.isSelected = true;
        isObjectSelected = true;
        const i = qrCodesArray.indexOf(qrCodeSelected);
        
        qrCodeInfo.classList.add('QrCodeInfo--active')
        qrCodePrompt.textContent = qrCodes[qrCodeSelected.index].prompt;

        qrCodeToCero();

    } else if (isObjectSelected) {
        qrCodeInfo.classList.remove('QrCodeInfo--active')
        qrCodeToPrevious();    
    }
} 
window.addEventListener('pointerdown', qrCodeOnClick);

function qrCodeToCero(){
    gsap.to(qrCodeSelected.position, {duration: 0.5, delay: 0, x: 0});
    gsap.to(qrCodeSelected.position, {duration: 0.5, delay: 0, y: 0});
    gsap.to(qrCodeSelected.position, {duration: 0.5, delay: 0, z: -2.5});

    gsap.to(qrCodeSelected.rotation, {duration: 0.5, delay: 0, x:  0})
    gsap.to(qrCodeSelected.rotation, {duration: 0.5, delay: 0, y:  3.14159})
    gsap.to(qrCodeSelected.rotation, {duration: 0.5, delay: 0, z:  0})

    gsap.to(cameraGroup.position, {duration: 0.5, delay: 0, x: 0});
    gsap.to(cameraGroup.position, {duration: 0.5, delay: 0, y: 0});
}

function qrCodeToPrevious(){
    qrCodeInfo.classList.remove('QrCodeInfo--active')


    isObjectSelected = false;
    setTimeout(()=>{
        qrCodeSelected.isSelected = false;
        qrCodeSelected = null;
    }, 500);
    const i = qrCodesArray.indexOf(qrCodeSelected)

    gsap.to(qrCodeSelected.position, {duration: 0.5, delay: 0, x: randomPositions[i*3+0]/2});
    gsap.to(qrCodeSelected.position, {duration: 0.5, delay: 0, y: randomPositions[i*3+1]/2});
    gsap.to(qrCodeSelected.position, {duration: 0.5, delay: 0, z: (timeLine.t*0.25+randomPositions[i*3+2]*12)-160});

    gsap.to(qrCodeSelected.rotation, {duration: 0.5, delay: 0, x: qrCodeSelected.actualRotation.x})
    gsap.to(qrCodeSelected.rotation, {duration: 0.5, delay: 0, y: qrCodeSelected.actualRotation.y})
    gsap.to(qrCodeSelected.rotation, {duration: 0.5, delay: 0, z: qrCodeSelected.actualRotation.z})

    gsap.to(cameraGroup.position, {duration: 0.5, delay: 0, x: 0});
    gsap.to(cameraGroup.position, {duration: 0.5, delay: 0, y: 0});
}


//-------------------------------------------- Animation ----------------------------------

//Scroll event
let timeLine = { t : 0 };
let scrollVelocity = null;
window.addEventListener('scroll', (event)=>{
    gsap.to(timeLine, {duration:1, delay: 0, t: scrollY*scrollVelocity});
    if(isObjectSelected){
        qrCodeToPrevious();
    }
    
})

//Animate
const cursor = new THREE.Vector2();
window.addEventListener('mousemove', (event)=>{
    cursor.x = ((event.clientX/ sizes.width)-0.5)*2;
    cursor.y = -((event.clientY/ sizes.height)-0.5)*2;  
})

const clock = new THREE.Clock();
let previousTime = 0;

const tick = ()=>{
    // stats.begin()

    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - previousTime;
    previousTime = elapsedTime;

    //Animating Particles Position
    if(timeLine.t > 400){
        randomParticles.position.z = (timeLine.t - 400)*0.25;
    }

    //Animating buttons
    const timeStart = 400
    const timeEnds = 600
    const buttonPercentage = Math.max(0 ,Math.min(1, (timeLine.t - timeStart)/(timeEnds - timeStart)))*100;
    buttonGenerateThenActive.style.clipPath = `polygon(${buttonPercentage}% 0, ${buttonPercentage}% 100%, 0 100%, 0 0)`;

    //Parallax Effect
    const parallaxX = cursor.x*0.5;
    const parallaxY = cursor.y*0.5;

    if(!isObjectSelected){
        cameraGroup.position.x += (parallaxX - cameraGroup.position.x)*2 * deltaTime;
        cameraGroup.position.y += (parallaxY - cameraGroup.position.y)*2 * deltaTime;
    }

    //Animating QrCodes 
    if(qrCodesArray && timeLine.t > 400){
        for (let i = 0; i < qrCodesArray.length; i++){
            if(!qrCodesArray[i].isSelected){
                qrCodesArray[i].position.z = (timeLine.t*0.25+randomPositions[i*3+2]*12)-160
                qrCodesArray[i].setRotationFromAxisAngle(new THREE.Vector3(randomPositions[i*3+1], randomPositions[i*3+2], randomPositions[i*3+2]).normalize(),  (((timeLine.t+i)*0.2)+elapsedTime)*0.1);                
                qrCodesArray[i].actualRotation = new THREE.Vector3(qrCodesArray[i].rotation.x, qrCodesArray[i].rotation.y, qrCodesArray[i].rotation.z);
            }
        }

    }


    //Animating text

    for (const text of texts){
        //Animating position
        text.position.z = Math.pow(((timeLine.t*text.speed)-text.appearTime), text.staticTime)-text.distance;

        //Adding perspective 
        const scale = -1.0 * (1.0/ text.position.z)
        if(text.position.z < -0.01 && text.position.z > -40){
            text.element.style.display = 'flex';
            text.element.style.scale = scale;
        }else{
            text.element.style.display = 'none';
        }   
    }
    

    //Update materials 
    fingerprintParticlesMaterial.uniforms.uTimeLine.value = timeLine.t;
    fingerprintParticlesMaterial.uniforms.uTime.value = elapsedTime;
    
    randomParticlesMaterial.uniforms.uTime.value = elapsedTime;
    randomParticlesMaterial.uniforms.uTimeLine.value = timeLine.t;

    renderer.render(scene, camera);
    window.requestAnimationFrame(tick);
    // stats.end()
} 

tick();

//---------------------------------------- Functions ------------------------------

function createFingerprint(){
    //Errase last fingertip
    if(fingerprintParticles){
        fingerprintParticlesGeometry.dispose();
        fingerprintParticlesMaterial.dispose();
        scene.remove(fingerprintParticles);
    }

    //Options
    const width = debug.fingerprintWidth;
    const height = debug.fingerprintHeight;
    const resolution = debug.fingerprintResolution;
    const size = debug.fingerprintParticlesSize;
    const randomOffset = debug.fingerprintparticlesRandomOffset;
    const colors = [debug.fingerprintBaseColor1, debug.fingerprintBaseColor2, debug.fingerprintBaseColor3]

    //Geometry 
    fingerprintParticlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(resolution*resolution*3);
    const randomValues = new Float32Array(resolution*resolution);
    randomColors = new Float32Array(resolution*resolution*3);
    
    let v = 0;
    for (let i = 0; i < positions.length; i++ ){
        const x = i*3+0;
        const y = (i*3)+1;
        const z = (i*3)+2;

        //Position
        for (let h = 0; h < resolution; h++){
            positions[v*3+0] = i*(width/resolution)+ (Math.random()*randomOffset);
            positions[v*3+1] = h*(height/resolution)+ (Math.random()*randomOffset);
            v++;
        }

        //Colors         
        const baseColor = new THREE.Color(colors[Math.floor(Math.random()*3)])
        
        baseColor.getHSL(baseColor, THREE.SRGBColorSpace);
        const h = baseColor.h
        
        let l = 0;
        l =  ((Math.random()-0.5)*0.2)+baseColor.l;
        
        const finalColor = new THREE.Color().setHSL( baseColor.h, baseColor.s, l);
        randomColors[x] = finalColor.r
        randomColors[y] = finalColor.g
        randomColors[z] = finalColor.b

        //Randomnes
        randomValues[i] = Math.random();
    }
    

    fingerprintParticlesGeometry.setAttribute('position' ,new THREE.BufferAttribute(positions, 3));
    fingerprintParticlesGeometry.setAttribute('aRandomColors', new THREE.BufferAttribute(randomColors, 3));
    fingerprintParticlesGeometry.setAttribute('aRandom', new THREE.BufferAttribute(randomValues, 1));
    fingerprintParticlesGeometry.center();

    //Material
    fingerprintParticlesMaterial = new THREE.ShaderMaterial({
        vertexShader: `
        attribute vec3 aRandomColors;
        attribute float aRandom;
        
        uniform sampler2D uTexture;
        uniform float uWidth;
        uniform float uHeight;
        uniform float uPointSize;
        uniform float uPixelRatio;
        uniform float uTime;
        uniform float uTimeLine;
        
        varying vec3 vRandomColor;
        varying vec4 vPointColor;
        
        
        void main (){
            vec3 vertexPosition = position;
        
            //Create animation
            float originalPosition = position.z;
            float randomDistance = aRandom*2.0;
            float frameOrigin = 300.0;
            float newTimeLine = abs(uTimeLine-frameOrigin)*-1.0+frameOrigin;
            // float newTimeLine = (pow((uTimeLine-frameOrigin)*0.1, 3.0)*+100.0);
            float x = newTimeLine*0.5; //-5.0 used to make the values of x can go bellow 0
            
            //Aplicando randomicidad a los vertices (posicion inicial)
            vertexPosition.z += randomDistance*50.0+40.0;
        
            
            vertexPosition.z -= x;
            vertexPosition.z = clamp(vertexPosition.z, originalPosition, 1000.0);
            vertexPosition.z += uTimeLine*0.04;
            // vertexPosition.z += 50.0;
        
        
            vec4 modelPosition = modelMatrix * vec4(vertexPosition, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
        
            //PointSize
            gl_PointSize = uPointSize;
        
            //Perspective & pixelRatio fix
            gl_PointSize *= clamp(1.0/ -viewPosition.z, 0.0, 0.25);
            gl_PointSize *= uPixelRatio;
        
        
        
            //Varyings
            vRandomColor = aRandomColors;
        
            vec2 vertexUv = vec2(vertexPosition.x/uWidth, vertexPosition.y/uHeight);
            vertexUv.x += 0.5;
            vertexUv.y += 0.5;
            
            vPointColor = texture2D(uTexture, vertexUv); 
            vPointColor -= vec4(step(vPointColor.r, 0.5));
        }`,
        fragmentShader: `
        varying vec3 vRandomColor;
        varying vec4 vPointColor;


        void main (){

            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.1;

            gl_FragColor = vec4(vRandomColor.r * strength, vRandomColor.g * strength, vRandomColor.b* strength, strength );
        
        
            vec4 color = vec4(vRandomColor.r*vPointColor.r, vRandomColor.g*vPointColor.g, vRandomColor.b*vPointColor.b, vPointColor.a);
        
            vec4 colorGlowPoint = vec4(color.r * strength, color.g * strength, color.b * strength, color.a * strength);
        
            gl_FragColor = vec4(color);
        
            // if(gl_FragColor.r < 0.1){
            //     discard;
            // }
        
        
        }
        `,
        transparent: true,
        depthWrite: false,
        uniforms:{
            uPointSize: { value: size },
            uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
            uTexture: { value: fingerprintTexture },
            uWidth: { value: width },
            uHeight: { value: height },
            uTime: { value: 0 },
            uTimeLine: { value: 0 },
        }
    })

    //Particles 
    fingerprintParticles = new THREE.Points(fingerprintParticlesGeometry, fingerprintParticlesMaterial)
    fingerprintParticles.position.z = -40;

    scene.add(fingerprintParticles);
}

function createRandomParticles(){
    if(randomParticles){
        scene.remove(randomParticles);
        randomParticlesGeometry.dispose();
        randomParticlesMaterial.dispose();
    }
    //Options
    const count = debug.ranodmCount;
    const size = debug.randomSize;
    const width = debug.fingerprintWidth; 
    const height = debug.fingerprintHeight;
    const depth = debug.randomParticlesDepth;

    //Geometry 
    randomParticlesGeometry = new THREE.BufferGeometry();
    const positions = new Float32Array(count*3);

    for(let i = 0; i < count; i++){
        const phi = Math.random() * Math.PI * 2; // Ángulo alrededor del eje Y (0 a 2π)
        const costheta = Math.random() * 2 - 1; // Valor entre -1 y 1
        const u = Math.random(); // Valor entre 0 y 1
        const theta = Math.acos(costheta); // Ángulo respecto al eje Y (0 a π)
        const r = height/2 * Math.cbrt(u); // Aplicamos la distancia radial para distribuir las partículas uniformemente en el volumen de la esfera
      
        // Coordenadas cartesianas
        const x = r * Math.sin(theta) * Math.cos(phi);
        const y = r * Math.sin(theta) * Math.sin(phi);
        const z = r * Math.cos(theta);
      
        positions[i*3+0] = x
        positions[i*3+1] = y
        positions[i*3+2] = (Math.random()-1.0)*depth;

        // positions[i*3+0] = (Math.random()-0.5)*width;
        // positions[i*3+1] = (Math.random()-0.5)*height;
        // positions[i*3+2] = (Math.random()-1.0)*depth;
    }
    randomPositions = positions;

    randomParticlesGeometry.setAttribute('position' ,new THREE.BufferAttribute(positions, 3));
    randomParticlesGeometry.setAttribute('aRandomColors' ,new THREE.BufferAttribute(randomColors, 3));

   //Material
    randomParticlesMaterial = new THREE.ShaderMaterial({
    vertexShader: `
        attribute vec3 aRandomColors;

        uniform float uPointSize;
        uniform float uPixelRatio;
        uniform float uTime;
        uniform float uTimeLine;
        uniform float uDepth;

        varying vec3 vRandomColor;

        //Model matrix
        //View Matrix
        //Projection matrix 


        void main (){
            vec3 vertexPosition = position;
        
            //Modified the wich change direction at time line value 300
            float timeLine = -abs(uTimeLine-400.0);
            float t = -(timeLine-uTime)*0.005;
            t += distance(vertexPosition.z, 0.0);
        
            //Particles go backwards when arrived to 0
            vertexPosition.z = (t - floor((t+1.0)))*uDepth;
        

            vec4 modelPosition = modelMatrix * vec4(vertexPosition, 1.0);
            vec4 viewPosition = viewMatrix * modelPosition;
            vec4 projectedPosition = projectionMatrix * viewPosition;
        
            gl_Position = projectedPosition;
        
            //PointSize
            gl_PointSize = uPointSize;
        
            //Perspective & pixelRatio fix
            gl_PointSize *= (1.0/ -viewPosition.z);
            gl_PointSize *= uPixelRatio;
        
            //Varyings
            vRandomColor = aRandomColors;
        
        
        }
    `,
    fragmentShader: `
        varying vec3 vRandomColor;


        void main (){

            float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
            float strength = 0.05 / distanceToCenter - 0.5;
            vec4 colorGlowPoint = vec4(vRandomColor.r*strength, vRandomColor.g*strength, vRandomColor.b*strength, strength);
        
            // gl_FragColor = colorGlowPoint;
        
        
        
            gl_FragColor = vec4(vRandomColor, 1.0);
        
        
        
        }
    `,
    depthWrite: false,
    transparent: true,
    uniforms: {
        uPointSize: { value: size },
        uPixelRatio: { value : Math.min(window.devicePixelRatio, 2)},
        uTime: { value: 0 },
        uTimeLine: { value: 0 },
        uDepth: { value: depth },
    }
})

    randomParticles = new THREE.Points(randomParticlesGeometry, randomParticlesMaterial);
    scene.add(randomParticles);

}

function createQrCodes(){

    //Will create the Qr Codes
    for (let i = 0; i < countQrCodes; i++){
        let randomImage = 0;

        //This takes all the textures that where loaded, once they all used,then will start tu use random textures from the same qrCodesTextures array 
        if(i <= qrCodesTextures.length){
           randomImage = i;
        }else{
            randomImage = Math.floor(Math.random()*qrCodesTextures.length)
        }


        qrCodeMaterial = new THREE.MeshBasicMaterial({
            side: THREE.DoubleSide,
            map: qrCodesTextures[randomImage],
            color: new THREE.Color(randomColors[i*3+0],randomColors[i*3+1], randomColors[i*3+2]),
        });

        const qrCodeMesh = new THREE.Mesh(qrCodeGeometry, qrCodeMaterial)
        qrCodeMesh.position.x = randomPositions[i*3+0]/2
        qrCodeMesh.position.y = randomPositions[i*3+1]/2
        qrCodeMesh.position.z = 5;
        qrCodeMesh.isSelected = false;
        qrCodeMesh.index = randomImage;
        
        scene.add(qrCodeMesh);
        qrCodesArray.push(qrCodeMesh);      
    }    
}

function createText(){


    texts = [
        {
            position: new THREE.Vector3(0, 0, 0),
            element: document.querySelector('.text-0'),
            appearTime: 0,
            speed: 0.03,
            distance: 1,
            staticTime: 5
        },
        {
            position: new THREE.Vector3(0, 0, 0),
            element: document.querySelector('.text-1'),
            appearTime: 2.5,
            speed: 0.03,
            distance: 1,
            staticTime: 5
        },
        {
            position: new THREE.Vector3(0, 0, 0),
            element: document.querySelector('.text-2'),
            appearTime: 5,
            speed: 0.03,
            distance: 1,
            staticTime: 5
        },
        {
            position: new THREE.Vector3(0, 0, 0),
            element: document.querySelector('.text-3'),
            appearTime: 7.5,
            speed: 0.03,
            distance: 1,
            staticTime: 5
        },
        {
            position: new THREE.Vector3(0, 0, 0),
            element: document.querySelector('.text-4'),
            appearTime: 3.75,
            speed: 0.008,
            distance: 1,
            staticTime: 13
        },
    ];
}























