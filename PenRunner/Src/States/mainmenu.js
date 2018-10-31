PenRunner.menuState = function(game) {

}

var background;
var buttonStart;
var buttonSettings;
var buttonExit;

PenRunner.menuState.prototype =
{
	create: function() 
	{
		game.stage.backgroundColor = '#182d3b';

		background = game.add.tileSprite(0, 0, 800, 600, 'background');
		
        buttonStartMenu = game.add.button(game.world.x + 250, 400, 'buttonStartMenu', startMenu, this, 1, 0, 2);
        buttonSettingsMenu = game.add.button(game.world.x + 730, 20, 'buttonSettingsMenu', settingsMenu, this, 1, 0, 2);
		buttonExitMenu = game.add.button(game.world.x + 20, 20, 'buttonExitMenu', exitMenu, this, 1, 0, 2);
		
        buttonStartMenu.width = 300; 
		buttonStartMenu.height = 100;
		buttonSettingsMenu.width = buttonExitMenu.width = 50;
		buttonSettingsMenu.height = buttonExitMenu.height = 50;

	},
	update:function() 
	{

	}
}

function startMenu()
{
    game.state.start('preloadMatchmakingState');
}

function settingsMenu()
{
	game.state.start('preloadSettingsState');
}

function exitMenu()
{
	window.close();
}