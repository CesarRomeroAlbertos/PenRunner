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
	long startTime=0;
	long startGameTime;
	long currentTime=0;
	long maxTime;
	long maxGameTime;
	int[] votos = {0,0,0};
	boolean hasStartedTimer = false;
	boolean hasSelectedMap = false;
	int mapSelected;
	int numPlayers=0;
	
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
		return numPlayers;
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
		numPlayers++;
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
	public void updateVote(@PathVariable int valor)
	{
		votos[valor]++;
	}
	@GetMapping(value = "/chosenMap")
	public int mapaSeleccionado()
	{
		if(!hasSelectedMap)
		{
		mapSelected = 0;
		  for ( int i = 1; i < votos.length; i++ )
		  {
			  if(votos[i] == votos[mapSelected])
			  {
				  int rand = rnd.nextInt(100);
				  if(rand>=50)
					  mapSelected = i;
			  }
			  
			  else if ( votos[i] > votos[mapSelected] )
				  mapSelected = i;
		  }
		}
		return mapSelected;
	}
	
	@PostMapping(value = "/timer/{time}")
	public void updateTimer(@PathVariable long time)
	{
		if(!hasStartedTimer)
		{
		startTime = System.currentTimeMillis();
		maxTime = time;
		hasStartedTimer = true;
		}
	}
	
	@GetMapping(value="/timer")
	public int getTimer()
	{
		int currentTime = (int) (System.currentTimeMillis()-startTime);
		return currentTime;
	}
	
	@PostMapping(value = "/game/timer/{time}")
	public void updateGameTimer(@PathVariable long time)
	{
		startGameTime = System.currentTimeMillis();
		maxGameTime = time;
	}
	
	@GetMapping(value="/game/timer")
	public int getGameTimer()
	{
		int currentTime = (int) (System.currentTimeMillis()-startGameTime);
		return currentTime;
	}
}
