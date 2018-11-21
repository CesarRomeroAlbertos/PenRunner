package BongoCats.PenRunner;

import java.util.Collection;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;


@RestController
public class GameController 
{
	Map<Long, Player> players = new ConcurrentHashMap<Long, Player>();
	AtomicLong nextId = new AtomicLong(0);
	Random rnd = new Random();
	
	//devolvemos número de jugadores
	@GetMapping(value = "/player")
	public Collection<Player> getPlayers() 
	{
		return players.values();
	}
	
	// Con POST creamos un nuevo jugador
	@PostMapping(value = "/player")
	@ResponseStatus(HttpStatus.CREATED)
	public Player newPlayer()
	{
		Player player = new Player();
		long id = nextId.incrementAndGet();
		player.setId(id);
		player.setX(rnd.nextInt(700));
		player.setY(rnd.nextInt(500));
		players.put(player.getId(), player);
		return player;
	}
	
	//Con PUT actualizamos la posición de un jugador
	@PutMapping(value = "/game/{id}")
	public ResponseEntity<Player> updatePlayer(@PathVariable long id, @RequestBody Player player) {
		Player savedPlayer = players.get(player.getId());
		if (savedPlayer != null) {
			players.put(id, player);
			return new ResponseEntity<Player>(player, HttpStatus.OK);
		} else {
			return new ResponseEntity<Player>(HttpStatus.NOT_FOUND);
		}
	}
	
	
}
