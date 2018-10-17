PenRunner.matchMakingState = function(game) {
    var background;
    var button;
}

PenRunner.matchMakingState.prototype =
{

    preload: function()
    {
        

    },

    create: function(){
        
        game.stage.backgroundColor = '#182d3b';
        background = game.add.tileSprite(0, 0, 800, 600, 'background');
        button = game.add.button(game.world.centerX - 95, 400, 'button', actionOnClick, this, 2, 1, 0)

        button.onInputOver.add(over, this);
        button.onInputOut.add(out, this);
        button.onInputUp.add(up, this);
    },

    update: function(){
      
    }
  

   

}
function actionOnClick () {

    background.visible =! background.visible;


}

function up() {
    console.log('button up', arguments);
}

function over() {
    console.log('button over');
}

function out() {
    console.log('button out');
}