PenRunner.settingsState = function(game) {

}

var settings={};
function settingsData(){return this;}

PenRunner.settingsState.prototype =
{
	create: function() {

		//Variables que recogen el nombre de la escena y los ajustes que se pueden realizar para incluirlos en ella
		var opciones = 'Opciones';
		var musica = 'Música';
		var sonido = 'Sonido';

		game.stage.backgroundColor = '#182d3b'; //Establecemos un color de fondo, que no se ve por el sprite del background

		var background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Ponemos una imagen de fondo
		
		//Asignamos los cinco botones que están en el menú de opciones a las variables creadas previamente
		var buttonBack = game.add.button(game.world.x + 20, 20, 'buttonBackSettings', backSettings, this, 0, 0, 0);
		var buttonUp1 = game.add.button(560, 240, 'buttonUp', subirMusica, this, 0, 0, 0);
		var buttonDown1 = game.add.button(405, 240, 'buttonDown', bajarMusica, this, 0, 0, 0);
		var buttonUp2 = game.add.button(560, 320, 'buttonUp', subirSonido, this, 0, 0, 0);
		var buttonDown2 = game.add.button(405, 320, 'buttonDown', bajarSonido, this, 0, 0, 0);

		//Escalamos los cinco botones para que se vean adecuadamente en la pantalla
		buttonBack.width = buttonBack.height = 40;
		buttonUp1.height = buttonUp2.height = buttonDown1.height = buttonDown2.height = 40;
		buttonUp1.width = buttonUp2.width = buttonDown1.width = buttonDown2.width = 35;

		//Añadimos el título del menú de opciones y los nombres de los ajustes que se pueden realizar
		game.add.text(game.world.centerX-140, 20, opciones, style1);
		game.add.text(200, 242, musica, style3);
		game.add.text(200, 322, sonido, style3);

		//Asignamos a las variables creadas previamente el valor de música y sonido
		settings.musicaValor = game.add.text(485, 242, volumenMusica, style3);
        settings.sonidoValor = game.add.text(485, 322, volumenSonido, style3);
	},
	update:function() {

	}
}

function backSettings(){ //Función llamada cuando pulsamos el botón de atrás, llama al script de carga del menú principal
    game.state.start('menuState');
}

function subirMusica(){ //Función llamada cuando pulsamos el botón de subir volumen de la música y lo sube siempre que sea menor que 10
	if(volumenMusica<10)
    volumenMusica++;
    settings.musicaValor.setText(volumenMusica);
}

function bajarMusica(){ //Función llamada cuando pulsamos el botón de bajar volumen de la música y lo baja siempre que sea mayor que 0
	if(volumenMusica>0)
    volumenMusica--;
    settings.musicaValor.setText(volumenMusica);
}

function subirSonido(){ //Función llamada cuando pulsamos el botón de subir volumen del sonido y lo sube siempre que sea menor que 10
	if(volumenSonido<10)
    volumenSonido++;
    settings.sonidoValor.setText(volumenSonido);
}

function bajarSonido(){ //Función llamada cuando pulsamos el botón de bajar volumen del sonido y lo baja siempre que sea mayor que 0
	if(volumenSonido>0)
    volumenSonido--;
    settings.sonidoValor.setText(volumenSonido);
}