PenRunner.matchmakingState = function(game) {}


var background; //Define el fondo de la pantalla
var text = 0; //Texto utilizado para el contador de iniciar partida
var text2 = 'Vacío';

var textPlayer = 'Vacío';
var textPlayer2 = 'Vacío';

//Variables que muestran los votos de los 3 mapas disponibles a elegir
var votos1 = 0;
var votos2 = 0;
var votos3 = 0;


//Estilos de fuente
var style1 = { font: "65px Arial", fill: "#ffffff", align: "center" };
var style2 =  { font: "30px Arial", fill: "#000000", align: "center"};
var style3 =  { font: "30px Arial", fill: "#ffffff", align: "center"};


var contador = 30; //Tiempo restante para que comience la partida

//Variables que guardan el numero de votos de cada mapa
var numeroDeVotos1 = 0;
var numeroDeVotos2 = 0;
var numeroDeVotos3 = 0;

//Variables que definen y gestionan los botones de la izquierda, centro y derecha de los mapas de la pantalla, respectivamente.
var buttonMap; 
var buttonMap2;
var buttonMap3;
var joinKey = 0;
var joinKey2 = 0;

var chosenCircuit = -1;
var jugador, jugador2, jugador3, jugador4, jugador5, jugador6;


PenRunner.matchmakingState.prototype =
{

    preload: function()
    {
       

    },

    create: function(){
        
        game.stage.backgroundColor = '#182d3b';

        background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Añadimos un sprite al background

        buttonMap = game.add.button(game.world.x + 40, 40, 'button', null, this, 1, 0, 2) //Establecemos las caracteristicas del primer boton
        buttonMap2 = game.add.button(game.world.x + 300, 40, 'button2', null, this, 10, 10, 0) //Establecemos las caracteristicas del segundo boton
        buttonMap3 = game.add.button(game.world.x + 560, 40, 'button3', null, this, 10, 10, 0) //Establecemos las caracteristicas del tercer boton

        //Establecemos el tamaño de los tres botones
        buttonMap.width = buttonMap2.width = buttonMap3.width = 200; 
        buttonMap.height = buttonMap2.height = buttonMap3.height = 200;
        
        text = game.add.text(game.world.centerX-270, game.world.centerY+250, 'Tiempo restante para iniciar partida: 30', style3);  //ponemos la variable text en el recinto y la editamos 

        votos1 = game.add.text(game.world.x+120, 250, numeroDeVotos1, style1);
        votos2 = game.add.text(game.world.x+380, 250, numeroDeVotos2, style1);
        votos3 = game.add.text(game.world.x+640, 250, numeroDeVotos3, style1);

        //Boton izquierda
        buttonMap.onInputOver.add(over, this); //Cuando ponemos el raton en el recinto del boton, ejecuta la función over()
        buttonMap.onInputOut.add(out, this); //Cuando quitamos el raton del recinto del boton, ejecuta la función out()
        buttonMap.onInputUp.add(up, this); //Cuando clickamos el boton, ejecuta la función up()

        //Boton centro
        buttonMap2.onInputOver.add(over, this); //Cuando ponemos el raton en el recinto del boton, ejecuta la función over()
        buttonMap2.onInputOut.add(out, this); //Cuando quitamos el raton del recinto del boton, ejecuta la función out()
        buttonMap2.onInputUp.add(up2, this); //Cuando clickamos el boton, ejecuta la función up()

        //Boton derecha
        buttonMap3.onInputOver.add(over, this); //Cuando ponemos el raton en el recinto del boton, ejecuta la función over()
        buttonMap3.onInputOut.add(out, this); //Cuando quitamos el raton del recinto del boton, ejecuta la función out()
        buttonMap3.onInputUp.add(up3, this); //Cuando clickamos el boton, ejecuta la función up()

        game.time.events.loop(Phaser.Timer.SECOND, showSeconds, this); //Hacemos un bucle que varie en función de los segundos, es decir, cada segundo, llama a la funcion showSeconds().
        jugador = game.add.sprite(game.world.x+40, game.world.y+370, 'jugador');
        jugador2 = game.add.sprite(game.world.x+40, game.world.y+370, 'jugador').alignTo(jugador, Phaser.RIGHT_CENTER, -240);
        jugador3 = game.add.sprite(game.world.x+40, game.world.y+370, 'jugador').alignTo(jugador2, Phaser.RIGHT_CENTER, -240);
        jugador4 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugador');
        jugador5 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugador').alignTo(jugador4, Phaser.RIGHT_CENTER, -240);
        jugador6 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugador').alignTo(jugador5, Phaser.RIGHT_CENTER, -240);

        jugador.scale.setTo(0.4, 0.5);
        jugador2.scale.setTo(0.4, 0.5);
        jugador3.scale.setTo(0.4, 0.5);
        jugador4.scale.setTo(0.4, 0.5);
        jugador5.scale.setTo(0.4, 0.5);
        jugador6.scale.setTo(0.4, 0.5);

  
        textPlayer = game.add.text(game.world.x+80, game.world.y+382, textPlayer, style2);
        textPlayer2 = game.add.text(game.world.x+340, game.world.y+382, textPlayer2, style2);
        game.add.text(game.world.x+620, game.world.y+382, text2, style2);
        game.add.text(game.world.x+100, game.world.y+482, text2, style2);
        game.add.text(game.world.x+360, game.world.y+482, text2, style2);
        game.add.text(game.world.x+620, game.world.y+482, text2, style2);

        joinKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        joinKey2 = game.input.keyboard.addKey(Phaser.Keyboard.W);

    },

    update: function(){
        if(contador == 0){
            contador = 30;
            //En función de los mapas votados, asignamos un valor a la variable chosenCircuit, para luego elegirlo desde el json
            if(numeroDeVotos1 > numeroDeVotos2 && numeroDeVotos1 > numeroDeVotos3)
                chosenCircuit = 0;
            else if(numeroDeVotos2 > numeroDeVotos1 && numeroDeVotos2 > numeroDeVotos3)
                chosenCircuit = 1;
            else if(numeroDeVotos3 > numeroDeVotos1 && numeroDeVotos3 > numeroDeVotos2)
                chosenCircuit = 2;
            else if (numeroDeVotos1 == numeroDeVotos2 == numeroDeVotos3)
                chosenCircuit = Math.floor(Math.random()*3);
            else if(numeroDeVotos1 == numeroDeVotos2)
                chosenCircuit = Math.floor(Math.random()*2);
            else if(numeroDeVotos2 == numeroDeVotos3)
                chosenCircuit = Math.floor((Math.random()*2)+1);
            else if(numeroDeVotos1 == numeroDeVotos3)
                var rnd = Math.round(Math.random());
                if(rnd == 0)
                    chosenCircuit = 0;
                else
                    chosenCircuit = 2;
           game.state.start('preloadMatchState');
        }
        if(joinKey.isDown){
            textPlayer.setText('Jugador 1')
        }
        if(joinKey2.isDown){
            textPlayer2.setText('Jugador 2')
        }

    
    }
}
function showSeconds()
{
   contador--;
   text.setText('Tiempo restante para iniciar partida: ' + contador);
  
}

function up() 
{
    console.log('button up', arguments);
    if(numeroDeVotos1<9)
    numeroDeVotos1++; //Aumentamos el número de votos del mapa de la izquierda
    votos1.setText(numeroDeVotos1); //Imprimimos el resultado por pantalla.
}
function up2()
{
    if(numeroDeVotos2<9)
    numeroDeVotos2++;

    votos2.setText(numeroDeVotos2); 
}

function up3()
{
    if(numeroDeVotos3<9)
    numeroDeVotos3++;

    votos3.setText(numeroDeVotos3);
}
function over() 
{
    
    console.log('button over');
    
}

function out() 
{
    console.log('button out');
}