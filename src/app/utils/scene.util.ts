import { Scene } from '@babylonjs/core/scene';

export class SceneUtil {
	public static getMeshesByName(scene: Scene, meshName: string, numOfMesh: number): Array<any> {
		const meshes: Array<any> = [];

		for (let i = 0; i < numOfMesh; i++) {
			const name = `${meshName}${i + 1}`;
			const mesh = scene.getMeshByName(name);

			if (mesh) {
				meshes.push(mesh);
			}
		}
		return meshes;
	}
}
