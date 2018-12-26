PenRunner.preloadTrackBuildOnlineState = function(game) {

}

PenRunner.preloadTrackBuildOnlineState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		//tomamos el json que hemos cargado en la escena anterior
		var trackJson = game.cache.getJSON('track');
		var playerAssetsJson = game.cache.getJSON('playersAssets');
	

		//cargamos todos los assets leyendo las direcciones recogidas en el json del circuito
		game.load.image('walls',trackJson.wallsImage);
		game.load.physics('wallsCollision',trackJson.wallsCollisionJson);
		game.load.image('start',trackJson.startImage);
		game.load.image('goal',trackJson.goalImage);
		game.load.image('player0',playerAssetsJson.assets[0].cursor);
		game.load.image('player1',playerAssetsJson.assets[1].cursor);
		game.load.image('player2',playerAssetsJson.assets[2].cursor);
		game.load.image('player3',playerAssetsJson.assets[3].cursor);
		game.load.image('player4',playerAssetsJson.assets[4].cursor);
		game.load.image('player5',playerAssetsJson.assets[5].cursor);
		game.load.image('angleLine0',playerAssetsJson.assets[0].line);
		game.load.image('angleLine1',playerAssetsJson.assets[1].line);
		game.load.image('angleLine2',playerAssetsJson.assets[2].line);
		game.load.image('angleLine3',playerAssetsJson.assets[3].line);
		game.load.image('angleLine4',playerAssetsJson.assets[4].line);
		game.load.image('angleLine5',playerAssetsJson.assets[5].line);
		game.load.image('angleLine',"Assets/AngleBar.png");
		game.playerAssetsStrings = [
			["playerBlue","angleLineBlue"],
			["playerRed","angleLineRed"],
			["playerGreen","angleLineGreen"],
			["playerPurple","angleLinePurple"],
			["playerYellow","angleLineYellow"],
			["playerCian","angleLineCian"]
		];

		//
		game.load.atlasJSONHash('semaforo', 'Assets/semaforo.png', 'Src/json/semaforo.json');
	},
	update: function()
	{

		game.state.start('matchWSState');

	}
}