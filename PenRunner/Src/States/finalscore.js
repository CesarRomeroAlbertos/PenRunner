PenRunner.scoreState = function(game) {

}

var background;
var buttonReturn;
var jugador1, jugador2, jugador3, jugador4, jugador5, jugador6;
var text = 'Puntuación Final';
var style4 =  { font: "60px Arial", fill: "#ffffff", align: "center"};


PenRunner.scoreState.prototype =
{
	preload: function()
	{

	},
	create: function()
	{
		background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Añadimos un sprite al background
		buttonReturn = game.add.button(game.world.x+30, game.world.y+30, 'return', actionONClick, this, 1, 0, 2);
		buttonReturn.width = 100;
		buttonReturn.height = 100;

		jugador = game.add.sprite(game.world.x+100, game.world.y+150, 'jugador');
        jugador2 = game.add.sprite(game.world.x+100, game.world.y+220, 'jugador');
        jugador3 = game.add.sprite(game.world.x+100, game.world.y+290, 'jugador');
        jugador4 = game.add.sprite(game.world.x+100, game.world.y+360, 'jugador');
        jugador5 = game.add.sprite(game.world.x+100, game.world.y+430, 'jugador');
        jugador6 = game.add.sprite(game.world.x+100, game.world.y+500, 'jugador');


	 	jugador.scale.setTo(1.2, 0.5);
	 	jugador2.scale.setTo(1.2, 0.5);
	    jugador3.scale.setTo(1.2, 0.5);
	    jugador4.scale.setTo(1.2, 0.5);
	    jugador5.scale.setTo(1.2, 0.5);
		jugador6.scale.setTo(1.2, 0.5);
		
		text = game.add.text(game.world.centerX-220, game.world.centerY-230, 'Puntuación Final', style4);
	},
	update: function()
	{

	}

}
function actionONClick()
{
	game.state.start('preloadMenuState');
}