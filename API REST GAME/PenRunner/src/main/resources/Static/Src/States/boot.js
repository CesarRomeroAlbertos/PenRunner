
var PenRunner = {}

PenRunner.bootState = function(game) {

}

PenRunner.bootState.prototype =
{
	preload: function()
	{

	},
	create: function()
	{
		//en boot lo único que hacemos es activar las físicas
		game.physics.startSystem(Phaser.Physics.ARCADE);
		game.physics.startSystem(Phaser.Physics.P2JS);

		game.stage.disableVisibilityChange = true;
		
			
	},
	update: function(){
		game.state.start('preloadStart');
	}
}
