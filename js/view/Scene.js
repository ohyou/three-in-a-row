import 'pixi.js';
import {getTexture} from '../util.js';

export class Scene extends PIXI.Container {
	constructor() {
		super();
	}

	initialize(resources) {
		this.resources = resources;
		this.addChild(new PIXI.Sprite(getTexture(this.resources, 'github.png')))
	}
}