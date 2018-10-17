PenRunner.matchmakingState = function(game) {
    
    
    var buttonMap2;
    var buttonMap3;
    
    
}
var background; //Define el fondo de la pantalla
var text = 0; //Texto utilizado para el contador de iniciar partida
var votos1 = 0;


//Estilos de fuente
var style = { font: "65px Arial", fill: "#ffffff", align: "center" };
var style2 =  { font: "30px Arial", fill: "#ffffff", align: "center" };


var contador = 30;
var numeroDeVotos1 = 0;

var buttonMap; //Variable que define y gestiona el boton de la izquierda de la pantalla


PenRunner.matchmakingState.prototype =
{

    preload: function()
    {
       

    },

    create: function(){
        
        game.stage.backgroundColor = '#182d3b';

        background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Añadimos un sprite al background
        buttonMap = game.add.button(game.world.x + 50, 150, 'button', actionOnClick, this, 2, 1, 0) //Establecemos las caracteristicas del primer boton
        text = game.add.text(game.world.centerX-270, game.world.centerY+200, 'Tiempo Restante para iniciar partida: 30', style2);  //ponemos la variable text en el recinto y la editamos 

        votos1 = game.add.text(game.world.centerX-50, game.world.centerY-100, numeroDeVotos1, style);


        buttonMap.onInputOver.add(over, this); //Cuando ponemos el raton en el recinto del boton, ejecuta la función over()
        buttonMap.onInputOut.add(out, this); //Cuando quitamos el raton del recinto del boton, ejecuta la función out()
        buttonMap.onInputUp.add(up, this); //Cuando clickamos el boton, ejecuta la función up()

        game.time.events.loop(Phaser.Timer.SECOND, showSeconds, this); //Hacemos un bucle que varie en función de los segundos, es decir, cada segundo, llama a la funcion showSeconds().
    },

    update: function(){
        
        
      
    }
}
function actionOnClick () 
{
    background.visible =! background.visible;
}
function showSeconds()
{
   contador--;
   text.setText('Tiempo restante para iniciar partida: ' + contador);
}

function up() 
{
    console.log('button up', arguments);
    numeroDeVotos1++; //Aumentamos el número de votos del mapa de la izquierda
    votos1.setText(numeroDeVotos1); //Imprimimos el resultado por pantalla.
}

function over() 
{
    console.log('button over');
    
}

function out() 
{
    console.log('button out');
}