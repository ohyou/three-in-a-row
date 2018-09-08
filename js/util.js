import config from './config.js';

export function getTexture(list, name) {
	return typeof list[config.assets.path + name] !== 'undefined' ? list[config.assets.path + name].texture : PIXI.Texture.EMPTY;
}