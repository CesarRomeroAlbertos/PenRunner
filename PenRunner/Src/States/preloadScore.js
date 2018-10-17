PenRunner.preloadScoreState = function(game) {

}

PenRunner.preloadScoreState.prototype =
{
	preload:function()
	{
        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

    	var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
	},
	update: function()
	{

		game.state.start('scoreState');

	}
}