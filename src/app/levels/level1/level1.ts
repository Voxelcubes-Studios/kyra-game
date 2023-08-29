import { GlowLayer, ColorCorrectionPostProcess } from '@babylonjs/core';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { Vector3, Color3, Color4 } from '@babylonjs/core/Maths/math';
import { CubeTexture } from '@babylonjs/core/Materials';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import {
	SceneLoader,
	DefaultRenderingPipeline,
	DepthOfFieldEffectBlurLevel,
	MeshBuilder,
} from '@babylonjs/core';

import '@babylonjs/loaders/glTF'; // Side Effect Only
import '../../../assets/glb/toxic_box1.glb'; // Side Effect Only

import '../../../assets/glb/kyra.glb'; // Side Effect Only
import '../../../assets/levels/kyra_level.babylon'; // Side Effect Only

// Preload BabylonJS Assets
require.context('../../../assets/levels', false, /\.(png|jpe?g)$/);

import pbrenv from '../../../assets/env/environment.env';
import { GameEnum } from '../../enum/game.enum';
import { ShadowGenerator } from '@babylonjs/core/Lights/Shadows/shadowGenerator';
import { Scene } from '@babylonjs/core/scene';
import { Texture } from '@babylonjs/core/Materials/Textures/texture';
import { ParticleSystem } from '@babylonjs/core/Particles/particleSystem';

export class Level1 {
	private shadowGenerator: any;
	public canvas: any;
	public scene: any;
	public mesh: any;

	private loadingScreenElem: any;
	private loadingScreenTextElem: any;
	private gemCounterElem: any;
	private controlsElem: any;

	private fogParticleSystem: any;
	public camera: any;

	constructor() {
		this.canvas = document.getElementById(GameEnum.GAME_CANVAS_NAME);
		this.loadingScreenElem = document.getElementById(GameEnum.LOADING_SCREEN);
		this.loadingScreenTextElem = document.getElementById(GameEnum.LOADING_SCREEN_TEXT);

		this.gemCounterElem = document.getElementById(GameEnum.GEM_COUNTER_ELEM_ID);
		this.controlsElem = document.getElementById(GameEnum.CONTROLS_ELEM_ID);
	}

	private createFogParticles(scene: Scene): void {
		const fogTexture = new Texture('../../../assets/levels/kyra_level_sky_smoke1.png', scene);

		const fogPosBox = MeshBuilder.CreateBox('fogBox', { size: 0.2 }, scene);
		fogPosBox.visibility = 0;
		fogPosBox.position.y = -1.9;

		// get platform in scene
		const platform = scene.getMeshByName('platform');
		fogPosBox.parent = platform;

		if (this.fogParticleSystem) {
			this.fogParticleSystem.dispose();
		}

		this.fogParticleSystem = new ParticleSystem('particles', 2500, scene);
		this.fogParticleSystem.manualEmitCount = this.fogParticleSystem.getCapacity();
		this.fogParticleSystem.minEmitBox = new Vector3(-5, 2, -5);
		this.fogParticleSystem.maxEmitBox = new Vector3(5, 2, 5);

		this.fogParticleSystem.particleTexture = fogTexture.clone();
		this.fogParticleSystem.emitter = fogPosBox;

		this.fogParticleSystem.color1 = new Color4(0.8, 0.8, 0.8, 0.1);
		this.fogParticleSystem.color2 = new Color4(0.95, 0.95, 0.95, 0.15);
		this.fogParticleSystem.colorDead = new Color4(0.9, 0.9, 0.9, 0.1);
		this.fogParticleSystem.minSize = 1.5;
		this.fogParticleSystem.maxSize = 3.0;
		this.fogParticleSystem.minLifeTime = Number.MAX_SAFE_INTEGER;
		this.fogParticleSystem.emitRate = 50000;
		this.fogParticleSystem.blendMode = ParticleSystem.BLENDMODE_STANDARD;
		this.fogParticleSystem.gravity = new Vector3(0, 0, 0);
		this.fogParticleSystem.direction1 = new Vector3(0, 0, 0);
		this.fogParticleSystem.direction2 = new Vector3(0, 0, 0);
		this.fogParticleSystem.minAngularSpeed = -2;
		this.fogParticleSystem.maxAngularSpeed = 2;
		this.fogParticleSystem.minEmitPower = 0.5;
		this.fogParticleSystem.maxEmitPower = 1;
		this.fogParticleSystem.updateSpeed = 0.005;

		this.fogParticleSystem.start();
	}

	private addCamera(scene: any): void {
		this.camera = new ArcRotateCamera(
			'FreeCamera',
			-Math.PI / 2,
			1.2,
			4.0,
			new Vector3(0, 0, 0),
			scene
		);

		this.camera.wheelPrecision = 120;
		this.camera.minZ = 0.1;
		this.camera.panningSensibility = 0;

		scene.activeCamera = this.camera;
		scene.activeCamera.attachControl(this.canvas, true);

		this.camera.inputs.clear();

		// Post Processes Pipeline Setup
		const pipeline = new DefaultRenderingPipeline('CamPostProcess', true, scene, [this.camera]);

		if (pipeline.isSupported) {
			// Exposure
			pipeline.imageProcessing.exposure = 1.2;

			// Bloom
			pipeline.bloomEnabled = true;
			pipeline.bloomThreshold = 0.5;
			pipeline.bloomWeight = 0.5;
			pipeline.bloomKernel = 64;
			pipeline.bloomScale = 0.5;

			// Depth of field
			pipeline.depthOfFieldEnabled = true;
			pipeline.depthOfFieldBlurLevel = DepthOfFieldEffectBlurLevel.Low;

			// Sharpening
			pipeline.sharpenEnabled = true;
			pipeline.sharpen.edgeAmount = 0.5;
			pipeline.sharpen.colorAmount = 1; // Set to 0 to get Edge detection color

			// Vignette
			pipeline.imageProcessingEnabled = true;
			pipeline.imageProcessing.vignetteEnabled = true;
			pipeline.imageProcessing.vignetteWeight = 3;

			// Tone Mapping
			pipeline.imageProcessing.toneMappingEnabled = true;
			// Enable for a different Tone Mapping
			// pipeline.imageProcessing.toneMappingType =
			// 	ImageProcessingConfiguration.TONEMAPPING_ACES;

			// Contrast
			pipeline.imageProcessing.contrast = 1.3;

			/*
			// Color Grading
			pipeline.imageProcessing.colorGradingEnabled = true;
			*/

			/*
			// Grain
			pipeline.grainEnabled = true;
			pipeline.grain.intensity = 10;
			pipeline.grain.animated = true;
			*/

			/*
			// FXAA (Fast Approximate Anti-Aliasing)
			pipeline.fxaaEnabled = true;
			pipeline.fxaa.samples = 1;
			*/
		}

		/*
		// SSAO (Screen Space Ambient Occlusion)
		const ssaoRatio = {
			ssaoRatio: 0.5, // Ratio of the SSAO post-process, in a lower resolution
			combineRatio: 1.0, // Ratio of the combine post-process (combines the SSAO and the scene)
		};

		const ssao = new SSAORenderingPipeline('ssao', scene, ssaoRatio);
		ssao.fallOff = 0.000001;
		ssao.area = 1;
		ssao.radius = 0.0001;
		ssao.totalStrength = 1.0;
		ssao.base = 0.5;

		scene.postProcessRenderPipelineManager.attachCamerasToRenderPipeline('ssao', this.camera);
		*/

		const lutPostProcess = new ColorCorrectionPostProcess(
			'color_correction',
			'../../../assets/levels/lut_color1.png',
			1.0,
			this.camera
		);
	}

	private addLight(scene: any): void {
		// Hemispheric Light
		const light = new HemisphericLight('hemiLight', new Vector3(-1, 1, 0), scene);
		light.diffuse = Color3.FromHexString('#56e5ff');
		light.specular = Color3.FromHexString('#000000');
		light.groundColor = Color3.FromHexString('#4b9334');
		light.intensity = 1;

		// Directional Light
		const dlight = new DirectionalLight(GameEnum.MAIN_LIGHT, new Vector3(-1, -2, -1), scene);
		dlight.position = new Vector3(20, 40, 20);
		dlight.diffuse = Color3.FromHexString('#ffffff');
		dlight.intensity = 4;

		// Shadow Generator
		this.shadowGenerator = new ShadowGenerator(1024, dlight);
		this.shadowGenerator.useExponentialShadowMap = true;
	}

	private addPbrEnvironment(scene: any): void {
		const hdrTexture = CubeTexture.CreateFromPrefilteredData(pbrenv, scene);
		scene.environmentTexture = hdrTexture;
	}

	public addGlowToScene(scene: Scene): void {
		const gl = new GlowLayer('level1Glow', scene);
		gl.intensity = GameEnum.GLOW_INTENSITY;
	}

	public addMeshesToLight(meshes: Array<any>): void {
		if (meshes.length > 0) {
			meshes.forEach((mesh: any) => {
				if (mesh) {
					this.shadowGenerator.addShadowCaster(mesh);
				}
			});
		}
	}

	public start(scene: any, callback?: () => void): void {
		this.scene = scene;

		this.addCamera(scene);
		this.addLight(scene);
		this.addPbrEnvironment(scene);

		SceneLoader.ImportMesh(
			'',
			GameEnum.LEVEL_BASE_PATH,
			GameEnum.LEVEL_FILENAME,
			this.scene,
			(meshes: any, particleSystems: any, skeletons: any) => {
				this.mesh = meshes[0];

				// Glow
				this.addGlowToScene(this.scene);

				// fog
				this.createFogParticles(this.scene);

				if (callback) {
					callback();
				}
			},
			(evt: any) => {
				let loadedPercent = 0;

				if (evt.lengthComputable) {
					loadedPercent = Number(((evt.loaded * 100) / evt.total).toFixed());
				} else {
					const dlCount = evt.loaded / (1024 * 1024);
					loadedPercent = Math.floor(dlCount * 100.0) / 100.0;
				}

				this.loadingScreenTextElem.innerHTML = `Loading Level (${loadedPercent}%)`;

				if (loadedPercent >= 100) {
					// delay loading screen for a bit
					setTimeout(() => {
						// hide loading screen
						this.loadingScreenElem.style.opacity = 0;

						// show all UI
						this.gemCounterElem.style.opacity = '1';
						this.controlsElem.style.opacity = '1';
					}, 2000);
				}
			}
		);
	}

	public update(dt: number): void {
		if (this.mesh) {
			// this.mesh.rotate(Axis.Y, (Math.PI / 2) * GameEnum.ROTATE_SPEED, Space.WORLD);
		}
	}
}
