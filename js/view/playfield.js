import 'pixi.js';
import {getTexture} from '../util.js';

class Column extends PIXI.Container {
	constructor(resources, max_height) {
		super();

		this.resources = resources;
		this.items = [];
		this.max_height = max_height;
		// this.addChild(new PIXI.Sprite(getTexture(resources, 'playfield_red.png')));
	}

	addItem(color) {
		let new_item = new PIXI.Sprite(getTexture(this.resources, `playfield_${color}.png`))
		this.items.push(new_item);
		this.addChild(new_item);
		this.repositionItems();
	}

	removeItem(index, amount = 1) {
		let removed_items = this.items.splice(index, amount);
		for (const item of removed_items) {
			this.removeChild(item);
		}
		this.repositionItems();
	}

	removeAllItems() {
		this.removeItem(0, this.items.length);
	}

	repositionItems() {
		for (let i = 0; i < this.items.length; ++i) {
			this.items[i].position.set(0, this.max_height - ((i + 1) * this.items[i].height));
		}
	}
}

export class Playfield extends PIXI.Container {
	constructor(width, height) {
		super();
		this.grid_width = width;
		this.grid_height = height;
	}

	initialize(resources) {
		this.resources = resources;
		this.compileGrid();
	}

	compileGrid(width, height) {
		this.grid = new PIXI.Container();
		let line = getTexture(this.resources, 'playfield_line.png');
		let thickness = line.width;

		let sprite = new PIXI.Sprite(line); // left
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // top
		sprite.y = sprite.width;
		sprite.rotation = Math.PI / -2;
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // right
		sprite.x = sprite.height;
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // bottom
		sprite.y = sprite.height;
		sprite.rotation = Math.PI / -2;
		this.grid.addChild(sprite);

		this.addChild(this.grid);

		console.log("grid init");
		this.grid.columns = [];
		for (let i = 0; i < this.grid_width; ++i) {
			let column = new Column(this.resources, this.grid.height - (thickness * 2));
			column.position.set(
				thickness + i * ((this.grid.width - thickness * 2) / this.grid_width),
				thickness
			);
			this.grid.columns.push(column);
			this.grid.addChild(column);
		}
		
		/*this.updateItems([{color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}, {color: 'green'}, {color: 'blue'}, {color: 'red'}]);*/
	}

	spawn(color, column) {
		this.grid.columns[column].addItem(color);
	}

	kill(column, row) {
		this.grid.columns[column].removeItem(row);
	}

	killColumn(column) {
		this.grid.columns[column].removeAllItems();
	}

	killEverything() {
		for (const column of this.grid.columns) {
			column.removeAllItems();
		}
	}

	updateItems(new_items) {
		this.killEverything();
		for (let i = 0; i < new_items.length; ++i) {
			console.log("a", new_items[i].color, i % this.grid_width);
			this.spawn(new_items[i].color, i % this.grid_width);
		}
	}
}