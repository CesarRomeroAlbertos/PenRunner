PenRunner.menuState = function(game) {

}

//Define el fondo de la pantalla
var background;

//Variables para los tres botones que va a tener la escena
var buttonStartMenu;
var buttonSettingsMenu;
var buttonExitMenu;

//Variable que recoge el nombre de la escena para ponerlo en ésta posteriormente
var tituloMenu = 'Menú Principal';

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

		//Añadimos el titulo del menú principal
		game.add.text(game.world.x+140, game.world.y+200, tituloMenu, style1)

		//Escalamos los tres botones para que se vean adecuadamente en la pantalla
        buttonStartMenu.width = 300; 
		buttonStartMenu.height = 100;
		buttonSettingsMenu.width = buttonExitMenu.width = 50;
		buttonSettingsMenu.height = buttonExitMenu.height = 50;

	},
	update:function() 
	{

	}
}

function startMenu() //Funcion llamada cuando pulsamos el boton de start, llama al script de carga de matchmaking
{
    game.state.start('preloadMatchmakingState');
}

function settingsMenu() //Funcion llamada cuando pulsamos el boton de opciones, llama al script de carga de settings
{
	game.state.start('preloadSettingsState');
}

function exitMenu() //Funcion llamada cuando pulsamos el boton de salir, cierra la ventana
{
	window.close();
}