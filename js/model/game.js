//import * as EventEmitter from 'events';
const EventEmitter = require('events');
import {Playfield} from './playfield.js';

export class GameModel extends EventEmitter {
	constructor(config) {
		super();

		this.config = config;
		this.score = 0; // TODO
		this.playfield = new Playfield(config.width, config.height, config.colors, config.statuses);
		this.playfield.on('update', this.gameUpdate.bind(this));
	}

	gameStart() {
		console.log('game_started');
		this.emit('game_started');

		this.playfield.emit('update'); // TODO
	}

	gameUpdate() {
		console.log('game_updated');
		this.emit('game_updated', this.getState());
	}

	gameStop() {
		console.log('game_stopped');
		this.emit('game_stopped')
	}

	getState() {
		return {
			playfield: this.playfield.cells.slice(),
			score: this.score
		};
	}
}