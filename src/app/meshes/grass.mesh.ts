import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';
import { PBRCustomMaterial } from '@babylonjs/materials';
import { SceneUtil } from '../utils/scene.util';

export class GrassMesh {
	private static NUM_OF_MESH = 1277;
	private static MESH_NAME = 'grass';

	private scene: any;
	public grasses: Array<any> = [];
	public customMaterial: any;

	// shader properties
	public waveTime = 0;
	public waveSpeed = 0.02;
	public waveHeight = 0.07;
	public waveFrequency = 2.0;

	protected setupShader(mesh: Mesh): void {
		// Add customMaterial
		const originalMaterial = mesh.material;
		this.customMaterial = new PBRCustomMaterial(`grassWindShaderMat_${mesh.id}`, this.scene);
		mesh.material = this.customMaterial;

		// Copy properties from original material
		for (const key in originalMaterial) {
			if (Object.prototype.hasOwnProperty.call(originalMaterial, key)) {
				this.customMaterial[key] = originalMaterial[key];
			}
		}

		// Uniform (Shader)
		this.customMaterial.AddUniform('waveTime', 'float');
		this.customMaterial.AddUniform('waveSpeed', 'float');
		this.customMaterial.AddUniform('waveHeight', 'float');
		this.customMaterial.AddUniform('waveFrequency', 'float');

		this.customMaterial.onBindObservable.add(() => {
			this.waveTime++;
			if (
				this.customMaterial &&
				this.customMaterial.getEffect &&
				this.customMaterial.getEffect()
			) {
				this.customMaterial.getEffect().setFloat('waveTime', this.waveTime);
				this.customMaterial.getEffect().setFloat('waveSpeed', this.waveSpeed);
				this.customMaterial.getEffect().setFloat('waveHeight', this.waveHeight);
				this.customMaterial.getEffect().setFloat('waveFrequency', this.waveFrequency);
			}
		});

		this.customMaterial.Vertex_Definitions(
			'\
            vec3 wave(){\
                return vec3(sin(waveTime * waveSpeed) * waveHeight * (position.y));\
            }\
            '
		);

		this.customMaterial.Vertex_Before_PositionUpdated(
			'\
            result += vec3(wave());\
            '
		);
	}

	public start(scene: Scene): void {
		this.scene = scene;

		// get meshes
		this.grasses = SceneUtil.getMeshesByName(scene, GrassMesh.MESH_NAME, GrassMesh.NUM_OF_MESH);

		if (this.grasses.length > 0) {
			for (let i = 0; i < this.grasses.length; i++) {
				const mesh = this.grasses[i];

				if (mesh) {
					if (!mesh.isAnInstance) {
						// shadow
						mesh.castShadows = true;
						mesh.receiveShadows = true;
						this.setupShader(mesh);
					}
				}
			}
		}
	}
}
