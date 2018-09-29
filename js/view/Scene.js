import 'pixi.js';
import {getTexture} from '../util.js';
import {Playfield} from './playfield.js';

export class Scene extends PIXI.Container {
	constructor(config) {
		super();

		this.config = config;
	}

	initialize(resources) {
		this.resources = resources;

		this.github_link = new PIXI.Sprite(getTexture(this.resources, 'github.png'));
		this.github_link.interactive = true;
		this.github_link.on('click', () => { let w = window.open('https://github.com/ohyou/three-in-a-row', '_blank'); w.focus(); })
		this.addChild(this.github_link);

		this.playfield = new Playfield(resources);
		this.playfield.position.set(
			(this.config.width / 2) - (this.playfield.width / 2), 
			(this.config.height / 2) - (this.playfield.height / 2)
		);
		this.addChild(this.playfield);
		console.log(this.resources);
	}
}