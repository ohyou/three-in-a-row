import config from './config.js';

export function getTexture(list, name) {
	return typeof list[config.assets.path + name] !== 'undefined' ? list[config.assets.path + name].texture : PIXI.Texture.EMPTY;
}

export function generateColor(list) {
	return list[Math.floor(Math.random() * list.length)];
}

export function shiftLeft(list) {
	return list = list.concat(list).slice(1, list.length + 1);
}

export function shiftRight(list) {
	return list.concat(list).slice(list.length - 1, list.length - 1 + list.length);
}