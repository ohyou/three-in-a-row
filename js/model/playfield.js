import {generateColor} from '../util.js';
//import * as EventEmitter from 'events';
const EventEmitter = require('events');

class Cell extends EventEmitter {
	constructor(color) {
		super();
	}
}

class Row extends EventEmitter {
	constructor(size) {
		super();
	}
}

class Column extends Row {
	constructor(size) {
		super(size);
	}
}

export class Playfield extends EventEmitter {
	constructor(width, height) {
		super();
	}
}