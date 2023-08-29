import { GameEngine } from './core/game-engine';

export class Main {
	public start(): void {
		const gameEngine = new GameEngine();
		gameEngine.start();
	}
}
