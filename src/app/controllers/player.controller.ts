import { MeshBuilder, SceneLoader, Tools, Sound } from '@babylonjs/core';
import { GameEnum } from '../enum/game.enum';
import { Axis, Quaternion, Vector3 } from '@babylonjs/core/Maths/math';
import { Scene } from '@babylonjs/core/scene';
import { PhysicsImpostor } from '@babylonjs/core/Physics/v1/physicsImpostor';
import { KeyboardEventTypes } from '@babylonjs/core/Events/keyboardEvents';
import { Mesh } from '@babylonjs/core/Meshes/mesh';

// Preload Files
import runSoundWav from '../../assets/sounds/run.wav';

export class PlayerController {
	private static ANGLE_ADJUSTMENT = 90;
	private static RUN_SPEED = 0.15;

	private static MOVE_UP_KEY = 'w';
	private static MOVE_DOWN_KEY = 's';
	private static MOVE_LEFT_KEY = 'a';
	private static MOVE_RIGHT_KEY = 'd';

	private isUpPressed = false;
	private isDownPressed = false;
	private isLeftPressed = false;
	private isRightPressed = false;

	public horizontalMove = 0;
	public verticalMove = 0;

	public horizontal = 0;
	public vertical = 0;
	public angle = 0;
	public inputAngle = 0;
	public isMoving = false;

	private idleAnim: any;
	private runAnim: any;
	private isRunning = false;
	private isRunSoundPlayed = false;

	public playerRoot: any;
	public playerBox: any;
	private scene: any;
	private playerRunSound: any;

	private camera: any;

	// Player Physics setup
	protected addPhysics(player: any, scene: Scene): void {
		const physics = new PhysicsImpostor(
			player,
			PhysicsImpostor.BoxImpostor,
			{
				mass: GameEnum.PLAYER_MASS,
				friction: GameEnum.PLAYER_FRICTION,
				restitution: GameEnum.PLAYER_RESTITUTION,
			},
			scene
		);
		player.physicsImpostor = physics;
	}

	protected initRunSound(): void {
		// Initialise Sound
		this.playerRunSound = new Sound('runSound', runSoundWav, this.scene, null, {
			loop: true,
			autoplay: false,
			volume: 1,
		});
	}

	public start(scene: any, camera: any, callback?: () => void): void {
		this.scene = scene;
		this.camera = camera;

		SceneLoader.ImportMesh(
			'',
			GameEnum.PLAYER_BASE_PATH,
			GameEnum.PLAYER_FILENAME,
			scene,
			(meshes: any, particleSystems: any, skeletons: any) => {
				// Player movement box
				this.playerBox = MeshBuilder.CreateBox(
					GameEnum.PLAYER_BOX_NAME,
					{
						height: 0.85,
						width: 0.2,
						depth: 0.08,
					},
					scene
				);
				this.playerBox.isVisible = false;
				this.playerBox.isPickable = false;

				this.playerRoot = meshes[0];

				// Set playerRoot scale
				this.playerRoot.scaling = new Vector3(
					GameEnum.PLAYER_SCALE,
					GameEnum.PLAYER_SCALE,
					GameEnum.PLAYER_SCALE
				);

				this.playerRoot.parent = this.playerBox;

				// Center player to (playerBox) mesh
				this.playerRoot.setAbsolutePosition(
					new Vector3(
						this.playerRoot.position.x,
						this.playerRoot.position.y - 0.41,
						this.playerRoot.position.z
					)
				);

				const spawnPoint = scene.getMeshByName('spawn1').position;
				this.playerBox.position = new Vector3(
					spawnPoint.x,
					spawnPoint.y + 0.4,
					spawnPoint.z
				);

				// Store player animations
				this.idleAnim = scene.getAnimationGroupByName('Idle');
				this.runAnim = scene.getAnimationGroupByName('Run');

				// Lock camera on the character
				this.camera.lockedTarget = this.playerRoot;

				// Player Keyboard
				this.playerInput();

				// Init sound
				this.initRunSound();

				// Player Physics
				this.addPhysics(this.playerBox, scene);

				if (callback) {
					callback();
				}
			}
		);
	}

	public playerInput(): void {
		this.scene.onKeyboardObservable.add((kbInfo: any) => {
			switch (kbInfo.type) {
				case KeyboardEventTypes.KEYDOWN:
					switch (kbInfo.event.key) {
						case PlayerController.MOVE_UP_KEY:
							this.isUpPressed = true;
							break;
						case PlayerController.MOVE_DOWN_KEY:
							this.isDownPressed = true;
							break;
						case PlayerController.MOVE_LEFT_KEY:
							this.isLeftPressed = true;
							break;
						case PlayerController.MOVE_RIGHT_KEY:
							this.isRightPressed = true;
							break;
					}
					break;

				case KeyboardEventTypes.KEYUP:
					switch (kbInfo.event.key) {
						case PlayerController.MOVE_UP_KEY:
							this.vertical = 0;
							this.isUpPressed = false;
							break;
						case PlayerController.MOVE_DOWN_KEY:
							this.vertical = 0;
							this.isDownPressed = false;
							break;
						case PlayerController.MOVE_LEFT_KEY:
							this.horizontal = 0;
							this.isLeftPressed = false;
							break;
						case PlayerController.MOVE_RIGHT_KEY:
							this.horizontal = 0;
							this.isRightPressed = false;
							break;
					}
					break;
			}
		});
	}

	public movePlayer(): void {
		this.playerBox.physicsImpostor.setLinearVelocity(
			new Vector3(this.horizontalMove, 0, -this.verticalMove)
		);
	}

	public rotatePlayer(): void {
		const rotAngle = -this.inputAngle + PlayerController.ANGLE_ADJUSTMENT;
		const rot = Tools.ToRadians(rotAngle);
		this.playerBox.rotationQuaternion = Quaternion.RotationAxis(Axis.Y, -rot);
	}

	private freezeAngularPos(player: Mesh): void {
		if (player) {
			player.rotationQuaternion.x = 0;
			player.rotationQuaternion.z = 0;

			if (player.physicsImpostor) {
				player.physicsImpostor.setAngularVelocity(new Vector3(0, 0, 0));
			}
		}
	}

	public playRunSound(): void {
		if (!this.isRunSoundPlayed) {
			this.playerRunSound.play();
			this.isRunSoundPlayed = true;
		}
	}

	public stopRunSound(): void {
		if (this.isRunSoundPlayed) {
			this.isRunSoundPlayed = false;
			this.playerRunSound.stop();
		}
	}

	public update(dt: number): void {
		if (this.playerBox) {
			// Freeze player's angular position
			this.freezeAngularPos(this.playerBox);

			if (
				this.isUpPressed ||
				this.isDownPressed ||
				this.isLeftPressed ||
				this.isRightPressed
			) {
				this.isMoving = true;
			} else {
				this.isMoving = false;
			}

			// key presses
			if (this.isUpPressed) {
				this.vertical = -1;
			}
			if (this.isDownPressed) {
				this.vertical = 1;
			}
			if (this.isLeftPressed) {
				this.horizontal = -1;
			}
			if (this.isRightPressed) {
				this.horizontal = 1;
			}

			// Calculate angle
			this.angle = Math.atan2(this.vertical, this.horizontal) / (Math.PI / 180); // Angle

			// move player
			if (this.isMoving) {
				this.inputAngle = this.angle;

				this.horizontalMove = this.horizontal * PlayerController.RUN_SPEED * dt;
				this.verticalMove = this.vertical * PlayerController.RUN_SPEED * dt;

				if (!this.isRunning) {
					this.isRunning = true;
					this.runAnim.start(true, 1.0, this.runAnim.from, this.runAnim.to, false);
				}

				this.playRunSound();

				this.rotatePlayer();
			} else {
				if (this.isRunning) {
					this.runAnim.stop();
					this.idleAnim.start(true, 1.0, this.idleAnim.from, this.idleAnim.to, false);
					this.isRunning = false;
				}

				this.stopRunSound();

				this.horizontalMove = 0;
				this.verticalMove = 0;
			}

			this.movePlayer();
		}
	}
}
