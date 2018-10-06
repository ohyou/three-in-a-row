import 'pixi.js';
import {getTexture} from '../util.js';
import {TweenLite} from 'gsap/TweenLite';
import {TimelineLite} from 'gsap/TimelineLite';

const DIRECTION = {
	LEFT: Symbol('dragging_left'),
	UP: Symbol('dragging_up'),
	RIGHT: Symbol('dragging_right'),
	DOWN: Symbol('dragging_down'),
	NONE: Symbol('dragging_false')
}

class Cell extends PIXI.Container {
	constructor(resources, color) {
		super();

		this.resources = resources;

		this.facade = new PIXI.Sprite(PIXI.Texture.EMPTY);
		this.addChild(this.facade);
		this.setColor('red'); // default

		this.neighbors = {
			left: null,
			up: null,
			right: null,
			down: null
		};

		this.interactive = true;
		this.animation = new TimelineLite();
		this.dragging = false;
		this.dragging_locked = false;
		this.dragging_direction = DIRECTION.NONE;
		this.dragging_distance = new PIXI.Point(0, 0);
		this.on("mousedown", this.dragStart.bind(this));
		this.on("mouseup", this.dragStop.bind(this));
		this.on("mouseupoutside", this.dragStop.bind(this));
		this.on("mousemove", this.drag.bind(this));
	}

	setColor(color) {
		this.facade.texture = getTexture(this.resources, `playfield_${color}.png`);
	}

	getNeighbor(direction) {
		switch(direction) {
			case DIRECTION.LEFT: return this.neighbors.left;
			case DIRECTION.UP: return this.neighbors.up;
			case DIRECTION.RIGHT: return this.neighbors.right;
			case DIRECTION.DOWN: return this.neighbors.down;
			default: return null;
		}
	}

	animateSwap(destination) {
		this.dragging_locked = true;
		this.animation.to(this, 0.35, Object.assign({}, destination, {onComplete: this.swapFinish.bind(this)}), 'swap');
	}

	swapWith(direction) {
		this.dragStop();
		let neighbor = this.getNeighbor(direction);
		let destinations = {};
		if (direction === DIRECTION.LEFT || direction === DIRECTION.RIGHT) {
			// workaround for x/y
			destinations.self = {x: neighbor.x};
			destinations.neighbor = {x: this.x};
		} else if (direction === DIRECTION.UP || direction === DIRECTION.DOWN) {
			destinations.self = {y: neighbor.y};
			destinations.neighbor = {y: this.y};
		}

		this.animateSwap(destinations.self);
		neighbor.animateSwap(destinations.neighbor);
	}

	swapFinish() {
		this.dragging_locked = false;
		this.emit("swapped");
	}

	dragStart(e) {
		this.dragging = true;
	}

	dragStop() {
		this.dragging = false;
		this.dragging_direction = DIRECTION.NONE;
	}

	drag(e) {
		if (this.dragging && !this.dragging_locked) {
			let movement = {
				x: e.data.originalEvent.movementX,
				y: e.data.originalEvent.movementY
			}

			if (this.dragging_direction === DIRECTION.NONE) {
				if (Math.abs(movement.x) >= Math.abs(movement.y)) {
					this.dragging_direction = movement.x >= 0 ? DIRECTION.RIGHT : DIRECTION.LEFT;
				} else {
					this.dragging_direction = movement.y >= 0 ? DIRECTION.DOWN : DIRECTION.UP;
				}
				
			}

			this.swapWith(this.dragging_direction);
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

		this.grid.cells = [];
		for (let i = 0; i < this.grid_width * this.grid_height; ++i) {
			let cell = new Cell(this.resources, 'red');
			cell.position.set(
				(i % this.grid_height) * cell.width + thickness,
				Math.floor(i / this.grid_width) * cell.height + thickness);
			cell.on("swapped", this.cellSwapped.bind(this));
			this.grid.cells.push(cell);
			this.grid.addChild(cell);
		}

		// Assigning neighbors
		for (let i = 0; i < this.grid.cells.length; ++i) {
			let cell = this.grid.cells[i];
			let column = i % this.grid_width;
			let row = Math.floor(i / this.grid_height);
			cell.neighbors.left = column > 0 ? this.grid.cells[i - 1] : null;
			cell.neighbors.right = column < (this.grid_width - 1) ? this.grid.cells[i + 1] : null;
			cell.neighbors.up = row > 0 ? this.grid.cells[i - this.grid_width] : null;
			cell.neighbors.down = row < (this.grid_height - 1) ? this.grid.cells[i + this.grid_width] : null;
		}

		this.mask = new PIXI.Graphics();

		this.mask.beginFill(0xffffff);
		this.mask.drawRect(0, 0, this.width, this.height);
		this.mask.endFill();

		this.addChild(this.mask);
	}

	spawn(color, index) {
		this.grid.cells[index].setColor(color);
	}

	cellSwapped() {
		this.emit('turn');
	}

	updateItems(new_items) {
		for (let i = 0; i < new_items.length; ++i) {
			this.spawn(new_items[i].color, i);
		}
	}
}