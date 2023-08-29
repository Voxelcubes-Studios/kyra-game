import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { Scene } from '@babylonjs/core/scene';
import { SceneUtil } from '../utils/scene.util';

export class SpawnPoint {
	private static NUM_OF_MESH = 3;
	private static MESH_NAME = 'spawn';
	private meshes: Array<any> = [];

	public start(scene: Scene): void {
		// get meshes
		this.meshes = SceneUtil.getMeshesByName(
			scene,
			SpawnPoint.MESH_NAME,
			SpawnPoint.NUM_OF_MESH
		);

		if (this.meshes.length > 0) {
			this.meshes.forEach((mesh: Mesh) => {
				if (mesh) {
					mesh.isVisible = false;
					// mesh.visibility = 0.3;
					mesh.isPickable = false;
					mesh.showBoundingBox = false;
				}
			});
		}
	}
}
