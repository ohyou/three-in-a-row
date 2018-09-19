//import * as EventEmitter from 'events';
const EventEmitter = require('events');

export class GameModel extends EventEmitter {
	constructor(config) {
		super();

		this.config = config;
	}
}