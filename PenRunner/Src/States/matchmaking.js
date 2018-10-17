PenRunner.matchState = function(game) {

}

PenRunner.matchState.prototype =
{
<<<<<<< HEAD
    var background;
    var button;
    preload: function()
    {
        game.load.spritesheet('button', 'assets/buttons/button_sprite_sheet.png', 193, 71);
        game.load.image('background','assets/misc/starfield.jpg'); //Esta imagen se cambiará posteriormente.

    }

    create: function(){

        background = game.add.tileSprite(0, 0, 800, 600, 'background');
        button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0)

      

        


    }

    update: function(){
      //  if(this.)
    }
  

   

}
function actionOnClick () {

    background.visible =! background.visible;

=======
	create: function(){}
>>>>>>> 82395a4f84dc24a01940ddb2cd0ea654e44ec978
}