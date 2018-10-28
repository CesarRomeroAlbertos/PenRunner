PenRunner.menuState = function(game) {

}

var background;
var buttonStart;
var buttonSettings;
var buttonExit;

PenRunner.menuState.prototype =
{
	create: function() {
		game.stage.backgroundColor = '#182d3b';

		background = game.add.tileSprite(0, 0, 800, 600, 'background');
		
		buttonStart = game.add.button(game.world.x + 250, 350, 'buttonStart', start, this, 0, 0, 0);
        buttonSettings = game.add.button(game.world.x + 730, 20, 'buttonSettings', settings, this, 0, 0, 0);
		buttonExit = game.add.button(game.world.x + 20, 20, 'buttonExit', exit, this, 0, 0, 0);
		
        buttonStart.width = 300; 
		buttonStart.height = 100;
		buttonSettings.width = buttonExit.width = 50;
		buttonSettings.height = buttonExit.height = 50;
	},
	update:function() {

	}
}

function start(){
    game.state.start('preloadMatchmakingState');
}

function settings(){
	game.state.start('preloadSettingsState');
}

function exit(){
	window.close();
}