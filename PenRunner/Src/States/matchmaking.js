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


var contador = 5; //Tiempo restante para que comience la partida

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
var sceneTime = 0;

var chosenCircuit;
var jugador, jugador2, jugador3, jugador4, jugador5, jugador6;


PenRunner.matchmakingState.prototype =
{

    preload: function()
    {
     numeroDeVotos1 = 0;
     numeroDeVotos2 = 0;
     numeroDeVotos3 = 0;
     this.joinKey = 0;
     this.joinKey2 = 0;
     if(sceneTime > 1)
     game.time.events.loop(Phaser.Timer.SECOND, showSeconds, this); //Hacemos un bucle que varie en función de los segundos, es decir, cada segundo, llama a la funcion showSeconds().




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
        
        text = game.add.text(game.world.centerX-270, game.world.centerY+250, 'Tiempo restante para iniciar partida: 5', style3);  //ponemos la variable text en el recinto y la editamos 

        votos1 = game.add.text(game.world.x+120, 250, numeroDeVotos1, style1);
        votos2 = game.add.text(game.world.x+380, 250, numeroDeVotos2, style1);
        votos3 = game.add.text(game.world.x+640, 250, numeroDeVotos3, style1);

        //Boton izquierda
        buttonMap.onInputUp.add(up, this); //Cuando clickamos el boton, ejecuta la función up()

        //Boton centro
        buttonMap2.onInputUp.add(up2, this); //Cuando clickamos el boton, ejecuta la función up()

        //Boton derecha
        buttonMap3.onInputUp.add(up3, this); //Cuando clickamos el boton, ejecuta la función up()

        var timer = game.time.events.loop(Phaser.Timer.SECOND, showSeconds, this); //Hacemos un bucle que varie en función de los segundos, es decir, cada segundo, llama a la funcion showSeconds().
        //Estalbecemos las posiciones de los sprites de cada uno de los huecos donde se pueden poner los nombres de los jugadores.
        jugador = game.add.sprite(game.world.x+40, game.world.y+370, 'jugador');
        jugador2 = game.add.sprite(game.world.x+40, game.world.y+370, 'jugador').alignTo(jugador, Phaser.RIGHT_CENTER, -240);
        jugador3 = game.add.sprite(game.world.x+40, game.world.y+370, 'jugador').alignTo(jugador2, Phaser.RIGHT_CENTER, -240);
        jugador4 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugador');
        jugador5 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugador').alignTo(jugador4, Phaser.RIGHT_CENTER, -240);
        jugador6 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugador').alignTo(jugador5, Phaser.RIGHT_CENTER, -240);

        //escalamos los botones donde iran el nombres de los jugadores.
        jugador.scale.setTo(0.4, 0.5);
        jugador2.scale.setTo(0.4, 0.5);
        jugador3.scale.setTo(0.4, 0.5);
        jugador4.scale.setTo(0.4, 0.5);
        jugador5.scale.setTo(0.4, 0.5);
        jugador6.scale.setTo(0.4, 0.5);

        //Aquí guardamos los nombres de los jugadores, de momento, están establecidos por defecto a jugador 1 y jugador 2. Pero se estudiará el hecho de incluir nombres personalizados
        textPlayer = game.add.text(game.world.x+100, game.world.y+382, text2, style2);
        textPlayer2 = game.add.text(game.world.x+360, game.world.y+382, text2, style2);

        //Mostramos el resto de textos donde pone "Vacío"
        game.add.text(game.world.x+620, game.world.y+382, text2, style2);
        game.add.text(game.world.x+100, game.world.y+482, text2, style2);
        game.add.text(game.world.x+360, game.world.y+482, text2, style2);
        game.add.text(game.world.x+620, game.world.y+482, text2, style2);

        //Hemos declarado dos variables con las que hacemos que los jugadores se unan a la partida
        joinKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        joinKey2 = game.input.keyboard.addKey(Phaser.Keyboard.W);

    },

    update: function(){ //Función que se ejecuta una vez por frame
        //Si el contador se queda a 0, lo ponemos a 5 para la siguiente vez que se cargue la escena
        if(contador == 0){
           contador = 5;
            //En función de los mapas votados, asignamos un valor a la variable chosenCircuit, para luego elegirlo desde el json
            var select = [];
            var max = 0;
            var puntos = [numeroDeVotos1,numeroDeVotos2,numeroDeVotos3];

            for(var i = 0; i<puntos.length; i++)
            {
                if(puntos[i]>max)
                {
                    select=[];
                    select.push(i);
                    max = puntos[i];
                }
                else if(puntos[i]==max)
                {
                    select.push(i);
                }
            }
            if(select.length>1)
            {
                var index = game.rnd.integerInRange(0,select.length-1);
                chosenCircuit = select[index];
            }
            else
                chosenCircuit = select[0];
                game.state.clearCurrentState();
                sceneTime++;
           game.state.start('preloadMatchState');
        }
        //Si se pulsa la tecla seleccionada en el teclado, se une uno de los dos jugadores
        if(joinKey.isDown){
            textPlayer2.destroy();
            game.add.text(game.world.x+340, game.world.y+382,'Jugador 2', style2);
        }
        //Si se pulsa la tecla seleccionada en el teclado, se une uno de los dos jugadores
        if(joinKey2.isDown){
            textPlayer.destroy();
            game.add.text(game.world.x+80, game.world.y+382, 'Jugador 1', style2);
        }

    
    }
}
//esta funcion se encarga de actualizar la cuenta atrás para iniciar la partida, se llama una vez cada segundo, como bien se indica en la instrucción de game.loop(Línea 82)
function showSeconds() 
{
   contador--;
   text.setText('Tiempo restante para iniciar partida: ' + contador);
   console.log(contador);
  
}

function up() //Función que se llama cuando clickamos sobre el mapa que esta situado más a la izquierda
{
    if(numeroDeVotos1<9)
    numeroDeVotos1++; //Aumentamos el número de votos del mapa de la izquierda
    votos1.setText(numeroDeVotos1); //Imprimimos el resultado por pantalla.
}
function up2()//Función que se llama cuando clickamos sobre el mapa que esta situado en el centro
{
    if(numeroDeVotos2<9)
    numeroDeVotos2++;

    votos2.setText(numeroDeVotos2); 
}

function up3()//Función que se llama cuando clickamos sobre el mapa que esta situado más a la derecha
{
    if(numeroDeVotos3<9)
    numeroDeVotos3++;

    votos3.setText(numeroDeVotos3);
}