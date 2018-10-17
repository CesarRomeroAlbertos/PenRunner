PenRunner.titleState = function(game) {

}

PenRunner.titleState.prototype =
{
	create: function(){},
	update: function()
	{

		game.state.start('preloadMenuState');

	}
}