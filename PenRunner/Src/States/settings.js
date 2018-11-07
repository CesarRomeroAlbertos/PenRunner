PenRunner.settingsState = function(game) {

}

//Define el fondo de la pantalla
var background;

//Variables para los cinco botones que va a tener la escena
var buttonBack;
var buttonUp1;
var buttonDown1;
var buttonUp2;
var buttonDown2;

//Variables que recogen el nombre de la escena y los ajustes que se pueden realizar para incluirlos en ella
var opciones = 'Opciones';
var musica = 'Música';
var sonido = 'Sonido';

//Variables a las que se le va a asignar el valor de la música y el sonido cuando se modifique
var musicaValor = 0;
var sonidoValor = 0;

//Variables inicializadas con el valor por defecto de música y sonido
var volumenMusica = 10;
var volumenSonido = 10;

PenRunner.settingsState.prototype =
{
	create: function() {
		game.stage.backgroundColor = '#182d3b'; //Establecemos un color de fondo, que no se ve por el sprite del background

		background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Ponemos una imagen de fondo
		
		//Asignamos los cinco botones que están en el menú de opciones a las variables creadas previamente
		buttonBack = game.add.button(game.world.x + 20, 20, 'buttonBackSettings', backSettings, this, 0, 0, 0);
		buttonUp1 = game.add.button(565, 250, 'buttonUp', subirMusica, this, 0, 0, 0);
		buttonDown1 = game.add.button(415, 250, 'buttonDown', bajarMusica, this, 0, 0, 0);
		buttonUp2 = game.add.button(565, 350, 'buttonUp', subirSonido, this, 0, 0, 0);
		buttonDown2 = game.add.button(415, 350, 'buttonDown', bajarSonido, this, 0, 0, 0);

		//Escalamos los cinco botones para que se vean adecuadamente en la pantalla
		buttonBack.width = buttonBack.height = 50;
		buttonUp1.height = buttonUp2.height = buttonDown1.height = buttonDown2.height = 40;
		buttonUp1.width = buttonUp2.width = buttonDown1.width = buttonDown2.width = 35;

		//Añadimos el título del menú de opciones y los nombres de los ajustes que se pueden realizar
		game.add.text(game.world.centerX-150, 20, opciones, style1);
		game.add.text(200, 250, musica, style3);
		game.add.text(200, 350, sonido, style3);

		//Asignamos a las variables creadas previamente el valor de música y sonido
		musicaValor = game.add.text(490, 250, volumenMusica, style3);
        sonidoValor = game.add.text(490, 350, volumenSonido, style3);
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
    musicaValor.setText(volumenMusica);
}

function bajarMusica(){ //Función llamada cuando pulsamos el botón de bajar volumen de la música y lo baja siempre que sea mayor que 0
	if(volumenMusica>0)
    volumenMusica--;
    musicaValor.setText(volumenMusica);
}

function subirSonido(){ //Función llamada cuando pulsamos el botón de subir volumen del sonido y lo sube siempre que sea menor que 10
	if(volumenSonido<10)
    volumenSonido++;
    sonidoValor.setText(volumenSonido);
}

function bajarSonido(){ //Función llamada cuando pulsamos el botón de bajar volumen del sonido y lo baja siempre que sea mayor que 0
	if(volumenSonido>0)
    volumenSonido--;
    sonidoValor.setText(volumenSonido);
}