PenRunner.preloadMenuState = function(game) {

}

PenRunner.preloadMenuState.prototype =
{
	preload:function()
	{
		//Poner texto, imágenes, y todo lo que tenga que salir en la pantalla de carga ANTES de cargar las imágenes

        var text = "Loading...";
    	var style = { font: "65px Arial", fill: "#ffffff", align: "center" };

		var t = game.add.text(game.world.centerX-150, game.world.centerY-100, text, style);
		
		//Archivos a cargar:

		game.load.image('buttonStart', 'Assets/start.png', 200, 70);
		game.load.image('buttonSettings', 'Assets/opciones.png', 200, 70);
		game.load.image('buttonExit', 'Assets/salir.png', 200, 70);
		game.load.image('background','Assets/starfield.jpg');
        
	},
	update: function()
	{

		game.state.start('menuState');

	}
}