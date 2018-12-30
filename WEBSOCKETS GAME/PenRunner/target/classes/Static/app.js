// API de WebSocket
debug = {
    ws: 1
}

ws = new WebSocket('ws://localhost:8080/penrunner');


// Un monitor de eventos que es llamado cuando un error ocurre. Esto es un evento simple llamado "error"
ws.onerror = function (error) {
  //  console.log('[DEBUG-WS] Ha ocurrido un error: ' + error)
}

// Un monitor de eventos que atiende una llamada cuando la conexión del WebSocket cambia a un estado CERRADO (CLOSED). El monitor recibe un CloseEvent llamado "cerrado".
ws.onclose = function (event) {
    if (debug.ws) {
      //  console.log('[DEBUG-WS] Se ha cerrado la conexion.')
    }
}

// Un monitor de eventos que es llamado cuando un mensaje es recibido desde un servidor. El monitor recibe un objeto MessageEvent llamado "mensaje".
ws.onmessage = function (message) {
    if (debug.ws) {
       // console.log('[DEBUG-WS] Se ha recibido un mensaje: ' + message.data)
    }

    var msg = JSON.parse(message.data)

  //  console.log('INFO RECIBIDA /n' + msg)

    if (game.hasJoined === true) {
    	//Este switch se ejecuta cada vez que un mensaje es recibido por el servidor, de tal manera que en función del tipo de mensaje, se enviará una uinformación 
    	//diferente, por ejemplo, cuando creamos un jugador, o cuando actualizamos el estado de los jugadores.
        switch (msg.type) { 
            case "player_created": //Mensaje referente a cuando creamos un jugador
                game.player = msg.content.player;
                break
            case "GAME_COMPLETE"://Mensaje referente a cuando se acaba la partida
               // console.log('##### GAME IS COMPLETE #####')
                break
            case "UPDATE_STATE": 
             //   console.log('!!!!! GAME SENDS UPDATE !!!!!')
                break
            case "numPlayers": //Mensaje referente a modificamos el número de jugadores que hay en matchmaking
                game.numPlayers = msg.content;
                PenRunner.matchmakingWSState.prototype.updateNumberPlayers(msg.content);;
                break
            case "matchmaking_timer": //Mensaje referente a controlar el temporizador para entrar en una partida en el matchmaking
                PenRunner.matchmakingWSState.prototype.updateTimer(msg.content);
                break
            case "votes"://Mensaje referente a gestionar el número de votos que hay en una sala de prepartida
                PenRunner.matchmakingWSState.prototype.updateNumberOfVotes(msg.content);
                break
            case "matchmaking_end": //Mensaje referente a indicar cuando termina el matchmaking y empieza la partida
                PenRunner.matchmakingWSState.prototype.endMatchmaking(msg.content);
                break
            case "semaforo_timer": //Mensaje referente a controlar el timer del semaforo que aparece antes de la partida
                PenRunner.matchWSState.prototype.updateSemaforo(msg.content);
                break
            case "players_update": //Mensaje referente a cuando actualizamos la información de un jugador
                game.playersDataNew = msg.content;
                PenRunner.matchWSState.prototype.updatePlayers();
                break
            case "match_end": ////Mensaje referente a cuando terminamos la partida y pasamos al estado de puntuaciones
                PenRunner.matchWSState.prototype.endGame();
                break
            case "update_Score"://Mensaje referente a cuando actualizamos la puntuacion de los jugadores en función de su posición de llegada a la meta
                game.player.score += 100 - ((msg.content - 1) * 10);
                PenRunner.matchWSState.prototype.sendPlayerUpdate();
                break
            case "score": //Mensaje referente a controlar todas las gestiones relacionadas con la pantalla de puntuaciones
                game.scoreData = msg.content;
                PenRunner.scoreWSState.prototype.updatePlayers();
                break
            default:
               // console.log("Mensaje con tipo no válido")
                break
        }
    }
}