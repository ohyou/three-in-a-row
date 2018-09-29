import 'pixi.js';
import {getTexture} from '../util.js';

export class Playfield extends PIXI.Container {
	constructor(resources) {
		super();

		this.resources = resources;
		this.compileGrid();
	}

	compileGrid() {
		this.grid = new PIXI.Container();
		let line = getTexture(this.resources, 'playfield_line.png');

		let sprite = new PIXI.Sprite(line); // left
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // top
		sprite.rotation = Math.PI / -2;
		sprite.y = sprite.width;
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // right
		sprite.x = sprite.height;
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // bottom
		sprite.y = sprite.height;
		sprite.rotation = Math.PI / -2;
		this.grid.addChild(sprite);

		this.addChild(this.grid);
	}
}