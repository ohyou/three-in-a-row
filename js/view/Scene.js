import 'pixi.js';
import {getTexture} from '../util.js';
import {Playfield} from './playfield.js';

export class Scene extends PIXI.Container {
	constructor(config) {
		super();

		this.config = config;
		this.scene_width = this.config.view.application.width;
		this.scene_height = this.config.view.application.height;
		this.playfield = new Playfield(this.config.model.width, this.config.model.height);
	}

	initialize(resources) {
		this.resources = resources;

		this.github_link = new PIXI.Sprite(getTexture(this.resources, 'github.png'));
		this.github_link.interactive = true;
		this.github_link.on('click', () => { let w = window.open('https://github.com/ohyou/three-in-a-row', '_blank'); w.focus(); })
		this.addChild(this.github_link);

		this.playfield.initialize(resources);
		this.playfield.position.set(
			(this.scene_width / 2) - (this.playfield.width / 2), 
			(this.scene_height / 2) - (this.playfield.height / 2)
		);
		this.addChild(this.playfield);
		console.log(this.resources);
	}

	updateState(type, state) {
		console.log("aaaaa", state);
		if (type === 'turn') { // TODO: globals?
			this.playfield.updateItems(state.playfield);
		}
	}
}