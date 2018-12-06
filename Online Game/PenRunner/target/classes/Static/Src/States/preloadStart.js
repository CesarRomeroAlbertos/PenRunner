PenRunner.preloadStart = function(game) {}

//Variables globales:

//Variables inicializadas con el valor por defecto de música y sonido
var volumenMusica = 10;
var volumenSonido = 10;

//Estilos de fuente
var style1 = { font: "65px Arial", fill: "#000000", align: "center" };
var style2 =  { font: "30px Arial", fill: "#000000", align: "center"};
var style3 =  { font: "30px Arial", fill: "#000000", align: "center"};
var style4 =  { font: "60px Arial", fill: "#000000", align: "center"};

//variable de elección de circuito
var chosenCircuit;
var numeroDeJugadores;
var textPlayer2, textPlayer3, textPlayer4;
var empezado;
var numeroMeta;
PenRunner.preloadStart.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

		var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:
		
		//Title
		game.load.atlasJSONHash('title', 'Assets/titleSpritesheet.png', 'Src/json/titleSpritesheet.json');

		//Main Menu
		game.load.image('buttonStartMenu', 'Assets/start.png', 200, 70);
		game.load.image('buttonSettingsMenu', 'Assets/settings.png', 200, 70);
		game.load.image('buttonExitMenu', 'Assets/exit.png', 200, 70);
		game.load.image('background','Assets/background.png');

		//Settings
		game.load.image('buttonBackSettings', 'Assets/leftarrow.png', 200, 70);
		game.load.image('buttonUp', 'Assets/rightarrow.png', 200, 70);
		game.load.image('buttonDown', 'Assets/leftarrow.png', 200, 70);

		//Matchmaking
		game.load.image('button', 'Assets/Mapa1_1.png', 200, 70);
		game.load.image('button2', 'Assets/Mapa2_2.png', 200, 70);
		game.load.image('button3', 'Assets/Mapa3_3.png', 200, 70);
		game.load.image('jugadorMatch', 'Assets/Boton_Jugadores.png', 200, 70);
		game.load.json('trackList',"Src/json/tracks.json");

		//Match
		game.load.json('playersAssets',"Src/json/playersAssets.json");

		//Score
		game.load.image('jugador', 'Assets/Texto_Jugador_01.png', 200, 70);
		game.load.image('return', 'Assets/leftarrow.png', 200, 70);
		game.load.image('backgroundScore','Assets/Fondo_fin_partida.jpg', 200, 70);
	},
	update: function()
	{

		game.state.start('titleState');

	}
}