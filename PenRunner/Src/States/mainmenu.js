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
		
		buttonStart = game.add.button(game.world.x + 250, 350, 'button', start, this, 0, 0, 0);
        buttonSettings = game.add.button(game.world.x + 730, 20, 'button2', settings, this, 0, 0, 0);
		buttonExit = game.add.button(game.world.x + 20, 20, 'button3', exit, this, 0, 0, 0);
		
        buttonStart.width = 300; 
		buttonStart.height = 100;
		buttonSettings.width = buttonExit.width = 50;
		buttonSettings.height = buttonExit.height = 50;

		buttonStart.onInputOver.add(over, this);
        buttonStart.onInputOut.add(out, this);
		buttonStart.onInputUp.add(up, this);
		
		buttonSettings.onInputOver.add(over, this);
        buttonSettings.onInputOut.add(out, this);
		buttonSettings.onInputUp.add(up, this);
		
		buttonExit.onInputOver.add(over, this);
        buttonExit.onInputOut.add(out, this);
		buttonExit.onInputUp.add(up, this);
	},
	update:function() {

	}
}

function up() 
{
    console.log('button up', arguments);
}

function over() 
{
    console.log('button over');
}

function out() 
{
    console.log('button out');
}

function start(){
    game.state.start('preloadMatchmakingState');
}

function settings(){
	//game.state.start('preloadSettingsState');
}

function exit(){
	window.close();
}