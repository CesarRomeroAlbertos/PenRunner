PenRunner.settingsState = function(game) {

}

var background;
var buttonBack;
var opciones = 'OPCIONES';

PenRunner.settingsState.prototype =
{
	create: function() {
		game.stage.backgroundColor = '#182d3b';

		background = game.add.tileSprite(0, 0, 800, 600, 'background');
		
		buttonBack = game.add.button(game.world.x + 20, 20, 'buttonBackSettings', backSettings, this, 0, 0, 0);

		buttonBack.width = buttonBack.height = 50;

		buttonBack.onInputOver.add(overSettings, this);
        buttonBack.onInputOut.add(outSettings, this);
		buttonBack.onInputUp.add(upSettings, this);

		game.add.text(game.world.centerX-170, 20, opciones, style1);
	},
	update:function() {

	}
}

function upSettings() 
{
    console.log('button up', arguments);
}

function overSettings() 
{
    console.log('button over');
}

function outSettings() 
{
    console.log('button out');
}

function backSettings(){
    game.state.start('preloadMenuState');
}