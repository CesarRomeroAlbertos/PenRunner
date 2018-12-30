package BongoCats.PenRunner;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebsocketGameHandler extends TextWebSocketHandler {

	private static Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<WebSocketSession>());
	ObjectMapper mapper = new ObjectMapper();
	boolean debug = true;
	GameController gameController = new GameController();
	Timer timer;
	Timer timerSemaforo;
	Timer timerUpdate;

	long startTime;
	int maxTime = 15;
	int semaforoTime = 0;
	int finished = 0;

	// Invoked after WebSocket negotiation has succeeded and the WebSocket
	// connection is opened and ready for use.
	public void afterConnectionEstablished(WebSocketSession session) throws Exception {
		sessions.add(session);
	}

	// Invoked after the WebSocket connection has been closed by either side, or
	// after a transport error has occurred. Although the session may technically
	// still be open, depending on the underlying implementation, sending messages
	// at this point is discouraged and most likely will not succeed.
	public void afterConnectionClosed(WebSocketSession session, CloseStatus status) throws Exception {
		sessions.remove(session);
	}

	// Invoked when a new WebSocket message arrives.
	protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {

		synchronized (sessions) {
			JsonNode node = mapper.readTree(message.getPayload());
			//Este switch decide que hacer en función de que mensaje le llega desde el cliente. Cuando llega un mensaje desde el mismo, leemos el tipo del mensaje
			//y en funcion de eso, podemos identificarlo y hacer unas cosas u otras
			switch (node.get("type").asText()) {
			//Si llega un mensaje de este tipo, creamos un jugador, para ello creamos un JSON donde guardaremos toda la informacion relacionadacon él
			case "create_player": 
				ObjectNode json = mapper.createObjectNode();
				if (gameController.numPlayers < 4) {
					if (gameController.numPlayers == 0)
						startMatchmakingTimer();
					Player player = gameController.newPlayer();
					json = mapper.createObjectNode();
					json.put("type", "player_created");
					
					ObjectNode jsonPlayer = mapper.createObjectNode();
					ObjectNode jsonPlayerContent = mapper.createObjectNode();
					//Una vez creado el personaje desde la clase Player, metemos la informacion en elJSON que hemos creado antes
					jsonPlayerContent.put("id", player.getId());
					jsonPlayerContent.put("x", player.getX());
					jsonPlayerContent.put("y", player.getY());
					jsonPlayerContent.put("score", player.getScore());
					jsonPlayer.putPOJO("player", jsonPlayerContent);
					json.putPOJO("content", jsonPlayer);

					

				} else {
					json.put("type", "GAME_COMPLETE");
				}
				//Aquí mandamos un mensaje a todos los clientes conectados, que contiene la informacion del jugador creado
				session.sendMessage(new TextMessage(json.toString()));
				if (debug) {
					//Testeo
					System.out.println("[DEBUG] " + json.toString());
					System.out.println("Numero de jugadores en la sala " + gameController.numPlayers);
				}
				break;
			//En este caso controlamos la votacion de los mapas en el matchmaking. Leemos la informacion que nos llega desde los clientes, y se la mandamos 
			//a los demás. Después guardamos esa información para almacenarla en las variables del servidor, y enviamos un mensaje a  los clientes para que se 
			//actualice la información de las votaciones.
			case "vote":
				gameController.getVote(node.get("data").asInt());
				ObjectNode votejsonmsg = mapper.createObjectNode();
				votejsonmsg.put("type", "votes");
				votejsonmsg.putPOJO("content", mapper.writeValueAsString(gameController.votos));
				sendToAll(votejsonmsg);
				Integer numero = gameController.votos[votejsonmsg.asInt()];
				//Aqui enviamos el mensaje a los clientes
				session.sendMessage(new TextMessage(numero.toString()));
				if(debug)
					System.out.println(gameController.votos[votejsonmsg.asInt()]);

				break;
			//En este caso, actualizamos la información de un jugador en una partida.	
			case "player_update":
				gameController.updatePlayer(mapper.convertValue(node.get("data"), Player.class));
				break;
			//En esta parte del switch entramos cuando el mensaje que queremos enviar a los clientes es para informar de que un jugador ha llegado a la meta
				//por lo tanto se actualizan la puntuacion de losjugadores y se manda a los demas, para qur todos se enteren de que jugador ha llegado a la meta.
			case "meta":
				int n = gameController.metaAdd();
				ObjectNode jsonMeta = mapper.createObjectNode();
				jsonMeta.put("type", "update_Score");
				jsonMeta.put("content", n);
				session.sendMessage(new TextMessage(jsonMeta.toString()));
				if (gameController.meta == gameController.numPlayers) {
					ObjectNode jsonmsg = mapper.createObjectNode();
					jsonmsg.put("type", "match_end");
					sendToAll(jsonmsg);
					timerUpdate.cancel();
					timerUpdate.purge();
				}
				break;
				//A diferencia del caso de arriba, aqui entramos cuando vamos a guardar la informacion de un jugador, no cuando vamos a actualizarla. Para ello,
				//creamos una lista de jugadores, donde vamos a guardar la informacion actualizada de las puntuaciones, con respecto a los demas jugadores,
			case "score":
				ObjectNode jsonmsg = mapper.createObjectNode();
				jsonmsg.put("type", "score");
				Collection<Player> temp = gameController.getPlayersScores();
				List<Player> tempL = new ArrayList<Player>();
				for(Player p : temp)
				{
					tempL.add(p);
				}
				jsonmsg.putPOJO("content", mapper.writeValueAsString(tempL));
				//Aqui enviamos la respuesta a los clientes
				session.sendMessage(new TextMessage(jsonmsg.toString()));
				finished++;
				if(finished >= gameController.numPlayers)
				{
					finished = 0;
					gameController.deletePlayers();
				}
				break;
				//En este caso entramos cuando se incorpora un nuevo jugador a la sesion de matchmaking, es decir, hay qye actualizar el numero de jugadores en el 
				//servidor, para que al jugar la partida, puedan crearse todos los jugadores correctamente
			case "numPlayers":
				ObjectNode jsonNumPlayer = mapper.createObjectNode();
				gameController.numPlayers++;
				Integer numero2 = gameController.numPlayers;
				jsonNumPlayer.put("type", "numPlayers");
				jsonNumPlayer.put("content", numero2);
				sendToAll(jsonNumPlayer);
				session.sendMessage(new TextMessage(jsonNumPlayer.toString()));
				break;
				

			default:
				break;
			}
		}
	}
	//Esta función es la encargada de enviar un mensaje desde el servidor a todos los clientes que estén conectados en ese momento
	void sendToAll(ObjectNode json) {
		synchronized (sessions) {
			for (WebSocketSession s : sessions) {
				try {
					s.sendMessage(new TextMessage(json.toString()));
				} catch (IOException e) {
					e.printStackTrace();
				}
			}
		}
	}
	//Esta funcion inicia el timer de matchmaking para que empiece a contar hacia atras
	void startMatchmakingTimer() {
		synchronized (sessions) {
			timer = new Timer();
			timer.schedule(new TimerTask() {
				public void run() {
					ObjectNode json = mapper.createObjectNode();
					json.put("type", "matchmaking_timer");
					json.put("content", maxTime);
					maxTime -= 1;

					sendToAll(json);

					if (maxTime <= 0) {
						ObjectNode endTimerjson = mapper.createObjectNode();
						endTimerjson.put("type", "matchmaking_end");
						endTimerjson.put("content", gameController.mapaSeleccionado());
						sendToAll(endTimerjson);
						startSemaforoTimer();
						maxTime = 15;
						timer.cancel();
						timer.purge();
					}
				}
			}, 0, 1000);
		}
	}
	//Esta funcion hace algo parecido a la funcion anterior, pero con respecto al semaforo que aparece en match
	void startSemaforoTimer() {
		synchronized (sessions) {
			timerSemaforo = new Timer();
			timerSemaforo.schedule(new TimerTask() {
				public void run() {
					ObjectNode json = mapper.createObjectNode();
					json.put("type", "semaforo_timer");
					json.put("content", semaforoTime);
					semaforoTime += 1;

					sendToAll(json);

					if (semaforoTime >= 6) {
						semaforoTime = 0;
						startPlayersUpdate();
						timerSemaforo.cancel();
						timerSemaforo.purge();
					}
				}
			}, 0, 1000);
		}
	}
	//Esta función se encarga de actualizar la informacion de los personajes cuando estamos jugando una partida. Para ello, creamos un objeto de tipo JSON
	// y metemos el mensaje recibido de tipo players_update en el array de jugadores, que contendrá, entonces, la información necesaria actualizada.
	void startPlayersUpdate() {
		synchronized (sessions) {
			timerUpdate = new Timer();

			timerUpdate.schedule(new TimerTask() {
				public void run() {
					ObjectNode json = mapper.createObjectNode();
					json.put("type", "players_update");
					List<Player> temp = new ArrayList<Player>();
					for(Player p : gameController.players.values())
					{
						temp.add(p);
					}
					try {
						json.putPOJO("content", mapper.writeValueAsString(temp));
					} catch (JsonProcessingException e) {
						// TODO Auto-generated catch block
						e.printStackTrace();
					}
					sendToAll(json);
				}
			}, 0, 1000 / 60);
		}
	}

}