export default {
	view: {
		application: {
			width: 1600,
			height: 900,
			backgroundColor: 0x123456
		},
		embed: 'game_container'
	},

	model: {
		width: 10,
		height: 10,
		colors: ['red', 'green', 'blue', 'purple', 'yellow'],
		statuses: { alive: Symbol('status_alive'), dead: Symbol('status_dead') }
	},

	assets: { // Можно вынести в отдельный манифест
		path: 'assets/',
		list: [
			'github.png',
			'playfield_line.png',
			'playfield_red.png',
			'playfield_green.png',
			'playfield_blue.png',
			'playfield_purple.png',
			'playfield_yellow.png'
		]
	}
};