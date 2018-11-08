PenRunner.preloadStart = function(game) {}

//Variables globales:

//Estilos de fuente
var style1 = { font: "65px Arial", fill: "#ffffff", align: "center" };
var style2 =  { font: "30px Arial", fill: "#000000", align: "center"};
var style3 =  { font: "30px Arial", fill: "#ffffff", align: "center"};
var style4 =  { font: "60px Arial", fill: "#ffffff", align: "center"};

//variable de elección de circuito
var chosenCircuit;

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
		game.load.image('buttonSettingsMenu', 'Assets/opciones.png', 200, 70);
		game.load.image('buttonExitMenu', 'Assets/salir.png', 200, 70);
		game.load.image('background','Assets/starfield.jpg');

		//Settings
		game.load.image('buttonBackSettings', 'Assets/atras.png', 200, 70);
		game.load.image('buttonUp', 'Assets/subir.png', 200, 70);
		game.load.image('buttonDown', 'Assets/bajar.png', 200, 70);

		//Matchmaking
		game.load.image('button', 'Assets/Mapa1.png', 200, 70);
		game.load.image('button2', 'Assets/Mapa2.png', 200, 70);
		game.load.image('button3', 'Assets/Mapa3.png', 200, 70);
		game.load.image('jugador', 'Assets/jugadores.png', 200, 70);
		game.load.json('trackList',"Src/json/tracks.json");


		//Score
		game.load.image('jugador', 'Assets/jugadores.png', 200, 70);
		game.load.image('return', 'Assets/atras.png', 200, 70);
		game.load.image('backgroundScore','Assets/Fondo_fin_partida.jpg', 200, 70);
	},
	update: function()
	{

		game.state.start('titleState');

	}
}