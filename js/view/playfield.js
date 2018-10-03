import 'pixi.js';
import {getTexture} from '../util.js';
import {TweenLite} from 'gsap/TweenLite';

const DIRECTION = {
	HORIZONTAL: Symbol('dragging_up'),
	VERTICAL: Symbol('dragging_down'),
	NONE: Symbol('dragging_false')
}

class Column extends PIXI.Container {
	constructor(resources, max_height) {
		super();

		this.resources = resources;
		this.items = [];
		this.max_height = max_height;

		this.interactive = true;
		this.dragging = false;
		this.dragging_direction = DIRECTION.NONE;
		this.dragging_data = new PIXI.Point(0, 0);
		this.on("mousedown", this.dragStart.bind(this));
		this.on("mouseup", this.dragStop.bind(this));
		this.on("mouseupoutside", this.dragStop.bind(this));
		this.on("mousemove", this.drag.bind(this));
	}

	setOffset(x, y) {
		this.offset = new PIXI.Point(x, y);
		this.position.set(x, y);
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

	dragStart(e) {
		this.dragging = true;
		this.dragging_data = e.data;
	}

	dragStop() {
		this.dragging = false;
		this.dragging_data = new PIXI.Point(0, 0);
		this.dragging_direction = DIRECTION.NONE;
		this.toClosestRow();
	}

	drag(e) {
		if (this.dragging) {
			switch(this.dragging_direction) {
				case DIRECTION.NONE:
					this.dragging_direction = (e.data.originalEvent.movementX > e.data.originalEvent.movementY) ? DIRECTION.NONE : DIRECTION.VERTICAL;
				case DIRECTION.VERTICAL:
					this.y += e.data.originalEvent.movementY;
					break;
			}
		}
	}

	toClosestRow() {
		let item_height = this.height / this.items.length;
		let offset = Math.round(this.y / item_height) * item_height;
		TweenLite.to(this, 0.16, {y: offset + this.offset.y});
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
		sprite.x = thickness;
		sprite.y = thickness;
		sprite.rotation = Math.PI / -2;
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // right
		sprite.x = sprite.height + thickness;
		this.grid.addChild(sprite);

		sprite = new PIXI.Sprite(line); // bottom
		sprite.y = sprite.height + thickness * 2; // TODO: fix design
		sprite.rotation = Math.PI / -2;
		this.grid.addChild(sprite);

		this.addChild(this.grid);

		this.grid.columns = [];
		for (let i = 0; i < this.grid_width; ++i) {
			let column = new Column(this.resources, this.grid.height - thickness * 2);
			column.setOffset(
				thickness + i * ((this.grid.width - thickness * 2) / this.grid_width),
				thickness
			);
			this.grid.columns.push(column);
			this.grid.addChild(column);
		}

		this.mask = new PIXI.Graphics();

		this.mask.beginFill(0xffffff);
		this.mask.drawRect(0, 0, this.width, this.height);
		this.mask.endFill();

		this.addChild(this.mask);
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
			this.spawn(new_items[i].color, i % this.grid_width);
		}
	}
}