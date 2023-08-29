import { Axis, SceneLoader, Sound, Space, Vector3 } from '@babylonjs/core';
import { Mesh } from '@babylonjs/core/Meshes/mesh';

import gemSoundWav from '../../assets/sounds/gem.wav';
import { GameEnum } from '../enum/game.enum';

// Preload
import '../../assets/glb/gem.glb';

export class GemMesh {
	private static ROTATE_SPEED = 0.005;

	private gems = [];
	private numOfGems = 20;
	private radius = 3.7;
	private scene: any;
	private player: any;
	private gemSound: any;
	private gemCounter = 0;
	private gemCounterTextElem: any;

	constructor() {
		this.gemCounterTextElem = document.getElementById(GameEnum.GEM_COUNTER_TEXT);
	}

	protected initSound(): void {
		// Initialise Sound
		this.gemSound = new Sound('gemSound', gemSoundWav, this.scene, null, {
			loop: false,
			autoplay: false,
			volume: 1,
		});
	}

	protected updateGemCounter(): void {
		this.gemCounter++;
		this.gemCounterTextElem.innerHTML = `Gems Collected: ${this.gemCounter}`;
	}

	protected createGems(gemMesh: Mesh): void {
		if (gemMesh) {
			for (let i = 0; i < this.numOfGems; i++) {
				const angle = (Math.PI * 2 * i) / this.numOfGems;
				const x = Math.sin(angle) * this.radius;
				const z = Math.cos(angle) * this.radius;

				// create gem instance
				const mewGem = gemMesh.createInstance(`gem${i}`);
				mewGem.position = new Vector3(x, 0.3, z);

				mewGem.scaling = new Vector3(0.5, 0.5, 0.5);
				this.gems.push(mewGem);
			}

			// hide main mesh so player does not collide with it
			gemMesh.position.y = -10;
			gemMesh.isVisible = false;
		}
	}

	protected updateRotation(): void {
		if (this.gems.length > 0) {
			this.gems.forEach((mesh: Mesh) => {
				if (mesh) {
					mesh.rotate(Axis.Y, (Math.PI / 2) * GemMesh.ROTATE_SPEED, Space.WORLD);
				}
			});
		}
	}

	protected checkCollision(): void {
		if (this.gems.length > 0) {
			for (let i = 0; i < this.gems.length; i++) {
				const gem = this.gems[i];

				if (gem) {
					if (this.player.intersectsMesh(gem)) {
						this.gemSound.play();
						this.updateGemCounter();
						gem.dispose();
						this.gems.splice(i, 1);
						break;
					}
				}
			}
		}
	}

	public start(scene: any, player: Mesh, callback?: () => void): void {
		this.player = player;
		this.scene = scene;

		SceneLoader.ImportMesh(
			'',
			GameEnum.GEM_BASE_PATH,
			GameEnum.GEM_FILENAME,
			scene,
			(meshes: any, particleSystems: any, skeletons: any) => {
				this.initSound();

				const mesh = scene.getMeshByName('gem3');
				this.createGems(mesh);

				if (callback) {
					callback();
				}
			}
		);
	}

	public update(): void {
		this.updateRotation();

		if (this.scene) {
			this.checkCollision();
		}
	}
}
