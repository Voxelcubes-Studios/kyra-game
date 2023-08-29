import { Scene } from '@babylonjs/core/scene';
import { CubeTexture, StandardMaterial, Texture } from '@babylonjs/core/Materials';
import { Color3, MeshBuilder } from '@babylonjs/core';
import { GameEnum } from '../enum/game.enum';

export class SkyBoxEnvironment {
	protected static ROTATION_SPEED = -0.00004;

	protected scene: Scene = null;
	protected floor = null;
	protected skybox = null;
	protected floorMaterial = null;
	protected skyboxMaterial = null;

	public start(scene: Scene, callback?: () => void): void {
		this.scene = scene;

		// Floor
		this.floor = MeshBuilder.CreateGround('skyBoxGround', { width: 1000, height: 1000 }, scene);
		this.floor.position.y = -5;
		this.floorMaterial = new StandardMaterial('skyBoxGroundMat', scene);
		this.floorMaterial.backFaceCulling = true;
		this.floorMaterial.reflectionTexture = new CubeTexture(GameEnum.SKYBOX_TEXTURE, scene);
		this.floorMaterial.reflectionTexture.coordinatesMode = Texture.PLANAR_MODE;
		this.floorMaterial.diffuseColor = new Color3(0, 0, 0);
		this.floorMaterial.specularColor = new Color3(0, 0, 0);
		this.floor.material = this.floorMaterial;

		// Skybox
		this.skybox = MeshBuilder.CreateBox('skyBox', { size: 1000.0 }, scene);
		this.skyboxMaterial = new StandardMaterial('skyBoxMat', scene);
		this.skyboxMaterial.backFaceCulling = false;
		this.skyboxMaterial.reflectionTexture = new CubeTexture(GameEnum.SKYBOX_TEXTURE, scene);
		this.skyboxMaterial.reflectionTexture.coordinatesMode = Texture.SKYBOX_MODE;
		this.skyboxMaterial.diffuseColor = new Color3(0, 0, 0);
		this.skyboxMaterial.specularColor = new Color3(0, 0, 0);
		this.skybox.material = this.skyboxMaterial;

		if (callback) {
			callback();
		}
	}
}
