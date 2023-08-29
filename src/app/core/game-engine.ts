import { OimoJSPlugin } from '@babylonjs/core';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { Color4, Vector3 } from '@babylonjs/core/Maths/math';

import { GameEnum } from '../enum/game.enum';
import { Level1 } from '../levels/level1/level1';
import { PlayerController } from '../controllers/player.controller';
import { CylinderCollider } from '../colliders/cylinder.collider';
import { BoxCollider } from '../colliders/box.collider';
import { SpawnPoint } from '../colliders/spawn.pont';
import { SkyBoxEnvironment } from '../environments/skybox.environment';
import { GrassMesh } from '../meshes/grass.mesh';
import * as OIMO from 'oimo';
import { GemMesh } from '../meshes/gem.mesh';

export class GameEngine {
	public engine: any;
	public canvas: any;
	public scene: any;
	public rollingAverage: any;
	public camera: any;

	private level1 = new Level1();
	private playerController = new PlayerController();
	private cylinderCollider = new CylinderCollider();
	private boxCollider = new BoxCollider();
	private spawnPoint = new SpawnPoint();
	private skyboxEnvironment = new SkyBoxEnvironment();
	private grassMesh = new GrassMesh();
	private gemMesh = new GemMesh();

	protected resizeCanvas(): void {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
	}

	protected resizeEngine(): void {
		this.resizeCanvas();
		this.engine.resize();
	}

	protected createScene(): void {
		this.canvas = document.getElementById(GameEnum.GAME_CANVAS_NAME) as HTMLCanvasElement;
		this.resizeCanvas();

		this.engine = new Engine(this.canvas, true, {
			preserveDrawingBuffer: true,
			stencil: true,
		});

		this.engine.hideLoadingUI();

		this.scene = new Scene(this.engine);
		this.scene.clearColor = Color4.FromHexString('#e2e2e2');

		// OIMO Physics Engine
		const physEngine = new OimoJSPlugin(true, 10, OIMO);
		this.scene.enablePhysics(new Vector3(0, GameEnum.GRAVITY, 0), physEngine);
		this.scene.getPhysicsEngine().setTimeStep(60.0 / 1000.0);

		// Load Level
		this.level1.start(this.scene, () => {
			// Grasses
			this.grassMesh.start(this.scene);

			// Skybox
			this.skyboxEnvironment.start(this.scene);

			// Colliders
			this.cylinderCollider.start(this.scene);
			this.boxCollider.start(this.scene);

			// Spawn Point
			this.spawnPoint.start(this.scene);

			// Load player
			this.playerController.start(this.scene, this.level1.camera, () => {
				this.level1.addMeshesToLight([
					this.playerController.playerRoot,
					...this.grassMesh.grasses,
				]);

				// Start GemMesh class here because player
				// would have been fully loaded
				this.gemMesh.start(this.scene, this.playerController.playerBox);
			});
		});

		this.scene.registerBeforeRender(() => {
			// Alternatively, you can use this to animate you models
		});
	}

	protected renderLoop(): void {
		if (this.scene) {
			this.level1.update(this.engine.getDeltaTime());
			this.playerController.update(this.engine.getDeltaTime());
			this.gemMesh.update();
			this.scene.render();
		}
	}

	protected startRenderLoop(): void {
		this.engine.runRenderLoop(this.renderLoop.bind(this));
	}

	protected stopRenderLoop(): void {
		this.engine.stopRenderLoop();
	}

	protected update(): void {
		this.startRenderLoop();
		window.addEventListener('resize', this.resizeEngine.bind(this));
	}

	public start(): void {
		this.createScene();
		this.update();
	}

	public destroy(): void {
		window.removeEventListener('resize', this.resizeEngine.bind(this));
		if (this.engine) {
			this.engine.dispose();
		}
	}
}
