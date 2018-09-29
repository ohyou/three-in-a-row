import {generateColor, shiftLeft, shiftRight} from '../util.js';
const EventEmitter = require('events');

class Cell { // data structure
	constructor(color, status) {
		this.color = color;
		this.status = status;
	}
}

export class Playfield extends EventEmitter {
	constructor(width, height, colors, statuses) {
		super();

		this.game_width = width;
		this.game_height = height;
		this.game_colors = colors;
		this.game_statuses = statuses;

		this.cells = [];
		for (let i = 0; i < (width * height); ++i) {
			this.cells.push(new Cell(generateColor(colors), statuses.alive));
		}

		this.debug();
	}

	isWinningRow(row) {
		let last_status = cell[0].status;
		for (const cell of row) {
			if (last_status !== cell.status) return false;
			last_status = cell.status;
		}
		return true;
	}

	killRow(row) {
		for (const cell of row) {
			cell.status = this.game_statuses.dead;
		}
	}

	killWinners() {
		// Rows
		for (let i = 0; i < this.game_height; ++i) {
			let row = this.getRow(i);
			if (this.isWinningRow(row)) {
				this.killRow(row);
			}
		}

		// Columns
		for (let i = 0; i < this.game_width; ++i) {
			let column = this.getColumn(i);
			if (this.isWinningRow(column)) {
				this.killRow(column);
			}
		}
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