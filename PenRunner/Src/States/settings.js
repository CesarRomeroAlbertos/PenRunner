PenRunner.settingsState = function(game) {

}

var background;
var buttonBack;
var buttonUp1;
var buttonDown1;
var buttonUp2;
var buttonDown2;
var opciones = 'Opciones';
var musica = 'Música';
var sonido = 'Sonido';
var musicaValor = 0;
var sonidoValor = 0;
var volumenMusica = 10;
var volumenSonido = 10;

PenRunner.settingsState.prototype =
{
	create: function() {
		game.stage.backgroundColor = '#182d3b';

		background = game.add.tileSprite(0, 0, 800, 600, 'background');
		
		buttonBack = game.add.button(game.world.x + 20, 20, 'buttonBackSettings', backSettings, this, 0, 0, 0);
		buttonUp1 = game.add.button(565, 250, 'buttonUp', subirMusica, this, 0, 0, 0);
		buttonDown1 = game.add.button(415, 250, 'buttonDown', bajarMusica, this, 0, 0, 0);
		buttonUp2 = game.add.button(565, 350, 'buttonUp', subirSonido, this, 0, 0, 0);
		buttonDown2 = game.add.button(415, 350, 'buttonDown', bajarSonido, this, 0, 0, 0);

		buttonBack.width = buttonBack.height = 50;
		buttonUp1.height = buttonUp2.height = buttonDown1.height = buttonDown2.height = 40;
		buttonUp1.width = buttonUp2.width = buttonDown1.width = buttonDown2.width = 35;

		game.add.text(game.world.centerX-150, 20, opciones, style1);
		game.add.text(200, 250, musica, style3);
		game.add.text(200, 350, sonido, style3);

		musicaValor = game.add.text(490, 250, volumenMusica, style3);
        sonidoValor = game.add.text(490, 350, volumenSonido, style3);
	},
	update:function() {

	}
}

function backSettings(){
    game.state.start('preloadMenuState');
}

function subirMusica(){
	if(volumenMusica<10)
    volumenMusica++;
    musicaValor.setText(volumenMusica);
}

function bajarMusica(){
	if(volumenMusica>0)
    volumenMusica--;
    musicaValor.setText(volumenMusica);
}

function subirSonido(){
	if(volumenSonido<10)
    volumenSonido++;
    sonidoValor.setText(volumenSonido);
}

function bajarSonido(){
	if(volumenSonido>0)
    volumenSonido--;
    sonidoValor.setText(volumenSonido);
}