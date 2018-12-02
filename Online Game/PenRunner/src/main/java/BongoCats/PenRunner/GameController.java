package BongoCats.PenRunner;

import java.util.Collection;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicLong;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

//import es.urjc.jer.game.Player;


@RestController
public class GameController 
{
	Map<Long, Player> players = new ConcurrentHashMap<Long, Player>();
	AtomicLong nextId = new AtomicLong(0);
	Random rnd = new Random();
	long startTime;
	long currentTime;
	long maxTime;
	
	//devolvemos jugadores
	@GetMapping(value = "/players")
	public Collection<Player> getPlayers() 
	{
		return players.values();
	}
	
	@GetMapping(value = "/players/score")
	public Collection<Player> getPlayersScores() 
	{
		//Collections.sort(players, (o1, o2) -> o1.getScore() - o2.getScore());
		return players.values();
	}
	
	//devolvemos número de jugadores
	@GetMapping(value = "/player/number")
	public int getNumPlayers() 
	{
		return players.size();
	}
	
	//Con este metodo borramos los jugadores al reiniciar la cache, para que siempre que se inicie un nuevo matchmaking, se reestablezcan los jugadores a 0
	@DeleteMapping(value = "/player/{id}")
	public ResponseEntity<Player> deletePlayer(@PathVariable long id) {
		System.out.println("He borrado al jugador");

		Player savedPlayer = players.get(id);
		if (savedPlayer != null) {
			players.remove(savedPlayer.getId());
			return new ResponseEntity<Player>(savedPlayer, HttpStatus.OK);
		} else {
			return new ResponseEntity<Player>(HttpStatus.NOT_FOUND);
		}
	}
	
	// Con POST creamos un nuevo jugador
	@PostMapping(value = "/player")
	@ResponseStatus(HttpStatus.CREATED)
	public Player newPlayer()
	{
		Player player = new Player();
		long id = nextId.incrementAndGet();
		player.setId(id);
		player.setX(0);
		player.setY(0);
		players.put(player.getId(), player);
		System.out.println("He creado al jugador");
		
		return player;
	}
	
	//Con PUT actualizamos la posición de un jugador
	@PutMapping(value = "/player/{id}")
	public ResponseEntity<Player> updatePlayer(@PathVariable long id, @RequestBody Player player) {
		Player savedPlayer = players.get(player.getId());
		if (savedPlayer != null) {
			players.put(id, player);
			return new ResponseEntity<Player>(player, HttpStatus.OK);
		} else {
			return new ResponseEntity<Player>(HttpStatus.NOT_FOUND);
		}
	}
	
	//Mediante este put actualizamos la votacion del mapa seleccionado
	@PostMapping(value = "/voto")
	public int createVote() 
	{		
		Voto voto = new Voto();
		voto.setValor(1);
		return voto.getValor();
	}
	@PutMapping(value = "/voto/{valor}")
	public int updateVote(@PathVariable int valor, @RequestBody Voto voto)
	{
		voto.setValor(valor++);
		if(voto!= null)
			return voto.getValor();
		else
			return 0;
	}
	@PostMapping(value = "/chosenMap")
	public void mapaSeleccionado()
	{
		

	}
	
	@PostMapping(value = "/timer/{time}")
	public void updateTimer(@PathVariable long time)
	{
		startTime = System.currentTimeMillis();
		maxTime = time;
	}
	
	@GetMapping(value="/timer")
	public int getTimer()
	{
		int currentTime = (int) (System.currentTimeMillis()-startTime);
		return currentTime;
	}
	

}
