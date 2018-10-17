PenRunner.preloadMatchmakingState = function(game) {

}

PenRunner.preloadMatchmakingState.prototype =
{
	preload:function()
	{

		//Ponemos un texto para que el jugador vea que está en una pantalla de carga
    	var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
    	game.load.spritesheet('button', 'Assets/button_sprite_sheet.png', 193, 71);
        game.load.image('background','Assets/starfield.jpg');

	},
	update: function()
	{

		game.state.start('matchmakingState');

	}
}
