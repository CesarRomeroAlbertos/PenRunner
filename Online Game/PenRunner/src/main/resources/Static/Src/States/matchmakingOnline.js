PenRunner.matchmakingOnlineState = function(game) {}


var matchmaking={};
function matchmakingData(){return this;}

PenRunner.matchmakingOnlineState.prototype =
{

    create: function(){

        matchmaking.contador = 12;
        matchmaking.numeroDeVotos1 = 0;
        matchmaking.numeroDeVotos2 = 0;
        matchmaking.numeroDeVotos3 = 0;
        this.joinKey = 0;
        this.joinKey2 = 0;
        var sceneTime = 0;

        game.stage.backgroundColor = '#182d3b';

        var background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Añadimos un sprite al background
        
        this.createPlayer();

        buttonMap = game.add.button(game.world.x + 40, 40, 'button', null, this, 1, 0, 2) //Establecemos las caracteristicas del primer boton
        buttonMap2 = game.add.button(game.world.x + 300, 40, 'button2', null, this, 10, 10, 0) //Establecemos las caracteristicas del segundo boton
        buttonMap3 = game.add.button(game.world.x + 560, 40, 'button3', null, this, 10, 10, 0) //Establecemos las caracteristicas del tercer boton

        //Establecemos el tamaño de los tres botones
        buttonMap.width = buttonMap2.width = buttonMap3.width = 200; 
        buttonMap.height = buttonMap2.height = buttonMap3.height = 200;
        
        matchmaking.text = game.add.text(game.world.centerX-270, game.world.centerY+250, 'Tiempo restante para iniciar partida: 12', style3);  //ponemos la variable text en el recinto y la editamos 
        matchmaking.text2 = 'Vacío';

        matchmaking.votos1 = game.add.text(game.world.x+120, 250, matchmaking.numeroDeVotos1, style1);
        matchmaking.votos2 = game.add.text(game.world.x+380, 250, matchmaking.numeroDeVotos2, style1);
        matchmaking.votos3 = game.add.text(game.world.x+640, 250, matchmaking.numeroDeVotos3, style1);

        //Boton izquierda
        buttonMap.onInputUp.add(up, this); //Cuando clickamos el boton, ejecuta la función up()

        //Boton centro
        buttonMap2.onInputUp.add(up2, this); //Cuando clickamos el boton, ejecuta la función up()

        //Boton derecha
        buttonMap3.onInputUp.add(up3, this); //Cuando clickamos el boton, ejecuta la función up()

        var timerMatchmaking = game.time.events.loop(Phaser.Timer.SECOND, showSeconds, this); //Hacemos un bucle que varie en función de los segundos, es decir, cada segundo, llama a la funcion showSeconds().
        //Estalbecemos las posiciones de los sprites de cada uno de los huecos donde se pueden poner los nombres de los jugadores.
        var jugador = game.add.sprite(game.world.x+40, game.world.y+370, 'jugadorMatch');
        var jugador2 = game.add.sprite(game.world.x+40, game.world.y+370, 'jugadorMatch').alignTo(jugador, Phaser.RIGHT_CENTER, -240);
       // var jugador3 = game.add.sprite(game.world.x+40, game.world.y+370, 'jugadorMatch').alignTo(jugador2, Phaser.RIGHT_CENTER, -240);
      //  var jugador4 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch');
      //  var jugador5 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch').alignTo(jugador4, Phaser.RIGHT_CENTER, -240);
      //  var jugador6 = game.add.sprite(game.world.x+40, game.world.y+470, 'jugadorMatch').alignTo(jugador5, Phaser.RIGHT_CENTER, -240);

        //escalamos los botones donde iran el nombres de los jugadores.
        jugador.scale.setTo(0.4, 0.5);
        jugador2.scale.setTo(0.4, 0.5);
      //  jugador3.scale.setTo(0.4, 0.5);
      //  jugador4.scale.setTo(0.4, 0.5);
       // jugador5.scale.setTo(0.4, 0.5);
       // jugador6.scale.setTo(0.4, 0.5);

        //Aquí guardamos los nombres de los jugadores, de momento, están establecidos por defecto a jugador 1 y jugador 2. Pero se estudiará el hecho de incluir nombres personalizados
        var textPlayer = game.add.text(game.world.x+100, game.world.y+382, matchmaking.text2, style2);
        var textPlayer2 = game.add.text(game.world.x+360, game.world.y+382, matchmaking.text2, style2);

        //Mostramos el resto de textos donde pone "Vacío"
       // game.add.text(game.world.x+620, game.world.y+382, matchmaking.text2, style2);
      //  game.add.text(game.world.x+100, game.world.y+482, matchmaking.text2, style2);
      //  game.add.text(game.world.x+360, game.world.y+482, matchmaking.text2, style2);
       // game.add.text(game.world.x+620, game.world.y+482, matchmaking.text2, style2);

        //Hemos declarado dos variables con las que hacemos que los jugadores se unan a la partida
        joinKey = game.input.keyboard.addKey(Phaser.Keyboard.Q);
        joinKey2 = game.input.keyboard.addKey(Phaser.Keyboard.W);

    },

    update: function(){ //Función que se ejecuta una vez por frame
        //Si el contador se queda a 0, lo ponemos a 5 para la siguiente vez que se cargue la escena
    	this.getNumPlayers(function (numPlayers) {
			if (numPlayers.length === 2) {
				console.log ('##### COMIENZA EL JUEGO #####');
            }
        });
        
        if(matchmaking.contador <= 0){
           //contador = 5;
            //En función de los mapas votados, asignamos un valor a la variable chosenCircuit, para luego elegirlo desde el json
            var select = [];
            var max = 0;
            var puntos = [matchmaking.numeroDeVotos1,matchmaking.numeroDeVotos2,matchmaking.numeroDeVotos3];

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
                game.state.start('preloadMatchState');
        }
        //Si se pulsa la tecla seleccionada en el teclado, se une uno de los dos jugadores
        if(joinKey.isDown){
            textPlayer2.destroy();
            game.add.text(game.world.x+340, game.world.y+382,'Jugador 2', style2);
        }
        //Si se pulsa la tecla seleccionada en el teclado, se une uno de los dos jugadores
        if(this.getNumPlayers(callback) > 0){
            textPlayer.destroy();
            game.add.text(game.world.x+80, game.world.y+382, 'Jugador 1', style2);
        }

    }

  
}

function createPlayer() 
{
    $.ajax({
        method: "POST",
        url: 'http://localhost:8080/player',
        processData: false,
        headers: {
            "Content-Type": "application/json"
        },
    }).done(function (data) {
        console.log("Se ha creado el jugador: " + JSON.stringify(data));
        game.player1 = data
    })
}

function getNumPlayers(callback)
{
        $.ajax({
            url: 'http://localhost:8080/game',
        }).done(function (data) {
            callback(data);
        })  
}
function updateNumberOfVotes()
{
	$.ajax({
        method: "PUT",
        url: 'http://localhost:8080/player/{numeroDeVotos1}',
        processData: false,
        headers: {
            "Content-Type": "application/json"
        },
    }).done(function (data) {
     //   if(buttonMap.)
        matchmaking.numeroDeVotos1++;
        console.log('Se ha actualizado la votación de los mapas: ' + JSON.stringify(data));
        
    })
	
}
//esta funcion se encarga de actualizar la cuenta atrás para iniciar la partida, se llama una vez cada segundo, como bien se indica en la instrucción de game.loop(Línea 82)
function showSeconds() 
{
   matchmaking.contador--;
   matchmaking.text.setText('Tiempo restante para iniciar partida: ' + matchmaking.contador);
}

function up() //Función que se llama cuando clickamos sobre el mapa que esta situado más a la izquierda
{
    if(matchmaking.numeroDeVotos1<9)
    	{
    	updateNumberOfVotes(); //Llamamos a la función para actualizar el número de votos en el servidor
    	}
 
    matchmaking.votos1.setText(matchmaking.numeroDeVotos1); //Imprimimos el resultado por pantalla.
}
function up2()//Función que se llama cuando clickamos sobre el mapa que esta situado en el centro
{
    if(matchmaking.numeroDeVotos2<9)
        updateNumberOfVotes(); 
   // matchmaking.numeroDeVotos2++;

    matchmaking.votos2.setText(matchmaking.numeroDeVotos2); 
}

function up3()//Función que se llama cuando clickamos sobre el mapa que esta situado más a la derecha
{
    if(matchmaking.numeroDeVotos3<9)
        updateNumberOfVotes(); 
    //matchmaking.numeroDeVotos3++;

    matchmaking.votos3.setText(matchmaking.numeroDeVotos3);
}