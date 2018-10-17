
var PenRunner = {}

PenRunner.bootState = function(game) {

}

PenRunner.bootState.prototype =
{
	create: function()
	{
		//en boot lo único que hacemos es activar las físicas
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.startSystem(Phaser.Physics.P2JS);
		//llamamos a la escena preload
			
	},
	update: function(){
		game.state.start('preloadState');
	}
}
