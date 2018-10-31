PenRunner.menuState = function(game) {

}

var background;
var buttonStart;
var buttonSettings;
var buttonExit;

var titulomenu = 'Menú Principal';

PenRunner.menuState.prototype =
{
	create: function() 
	{
		game.stage.backgroundColor = '#182d3b'; //Establecemos un color de fondo, que no se ve por el sprite del background

		background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Ponemos una imagen de fondo

		//Creamos e inicializamos los tres botones que están en el menú principal.
        buttonStartMenu = game.add.button(game.world.x + 250, 400, 'buttonStartMenu', startMenu, this, 1, 0, 2);
        buttonSettingsMenu = game.add.button(game.world.x + 730, 20, 'buttonSettingsMenu', settingsMenu, this, 1, 0, 2);
		buttonExitMenu = game.add.button(game.world.x + 20, 20, 'buttonExitMenu', exitMenu, this, 1, 0, 2);

		//añadimos el titulo del menú principal
		game.add.text(game.world.x+140, game.world.y+200, titulomenu, style1)

		//escalamos los tres botones para que se vean adecuadamente en la pantalla
        buttonStartMenu.width = 300; 
		buttonStartMenu.height = 100;
		buttonSettingsMenu.width = buttonExitMenu.width = 50;
		buttonSettingsMenu.height = buttonExitMenu.height = 50;

	},
	update:function() 
	{

	}
}

function startMenu() //funcion llamada cuando pulsamos el boton de start
{
    game.state.start('preloadMatchmakingState');
}

function settingsMenu() //funcion llamada cuando pulsamos el boton de opciones
{
	game.state.start('preloadSettingsState');
}

function exitMenu() //funcion llamada cuando pulsamos el boton de salir.
{
	window.close();
}