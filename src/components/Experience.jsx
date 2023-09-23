import { useRef, useState } from 'react'
import { useFrame, useStore } from '@react-three/fiber'
import { Perf } from 'r3f-perf';
import * as THREE from 'three' 
import { OrbitControls } from '@react-three/drei';

import gsap from 'gsap';
import Fingerprint from './Fingerprint';



export default function Experience(){
    //
    const {} = useState();    

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
            'prompt': 'The best Qr Ever',
            'id': '1'
        },
        {
            'image': '/textures/QrCode1.jpeg',
            'prompt': 'The best Qr Ever',
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

    //--------------------------------------- Loaders ----------------------------------------------
    const loadingManager = new THREE.LoadingManager();
    const textureLoader = new THREE.TextureLoader(loadingManager);

    loadingManager.onLoad = ()=>{
        // loaded();
    }

    //Fingerprint
    const fingerprintTexture = textureLoader.load('/textures/fingerprint2.jpg');


    //QrCodes
    // const qrCodesTextures = [];
    //Function will fill QrCodesTextures array wich will be used to generate each QrCode with random textures
    // for(let i = 0; i < (qrCodes.length > countQrCodes ? countQrCodes : qrCodes.length ); i++){
    //     const texture = textureLoader.load(qrCodes[i].image)
    //     texture .generateMipmaps = false;
    //     texture.magFilter = THREE.NearestFilter;
    //     texture.minFilter = THREE.NearestFilter;
    //     qrCodesTextures.push(texture)
    // }
    //Setup


    //------------------------------------- Objects -----------------------------------------------

    let timeLine = 0
    
    useFrame((state, delta)=>{
        const elapsedTime = state.clock.getElapsedTime();
        timeLine = elapsedTime;
        console.log(timeLine)
    })


    return <>
        <OrbitControls/>
        <Perf/>

        <Fingerprint
            particlesSize={debug.fingerprintParticlesSize}
            fingerprintTexture={fingerprintTexture}
            fingerprintHeight={debug.fingerprintHeight}
            fingerprintWidth={debug.fingerprintWidth}
            resolution={debug.fingerprintResolution}
            randomOffset={debug.randomOffset}
            fingerprintBaseColor1={debug.fingerprintBaseColor1}
            fingerprintBaseColor2={debug.fingerprintBaseColor2}
            fingerprintBaseColor3={debug.fingerprintBaseColor3}
            timeLine={timeLine}
        />
    </>
}