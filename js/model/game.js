//import * as EventEmitter from 'events';
const EventEmitter = require('events');
import {Playfield} from './playfield.js';

export class GameModel extends EventEmitter {
	constructor(config) {
		super();

		this.config = config;
		this.playfield = new Playfield(config.width, config.height, config.colors, config.statuses);
		this.playfield.on('update', this.gameUpdate.bind(this));
	}

	gameStart() {
		console.log('game_started');
		this.emit('game_started');
	}

	gameUpdate() {
		console.log('game_updated');
		this.emit('game_updated');
	}

	gameStop() {
		console.log('game_stopped');
		this.emit('game_stopped')
	}
}