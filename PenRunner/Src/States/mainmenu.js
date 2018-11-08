PenRunner.menuState = function(game) {}

PenRunner.menuState.prototype =
{
	create: function() 
	{
		game.stage.backgroundColor = '#182d3b'; //Establecemos un color de fondo, que no se ve por el sprite del background

		var background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Ponemos una imagen de fondo

		//Asignamos los tres botones que están en el menú principal a las variables creadas previamente
        var buttonStartMenu = game.add.button(game.world.x + 250, 400, 'buttonStartMenu', startMenu, this, 1, 0, 2);
        var buttonSettingsMenu = game.add.button(game.world.x + 730, 20, 'buttonSettingsMenu', settingsMenu, this, 1, 0, 2);
		var buttonExitMenu = game.add.button(game.world.x + 20, 20, 'buttonExitMenu', exitMenu, this, 1, 0, 2);

		//Añadimos el título del menú principal
		var tituloMenu = 'Menú Principal';
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

function startMenu() //Función llamada cuando pulsamos el botón de start, llama al script de carga de matchmaking
{
    game.state.start('matchmakingState');
}

function settingsMenu() //Función llamada cuando pulsamos el botón de opciones, llama al script de carga de settings
{
	game.state.start('settingsState');
}

function exitMenu() //Función llamada cuando pulsamos el botón de salir, cierra la ventana
{
	window.close();
}