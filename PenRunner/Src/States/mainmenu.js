PenRunner.menuState = function(game) {

}

PenRunner.menuState.prototype =
{
	create: function(){},
	update:function()
	{

		game.state.start('preloadMatchmakingState');

	}
}