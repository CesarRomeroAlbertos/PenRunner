package BongoCats.PenRunner;

import java.io.IOException;
import java.util.Collections;
import java.util.HashSet;
import java.util.Set;
import java.util.Timer;
import java.util.TimerTask;

import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.fasterxml.jackson.databind.node.ObjectNode;

public class WebsocketGameHandler extends TextWebSocketHandler {

	private static Set<WebSocketSession> sessions = Collections.synchronizedSet(new HashSet<WebSocketSession>());
	ObjectMapper mapper = new ObjectMapper();
	boolean debug = true;
	Integer jugadores;
	GameController gameController = new GameController();
	Timer timer;

	long startTime;
	int maxTime = 15;
	int semaforoTime = 0;

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

			switch (node.get("type").asText()) {
			case "create_player":
				ObjectNode json = mapper.createObjectNode();
				if (gameController.getPlayers().size() < 4) {
					if (gameController.getPlayers().size() == 0)
						startMatchmakingTimer();
					Player player = gameController.newPlayer();
					ObjectNode jsonPlayer = mapper.createObjectNode();
					jsonPlayer.put("id", player.getId());
					jsonPlayer.put("x", 0);
					jsonPlayer.put("y", 0);
					jsonPlayer.put("score", 0);
					json.put("type", "PLAYER_CREATED");
					json.putPOJO("player", jsonPlayer);
					// json.putPOJO("player", player);
					gameController.players.put(player.getId(), player);
					jugadores = gameController.numPlayers++;

				} else {
					json.put("type", "GAME_CPMPLETE");
				}
				session.sendMessage(new TextMessage(json.toString()));
				session.sendMessage(new TextMessage(jugadores.toString()));
				if (debug) {
					System.out.println("[DEBUG] " + json.toString());
					System.out.println("Numero de jugadores en la sala " + jugadores.toString());
				}
				break;
			case "update_numPlayers":
				jugadores = gameController.numPlayers++;
				session.sendMessage(new TextMessage(jugadores.toString()));
				if (debug) {
					// System.out.println("Numero de jugadores en la sala " + jugadores.toString());
				}
				break;
			case "player_update":
				gameController.updatePlayer(mapper.convertValue(node.get("data"), Player.class));
				break;
			case "meta":
				gameController.metaAdd();
				if (gameController.meta == gameController.numPlayers) {
					ObjectNode jsonmsg = mapper.createObjectNode();
					jsonmsg.put("type", "match_finish");
					sendToAll(jsonmsg);
					timer.cancel();
				}
				break;
			case "score":
				ObjectNode jsonmsg = mapper.createObjectNode();
				jsonmsg.put("type", "score");
				jsonmsg.putPOJO("scores", gameController.getPlayersScores());
				session.sendMessage(new TextMessage(jsonmsg.toString()));
				break;

			default:
				break;
			}
		}
	}

	void sendToAll(ObjectNode json) {
		for (WebSocketSession s : sessions) {
			try {
				s.sendMessage(new TextMessage(json.toString()));
			} catch (IOException e) {
				e.printStackTrace();
			}
		}
	}

	void startMatchmakingTimer() {
		timer = new Timer();
		timer.schedule(new TimerTask() {
			public void run() {
				ObjectNode json = mapper.createObjectNode();
				json.put("type", "matchmaking_timer");
				json.put("data", maxTime);
				maxTime -= 1;

				sendToAll(json);

				if (maxTime <= 0) {
					startSemaforoTimer();
					maxTime = 15;
					timer.cancel();
				}
			}
		}, 0, 1000);
	}

	void startSemaforoTimer() {
		timer = new Timer();
		timer.schedule(new TimerTask() {
			public void run() {
				ObjectNode json = mapper.createObjectNode();
				json.put("type", "semaforo_timer");
				json.put("data", maxTime);
				semaforoTime += 1;

				sendToAll(json);

				if (maxTime <= 0) {
					semaforoTime = 0;
					timer.cancel();
				}
			}
		}, 0, 1000);
	}

	void startPlayersUpdate() {
		timer = new Timer();

		timer.schedule(new TimerTask() {
			public void run() {
				ObjectNode json = mapper.createObjectNode();
				json.put("type", "players_update");
				json.putPOJO("playersData", gameController.players);
				sendToAll(json);
			}
		}, 0, 1000 / 60);
	}

}