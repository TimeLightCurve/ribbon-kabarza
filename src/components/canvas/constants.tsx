import { useTexture } from '@react-three/drei'
import {  useEffect, useMemo, useRef, useState } from 'react'
import * as THREE from 'three'
import { Vector3 } from 'three'
import type { IimageShaderMaterial } from './Experience'



const titlesList = [
	{ imageNum: 0, title: 'FLOWING' },
	{ imageNum: 1, title: 'NEWYORK' },
	{ imageNum: 2, title: 'FURNITURE' },
	{ imageNum: 3, title: 'CS AGENCY' },
	{ imageNum: 4, title: 'ATELIER' },
	{ imageNum: 5, title: 'ANCHOR' },
	{ imageNum: 6, title: 'EXHITBITON' },
	{ imageNum: 7, title: 'ART & TECH' },
	{ imageNum: 8, title: 'ORCHARD' },
	{ imageNum: 9, title: 'EXHITBITON' },
	{ imageNum: 10, title: 'PEAK' },
	{ imageNum: 11, title: 'SOUL' },
	{ imageNum: 12, title: 'OTHER MONTHS' },
]

export const carouselRadius = 26
export const carouselCount = 12
export const numPoints = 16 * 60
export const progressLength = 0.916

export const MOMENTUM_DECAY = 0.99
export const MOMENTUM_BOOST = 0.02
export const BASE_SPEED = 0.1

// const carouselAxisAngle = new Vector3(-0.5, -1, 0)
// const carouselAngle = -0.4

const carouselPoints = new Array(carouselCount).fill(undefined).map((_, i) => {
	const v = new Vector3()
	v.x = Math.sin(((carouselCount - 1 - i) / carouselCount) * Math.PI * 2) * carouselRadius
	v.y = 15
	v.z = Math.cos(((carouselCount - 1 - i) / carouselCount) * Math.PI * 2) * carouselRadius
	// v.applyAxisAngle(carouselAxisAngle, carouselAngle)
	v.applyEuler(new THREE.Euler(0, 0.0, -0.1))
	// v.applyQuaternion( new THREE.Quaternion().setFromAxisAngle(new Vector3(0,0,1), Math.PI / 8))
	return v
})

export const baseCurvePoints: Vector3[] = [
	new Vector3(-20, 10, -70),
	new Vector3(50, 30, -80),
	new Vector3(30, 30, -75),
	new Vector3(50, 30, -70),
	new Vector3(30, 30, -65),
	new Vector3(50, 30, -60),
	new Vector3(50, 10, -45),
	new Vector3(35, 4, -35),
	new Vector3(20, -10, -60),
	new Vector3(-10, 20, -30),
	new Vector3(10, 30, -22),
	new Vector3(0, 25, -11),
	// new Vector3(-30, 10, 20),
	...carouselPoints,
	new Vector3(carouselPoints[0].x - 10, carouselPoints[0].y + 20, carouselPoints[0].z + 20),
	new Vector3(60, 35, -30),
	new Vector3(30, 20, -30),
	new Vector3(20, 10, -35),
	new Vector3(10, 15, -48),
	new Vector3(5, 15, -58),
	new Vector3(25, 10, -85),
	new Vector3(50, -16, -82),
]

export function useLinenTextures() {
	const col = useTexture('https://flowing-canvas.vercel.app/linen/Plain_Grey_Texture_col.jpg')
	const normal = useTexture('https://flowing-canvas.vercel.app/linen/Plain_Grey_Texture_nrm.jpg')

	for (const t of [col, normal]) {
		t.wrapS = t.wrapT = THREE.RepeatWrapping
		t.needsUpdate = true
	}
	col.colorSpace = THREE.SRGBColorSpace

	return { col, normal }
}


export function useCarouselImages() {

	// const [domReady, setDomReady] = useState(false)

	// useEffect(() => {
	// 	// Wait for DOM to be fully loaded
	// 	if (document.readyState === 'complete') {
	// 		setDomReady(true)
	// 	} else {
	// 		const handleLoad = () => setDomReady(true)
	// 		window.addEventListener('load', handleLoad)
	// 		return () => window.removeEventListener('load', handleLoad)
	// 	}
	// }, [])

	  const imageUrls = useMemo(() => {
		// console.log(domReady)
		//   if (!domReady) {
		// 	  // Return placeholder URLs while waiting for DOM
		// 	  return Array(carouselCount)
		// 		  .fill(undefined)
		// 		  .map((_, i) => `https://flowing-canvas.vercel.app/images/img${Math.floor(i % carouselCount) + 1}_.webp`)
		//   }

		const webflowImages: string[] = []

		  for (let i = 1; i <= carouselCount; i++) {
			  const element = document.querySelector(`[data-flow-ribbon-img="${i}"]`)
			  if (element) {
				let imageUrl = ''
				const imgElement = element as HTMLImageElement
				imageUrl = imgElement.dataset.src || imgElement.src

				if (imageUrl &&
					!imageUrl.includes('placeholder') &&
					!imageUrl.endsWith('.avif') &&
					imageUrl.startsWith('http')) {
					webflowImages.push(imageUrl)
				}
			  }
		  }
		//   if(webflowImages.length > 0){
			  return webflowImages
		//   } else {
		// 	  return Array(carouselCount)
		// 		  .fill(undefined)
		// 		  .map((_, i) => `https://flowing-canvas.vercel.app/images/img${Math.floor(i % carouselCount) + 1}_.webp`)
		//   }  
	  }, [])

	const imageTextures = useTexture(imageUrls)
	const imageShaderRefs = useRef<(IimageShaderMaterial | null)[]>([])
	useMemo(() => {
		imageShaderRefs.current = Array(carouselCount).fill(null)
	}, [])

	return { imageUrls, imageTextures, imageShaderRefs }
}


export function useCarouselTexts() {



	const [domReady, setDomReady] = useState(false)

	useEffect(() => {
		// Wait for DOM to be fully loaded
		if (document.readyState === 'complete') {
			setDomReady(true)
		} else {
			const handleLoad = () => setDomReady(true)
			window.addEventListener('load', handleLoad)
			return () => window.removeEventListener('load', handleLoad)
		}
	}, [])

	const imageTexts = useMemo(() => {
		// console.log(domReady)
		if (!domReady) {
			// Return placeholder URLs while waiting for DOM
			return titlesList
		}

	const webflowTexts: {imageNum: number, title: string}[] = [{ imageNum: 0, title: 'FLOWING' },]

		for (let i = 1; i <= carouselCount; i++) {
			const element = document.querySelector(`[data-flow-ribbon-text-nr="${i}"]`)
			// console.log('element', element)
			if (element) {
				let imageTexts = ''

				const imgElement = element as HTMLImageElement
				imageTexts =  imgElement.textContent ? imgElement.textContent.trim() : imgElement.innerText
				const item = {imageNum: i, title: imageTexts}

				webflowTexts.push(item)
			}
		}
		if (webflowTexts.length > 0) {
			return webflowTexts
		} else {
			return  titlesList
		}
	}, [domReady])

	return { imageTexts }
}




export function useMomentum() {
	const momentum = useRef(0)
	const wasAtCarousel = useRef(false)
	return { momentum, wasAtCarousel }
}

export function useFrenetDataTexture(
	curve: THREE.CatmullRomCurve3,
	cPoints: Vector3[],
	numPoints: number
): THREE.DataTexture {
	return useMemo(() => {
		// compute Frenet frames once
		const { binormals, normals, tangents } = curve.computeFrenetFrames(numPoints, false)

		// pack into a flat array
		const data: number[] = []
		cPoints.forEach(v => data.push(v.x, v.y, v.z))
		binormals.forEach(v => data.push(v.x, v.y, v.z))
		normals.forEach(v => data.push(v.x, v.y, v.z))
		tangents.forEach(v => data.push(v.x, v.y, v.z))

		// build the DataTexture
		const tex = new THREE.DataTexture(
			new Float32Array(data),
			numPoints + 1,
			4,
			THREE.RGBFormat,
			THREE.FloatType
		)
		tex.internalFormat = 'RGB32F'
		tex.magFilter = THREE.NearestFilter
		tex.minFilter = THREE.NearestFilter
		tex.generateMipmaps = false
		tex.needsUpdate = true
		return tex
	}, [curve, cPoints, numPoints])
}

