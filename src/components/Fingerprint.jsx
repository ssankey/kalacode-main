import { useFrame } from '@react-three/fiber';
import { useEffect, useRef } from 'react';
import * as THREE from 'three'
import { pingpong } from 'three/src/math/MathUtils';

export default function  Fingerprint ({particlesSize=20, fingerprintWidth = 10, fingerprintHeight = 10, fingerprintTexture, resolution=100, randomOffset=0, fingerprintBaseColor1='#ffffff', fingerprintBaseColor2='#ffffff', fingerprintBaseColor3='#ffffff', timeLine}){
    const points = useRef();


    useEffect(()=>{
        const positions = new Float32Array(resolution*resolution*3);
        const randomValues = new Float32Array(resolution*resolution);
        const randomColors = new Float32Array(resolution*resolution*3);
        const colors = [fingerprintBaseColor1, fingerprintBaseColor2, fingerprintBaseColor3];

        let v = 0;
        for (let i = 0; i < positions.length; i++ ){
            const x = i*3+0;
            const y = (i*3)+1;
            const z = (i*3)+2;
    
            //Position
            for (let h = 0; h < resolution; h++){
                positions[v*3+0] = i*(fingerprintWidth/resolution)+ (Math.random()*randomOffset);
                positions[v*3+1] = h*(fingerprintHeight/resolution)+ (Math.random()*randomOffset);
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
        const geometry = new THREE.BufferGeometry();
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('aRandomColors', new THREE.BufferAttribute(randomColors, 3));
        geometry.setAttribute('aRandom', new THREE.BufferAttribute(randomValues, 1));

        geometry.center();
        points.current.geometry = geometry
    })

    useEffect(()=>{
        console.log(timeLine)
        points.current.material.uniforms.uTimeLine.value = timeLine;        
    }, [,timeLine])

    // useFrame((state, delta)=>{
    //     // points.current.material.uniforms.uTimeLine.value = timeLine;
    // })
    

    return <>
        <points ref={points}>

            <shaderMaterial 
                vertexShader={`
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
                    }
                `}

                fragmentShader={ `
                    varying vec3 vRandomColor;
                    varying vec4 vPointColor;


                    void main (){
                    
                        float distanceToCenter = distance(gl_PointCoord, vec2(0.5));
                        float strength = 0.05 / distanceToCenter - 0.1;
                    
                        gl_FragColor = vec4(vRandomColor.r * strength, vRandomColor.g * strength, vRandomColor.b* strength, strength );
                    
                    
                        vec4 color = vec4(vRandomColor.r*vPointColor.r, vRandomColor.g*vPointColor.g, vRandomColor.b*vPointColor.b, vPointColor.a);
                    
                        vec4 colorGlowPoint = vec4(color.r * strength, color.g * strength, color.b * strength, color.a * strength);
                    
                        gl_FragColor = vec4(color);
                    }
                `} 
                depthWrite={false}
                transparent={true}
                uniforms={{
                    uPointSize: { value: particlesSize },
                    uPixelRatio: { value: Math.min(window.devicePixelRatio, 2) },
                    uTexture: { value: fingerprintTexture },
                    uWidth: { value: fingerprintWidth },
                    uHeight: { value: fingerprintHeight },
                    uTime: { value: 0 },
                    uTimeLine: { value: 0 },
                }}
            />
        </points>
    </>
}