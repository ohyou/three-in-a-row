import 'babel-polyfill';
import {expect} from 'chai';
import config from "../lib/config.js";
import {GameModel} from '../lib/model/game.js';

describe('GameModel', function() {
	var game_model = new GameModel(config.model);
	describe('config', function() {
		it('should save config passed to it on creation', function() {
			expect(game_model.config).to.be.deep.equal(config.model);
		});
	});
});