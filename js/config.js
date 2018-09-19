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
		colors: ['red', 'green', 'blue', 'purple', 'yellow']
	},

	assets: { // Можно вынести в отдельный манифест
		path: 'assets/',
		list: {
			logo: 'github.png'
		}
	}
};