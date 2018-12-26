package BongoCats.PenRunner;

import java.util.Collections;
import java.util.HashSet;
import java.util.Set;

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
				ObjectNode json = mapper.createObjectNode();

				
				switch (node.get("type").asText()) {
				case "create_player":
					if (gameController.getPlayers().size() < 4) {
						Player player = gameController.newPlayer();

						ObjectNode jsonPlayer = mapper.createObjectNode();
						jsonPlayer.put("id", player.getId());
						jsonPlayer.put("x", 0);
						jsonPlayer.put("y", 0);
						jsonPlayer.put("score", 0);

						json.put("type", "PLAYER_CREATED");
						json.putPOJO("player", jsonPlayer);
						//json.putPOJO("player", player);
						gameController.players.put(player.getId(), player);
						jugadores = gameController.numPlayers++;
					} else {
						json.put("type", "GAME_CPMPLETE");
					}
					session.sendMessage(new TextMessage(json.toString()));
					if (debug) {
						System.out.println("[DEBUG] " + json.toString());
						System.out.println("Numero de jugadores en la sala " + jugadores.toString());
					}
					break;
				case "update_numPlayers":
					session.sendMessage(new TextMessage(jugadores.toString()));
					break;

				default:
					break;
				}
			}
		}
		
		
}