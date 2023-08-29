export class GameEnum {
	public static GRAVITY = -9.81;
	public static GLOW_INTENSITY = 0.7;
	public static GAME_CANVAS_NAME = 'renderCanvas';
	public static LOADING_SCREEN = 'loadingScreen';
	public static LOADING_SCREEN_TEXT = 'loadingScreenText';

	public static GEM_COUNTER_TEXT = 'gemCounterText';
	public static GEM_COUNTER_ELEM_ID = 'gemCounterElemId';
	public static CONTROLS_ELEM_ID = 'controlsElemId';

	public static GRAVITY_TIME_STEP = 0.004;
	public static ROTATE_SPEED = 0.001;
	public static MAIN_LIGHT = 'MainLight';

	public static LEVEL_BASE_PATH = 'assets/levels/';
	public static PLAYER_BASE_PATH = 'assets/glb/';

	public static LEVEL_FILENAME = 'kyra_level.babylon';
	public static PLAYER_FILENAME = 'kyra.glb';

	public static SKYBOX_TEXTURE = 'assets/levels/skybox';

	public static PLAYER_SCALE = 0.35;
	public static PLAYER_BOX_NAME = 'player_box';
	public static PLAYER_BOX_SIZE = {
		height: 1.65,
		width: 0.2,
		depth: 0.08,
	};

	public static PLAYER_MASS = 1;
	public static PLAYER_FRICTION = 0.1;
	public static PLAYER_RESTITUTION = 0.001;

	// Collider
	public static COLLIDER_STATIC_MESH_MASS = 0;
	public static COLLIDER_STATIC_MESH_FRICTION = 0.1;
	public static COLLIDER_STATIC_MESH_RESTITUTION = 0.1;

	// Gem
	public static GEM_BASE_PATH = 'assets/glb/';
	public static GEM_FILENAME = 'gem.glb';
}
