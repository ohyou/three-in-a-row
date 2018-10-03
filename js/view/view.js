import "pixi.js";
import {Scene} from './scene.js';

export class View extends PIXI.Application {
	constructor(config, assets) {
		super(config.view.application);

		this.scene = new Scene(config);
		this.stage.addChild(this.scene);
		this.container = document.querySelector(`#${config.view.embed}`);

		this.loader.onComplete.add(() => {
			this.container.appendChild(this.view);
			this.scene.initialize(this.loader.resources);
		});
		this.loadAssets(assets);
	}

	loadAssets(assets) {
		for (let i in assets.list) {
			this.loader.add(assets.path + assets.list[i]);
		}
		this.loader.load();
	}

	sceneUpdate(type, state) {
		console.log('scene update', type, state);
		this.scene.updateState(type, state);
	}
}