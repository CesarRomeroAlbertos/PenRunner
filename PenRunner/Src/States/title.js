PenRunner.titleState = function(game) {

}

PenRunner.titleState.prototype =
{
	create: function()
	{
		game.stage.backgroundColor = "#FFFFFF";
		s = game.add.image(0,40,'title')
		var text = "CLICK TO START";
		var style = { font: "32px Lucida Console", fill: "#000000", align: "center", fontWeight:"bold"};
		

		var t = game.add.text(game.world.centerX-128, game.world.centerY+220, text, style);

		//t.stroke = '#000000';
		//t.strokeThickness = 1;
		
		game.input.mouse.capture = true;
	},
	update: function()
	{
		if(game.input.activePointer.leftButton.isDown)
			game.state.start('preloadMenuState');

	}
}