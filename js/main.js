import config from "./config.js";
import {GameModel} from "./model/game.js";
import {View} from "./view/view.js";

class Game {
	constructor() {
		this.model = new GameModel(config.model);
		this.view = new View(config.view, config.assets);
	}
}

new Game();