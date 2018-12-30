// API de WebSocket
// https://developer.mozilla.org/es/docs/Web/API/WebSocket

debug = {
    ws: 1
}


//Un monitor de eventos que es llamado cuando el estado readyState de la conexión Websocket cambia a OPEN. Esto indica que la conexión está lista para enviar y recibir datos. El evento es uno simple con el nombre "open".
ws.onopen = function (event) {
    if (debug.ws) {
        console.log('[DEBUG-WS] Se ha establecido conexion con el servidor.')
    }
    data = {
        type: 'JOIN'
    }
    this.send(JSON.stringify(data))

}

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

    switch (msg.type) {
        case "player_created":
            game.player = msg.data;
            break
        case "GAME_COMPLETE":
            console.log('##### GAME IS COMPLETE #####')
            break
        case "UPDATE_STATE":
            console.log('!!!!! GAME SENDS UPDATE !!!!!')
            break
        case "numPlayers":
            game.numPlayers = msg.data;
        break
        case "matchmaking_timer":
            PenRunner.matchmakingWSState.updateTimer(msg.data);
            break
        case "votes":
            PenRunner.matchmakingWSState.prototype.updateNumberOfVotes(msg.data);
            break
        case "matchmaking_end":
            PenRunner.matchmakingWSState.prototype.endMatchmaking(msg.data);
            break
        case "semaforo_timer":

            break
        case "players_update":
            game.playersDataNew = msg.playersData;
            PenRunner.matchWSState.updatePlayers();
            break
        case "match_end":
            PenRunner.matchWSState.updateMeta();
            break
        case "score":

            break
        default:
            console.log("Mensaje con tipo no válido")
            break
    }
}