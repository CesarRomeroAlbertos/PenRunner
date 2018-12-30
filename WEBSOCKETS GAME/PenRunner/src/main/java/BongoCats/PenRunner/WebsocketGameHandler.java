package BongoCats.PenRunner;

import java.io.IOException;
import java.util.ArrayList;
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
				if (gameController.numPlayers < 4) {
					if (gameController.getPlayers().size() == 0)
						startMatchmakingTimer();
					Player player = gameController.newPlayer();
					json = mapper.createObjectNode();
					json.put("type", "player_created");

					ObjectNode jsonPlayer = mapper.createObjectNode();
					ObjectNode jsonPlayerContent = mapper.createObjectNode();
					jsonPlayerContent.put("id", player.getId());
					jsonPlayerContent.put("x", player.getX());
					jsonPlayerContent.put("y", player.getY());
					jsonPlayerContent.put("score", player.getScore());
					jsonPlayer.putPOJO("player", jsonPlayerContent);
					json.putPOJO("content", jsonPlayer);
					// gameController.players.put(player.getId(), player);
					gameController.numPlayers++;

					ObjectNode jsonNumPlayer = mapper.createObjectNode();
					jsonNumPlayer.put("type", "numPlayers");
					jsonNumPlayer.put("content", gameController.numPlayers);
					sendToAll(jsonNumPlayer);

				} else {
					json.put("type", "GAME_COMPLETE");
				}
				session.sendMessage(new TextMessage(json.toString()));
				if (debug) {
					System.out.println("[DEBUG] " + json.toString());
					System.out.println("Numero de jugadores en la sala " + gameController.numPlayers);
				}
				break;
			case "vote":
				gameController.getVote(node.get("data").asInt());
				ObjectNode votejsonmsg = mapper.createObjectNode();
				votejsonmsg.put("type", "votes");
				votejsonmsg.putPOJO("content", mapper.writeValueAsString(gameController.votos));
				sendToAll(votejsonmsg);

				break;
			case "player_update":
				gameController.updatePlayer(mapper.convertValue(node.get("data"), Player.class));
				break;
			case "meta":
				gameController.metaAdd();
				if (gameController.meta == gameController.numPlayers) {
					ObjectNode jsonmsg = mapper.createObjectNode();
					jsonmsg.put("type", "match_end");
					sendToAll(jsonmsg);
					timerUpdate.cancel();
					timerUpdate.purge();
				}
				break;
			case "score":
				ObjectNode jsonmsg = mapper.createObjectNode();
				jsonmsg.put("type", "score");
				jsonmsg.put("content", mapper.writeValueAsString(gameController.getPlayersScores()));
				session.sendMessage(new TextMessage(jsonmsg.toString()));
				break;

			default:
				break;
			}
		}
	}

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