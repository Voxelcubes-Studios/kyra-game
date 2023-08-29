import { Mesh } from '@babylonjs/core/Meshes/mesh';
import { PhysicsImpostor } from '@babylonjs/core/Physics/v1/physicsImpostor';
import { Scene } from '@babylonjs/core/scene';
import { GameEnum } from '../enum/game.enum';
import { SceneUtil } from '../utils/scene.util';

export class CylinderCollider {
	private static NUM_OF_MESH = 4;
	private static MESH_NAME = 'colliderc';
	private colliders: Array<any> = [];

	public start(scene: Scene): void {
		// get meshes
		this.colliders = SceneUtil.getMeshesByName(
			scene,
			CylinderCollider.MESH_NAME,
			CylinderCollider.NUM_OF_MESH
		);

		if (this.colliders.length > 0) {
			this.colliders.forEach((mesh: Mesh) => {
				if (mesh) {
					mesh.isVisible = false;
					// mesh.visibility = 0.3;
					mesh.isPickable = false;
					mesh.showBoundingBox = false;

					// Enable Physics
					mesh.physicsImpostor = new PhysicsImpostor(
						mesh,
						PhysicsImpostor.CylinderImpostor,
						{
							mass: GameEnum.COLLIDER_STATIC_MESH_MASS,
							friction: GameEnum.COLLIDER_STATIC_MESH_FRICTION,
							restitution: GameEnum.COLLIDER_STATIC_MESH_RESTITUTION,
						},
						scene
					);
				}
			});
		}
	}
}
