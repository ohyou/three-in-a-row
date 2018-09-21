import {generateColor, shiftLeft, shiftRight} from '../util.js';
//import * as EventEmitter from 'events';
const EventEmitter = require('events');

class Cell { // data structure
	constructor(color) {
		this.color = color;
	}
}

export class Playfield extends EventEmitter {
	constructor(width, height, colors) {
		super();

		this.game_width = width;
		this.game_height = height;
		this.game_colors = colors;

		this.cells = [];
		for (let i = 0; i < (width * height); ++i) {
			this.cells.push(new Cell(generateColor(colors)));
		}

		this.moveColumnDown(2, 2);
	}

	getRow(num) { // autotest
		return this.cells.slice(this.game_width * num, (this.game_width * num) + this.game_width);
	}

	getColumn(num) { // autotest
		let column = [];
		for (let i = 0; i < this.cells.length; ++i) {
			if ((i % this.game_width) == num) {
				column.push(this.cells[i]);
			}
		}
		return column;
	}

	replaceRow(num, row) { // autotest
		this.cells.splice(this.game_width * num, this.game_width, ...row);
	}

	replaceColumn(num, column) { // autotest
		for (let i = 0; i < this.cells.length; ++i) {
			if ((i % this.game_width) == num) {
				this.cells[i] = column[Math.floor(i / this.game_width)];
			}
		}
	}

	debug() {
		let debug = '';
		for (let i = 0; i < (this.game_width * this.game_height); ++i) {
			debug += this.cells[i].color[0] + ' ' + ((i+1) % this.game_width == 0 ? '\n' : '');
		}

		console.log(debug);
	}

	moveRowLeft(num, times = 1) { // autotest
		for (let i = 0; i < times % this.game_width; ++i) {
			this.replaceRow(num, shiftLeft(this.getRow(num)));
		}
		this.emit('update');
	}

	moveRowRight(num, times = 1) { // autotest
		for (let i = 0; i < times % this.game_width; ++i) {
			this.replaceRow(num, shiftRight(this.getRow(num)));
		}
		this.emit('update');
	}

	moveColumnUp(num, times = 1) { // autotest
		for (let i = 0; i < times % this.game_height; ++i) {
			this.replaceColumn(num, shiftLeft(this.getColumn(num)));
		}
		this.emit('update');
	}
	moveColumnDown(num, times = 1) { // autotest
		for (let i = 0; i < times % this.game_height; ++i) {
			this.replaceColumn(num, shiftRight(this.getColumn(num)));
		}
		this.emit('update');
	}
}