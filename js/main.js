import config from "./config.js";
import {GameModel} from "./model/game.js";
import {View} from "./view/view.js";

class Game {
	constructor() {
		this.model = new GameModel(config.model);
		this.view = new View(config, config.assets);

		this.model.on('game_started', () => this.view.sceneUpdate('start'));
		this.model.on('game_updated', (state) => this.view.sceneUpdate('turn', state));
		this.model.on('game_ended', () => this.view.sceneUpdate('end'));

		this.view.scene.on('turn', () => this.model.gameUpdate());
		this.view.loader.onComplete.add(() => this.model.gameStart());
	}
}

new Game(); // TODO?