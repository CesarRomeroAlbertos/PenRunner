PenRunner.preloadState = function(game) {

}

PenRunner.preloadState.prototype =
{
	preload: function(){
		game.load.spritesheet('button', 'Assets/button_sprite_sheet.png', 193, 71);
        game.load.image('background','Assets/starfield.jpg'); //Esta imagen se cambiará posteriormente.
	},
	update: function(){
		game.state.start('matchMakingState');
	}
	
}
