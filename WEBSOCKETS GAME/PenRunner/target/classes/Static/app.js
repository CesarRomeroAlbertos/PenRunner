// API de WebSocket
// https://developer.mozilla.org/es/docs/Web/API/WebSocket

debug = {
    ws: 1
}

ws = new WebSocket('ws://localhost:8080/penrunner');

//Un monitor de eventos que es llamado cuando el estado readyState de la conexión Websocket cambia a OPEN. Esto indica que la conexión está lista para enviar y recibir datos. El evento es uno simple con el nombre "open".
/*ws.onopen = function (event) {
    if (debug.ws) {
        console.log('[DEBUG-WS] Se ha establecido conexion con el servidor.')
    }
    data = {
        type: 'JOIN'
    }
    this.send(JSON.stringify(data))

}*/

// Un monitor de eventos que es llamado cuando un error ocurre. Esto es un evento simple llamado "error"
ws.onerror = function (error) {
    console.log('[DEBUG-WS] Ha ocurrido un error: ' + error)
}

// Un monitor de eventos que atiende una llamada cuando la conexión del WebSocket cambia a un estado CERRADO (CLOSED). El monitor recibe un CloseEvent llamado "cerrado".
ws.onclose = function (event) {
    if (debug.ws) {
        console.log('[DEBUG-WS] Se ha cerrado la conexion.')
    }
}

// Un monitor de eventos que es llamado cuando un mensaje es recibido desde un servidor. El monitor recibe un objeto MessageEvent llamado "mensaje".
ws.onmessage = function (message) {
    if (debug.ws) {
        console.log('[DEBUG-WS] Se ha recibido un mensaje: ' + message.data)
    }

    var msg = JSON.parse(message.data)

    console.log('INFO RECIBIDA /n' + msg)

    if (game.hasJoined === true) {
        switch (msg.type) {
            case "player_created":
                game.player = msg.content.player;
                break
            case "GAME_COMPLETE":
                console.log('##### GAME IS COMPLETE #####')
                break
            case "UPDATE_STATE":
                console.log('!!!!! GAME SENDS UPDATE !!!!!')
                break
            case "numPlayers":
                game.numPlayers = msg.content;
                PenRunner.matchmakingWSState.prototype.updateNumberPlayers(msg.content);;
                break
            case "matchmaking_timer":
                PenRunner.matchmakingWSState.prototype.updateTimer(msg.content);
                break
            case "votes":
                PenRunner.matchmakingWSState.prototype.updateNumberOfVotes(msg.content);
                break
            case "matchmaking_end":
                PenRunner.matchmakingWSState.prototype.endMatchmaking(msg.content);
                break
            case "semaforo_timer":
                PenRunner.matchWSState.prototype.updateSemaforo(msg.content);
                break
            case "players_update":
                game.playersDataNew = msg.content;
                PenRunner.matchWSState.prototype.updatePlayers();
                break
            case "match_end":
                PenRunner.matchWSState.prototype.endGame();
                break
            case "update_Score":
                game.player.score += 100 - ((msg.content - 1) * 10);
                PenRunner.matchWSState.prototype.sendPlayerUpdate();
                break
            case "score":
                game.scoreData = msg.content;
                PenRunner.scoreWSState.prototype.updatePlayers();
                break
            default:
                console.log("Mensaje con tipo no válido")
                break
        }
    }
}