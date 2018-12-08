package BongoCats.PenRunner;

import java.util.ArrayList;
import java.util.Collection;
import java.util.Collections;
import java.util.List;
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


@RestController
public class GameController 
{
	Map<Long, Player> players = new ConcurrentHashMap<Long, Player>(); //Array con todos los jugadores
	AtomicLong nextId = new AtomicLong(0);
	Random rnd = new Random();
	short mapaVotado; //Identificador que nos indica el mapa más votado en matchMaking
	long startTime=0; 
	long startGameTime;
	long currentTime=0;
	long maxTime; //tiempo máximo de espera
	long maxGameTime;
	int[] votos = {0,0,0}; //Array de los votos de cada mapa en matchmaking
	int meta = 0; //Indica cuantos jugadores han llegado a la meta
	boolean hasStartedTimer = false;
	boolean hasSelectedMap = false;
	boolean startedMatch; //Variable que controla si la partida ha empezado o no
	int mapSelected;
	int numPlayers=0;
	
	//Devolvemos la información de todos los jugadores que haya en ese momento
	@GetMapping(value = "/players")
	public Collection<Player> getPlayers() 
	{
		return players.values();
	}
	//Esta funcion devuelve la puntuación de todos los jugadores que hay en la partida en ese momento
	@GetMapping(value = "/players/score")
	public Collection<Player> getPlayersScores() 
	{
		List<Player> temp = new ArrayList<Player>();
		temp.addAll(players.values());
		temp.sort((o1, o2) -> o2.getScore() - o1.getScore());
		return temp;
	}
	
	//Devolvemos el número de jugadores que hay en la partida en este momento
	@GetMapping(value = "/player/number")
	public int getNumPlayers() 
	{
		return numPlayers;
	}
	
	//Devuelve si la partida ya ha empezado o no
	@GetMapping(value = "/isStarted")
	public boolean isStarted()
	{
		startedMatch = true;
		return startedMatch;
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
	
	//Esta función nos permite crear un jugador y guardar su información en el servidor, estableciendo todos los valores que queramos
	@PostMapping(value = "/player")
	@ResponseStatus(HttpStatus.CREATED)
	public Player newPlayer()
	{
		Player player = new Player();
		long id = nextId.incrementAndGet();
		player.setId(id);
		player.setX(0);
		player.setY(0);
		player.setArrived(false);
		players.put(player.getId(), player);
		System.out.println("He creado al jugador");
		numPlayers++;
		return player;
	}
	//Esta función devuelve la variable meta aumentada, que quiere decir que ha llegado un jugador a la meta, y así se ve en todos los jugadores
	@GetMapping(value = "/meta/add")
	public int metaAdd()
	{
		meta++;
		return meta;
	}
	//Devuelve el número de jugadores que han llegado a la meta
	@GetMapping(value = "/meta")
	public int meta()
	{
		return meta;
	}
	
	//Mediante esta función nos permite actualizar la información de un jugador en el servidor, en concreto la posición
	@PutMapping(value = "/player/{id}")
	public ResponseEntity<Player> updatePlayer(@PathVariable long id, @RequestBody Player player) {
		
		players.put(id, player);
		//System.out.println(players);
		return new ResponseEntity<Player>(player, HttpStatus.OK);
		
	}
	
	//Esta función nos permite crear un voto único para cada jugador que entra nuevo en la partida
	@PostMapping(value = "/voto")
	public int createVote() 
	{		
		Voto voto = new Voto();
		voto.setValor(1);
		return voto.getValor();
	}
	
	//devuelve el número de votos de todos los mapas actualizados
	@GetMapping(value = "/voto")
	public int[] getRealVotes()
	{
		return votos;

	}
	//Actualiza en el servidor el número de votos del mapa número 1
	@GetMapping(value = "/voto/voto1")
	public int getVote1()
	{
		votos[0]++;
		return votos[0];
	}
	//Actualiza en el servidor el número de votos del mapa número 2
	@GetMapping(value = "/voto/voto2")
	public int getVote2()
	{
		votos[1]++;
		return votos[1];
	}
	//Actualiza en el servidor el número de votos del mapa número 3
	@GetMapping(value = "/voto/voto3")
	public int getVote3()
	{
		votos[2]++;
		return votos[2];
	}

	//cuando se acaba el tiempo en matchmaking, se llama a esta función para actualizar el mapa que se ha elegido en el server, cogiendo
	//el JSON desde el propio server, y mandarlo de nuevo al juego, para que se cargue el mismo mapa para todos los jugadores
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
		  	hasSelectedMap = true;
		}
		return mapSelected;
	}
	
	
	//Actualiza la cuenta atras para que empiece la partida
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
	
	//devuelve el valor que tiene el contador en el server, para que tenga el mismo valor para todos los jugadores
	@GetMapping(value="/timer")
	public int getTimer()
	{
		int currentTime = (int) (System.currentTimeMillis()-startTime);
		return currentTime;
	}
	
	//Actualiza el timer del semaforo de una partida
	@PostMapping(value = "/game/timer/{time}")
	public void updateGameTimer(@PathVariable long time)
	{
		startGameTime = System.currentTimeMillis();
		maxGameTime = time;
	}
	//Devuelve al juego el temporizador del semaforo, para que se actualice en todos los jugadores por igual
	@GetMapping(value="/game/timer")
	public int getGameTimer()
	{
		int currentTime = (int) (System.currentTimeMillis()-startGameTime);
		return currentTime;
	}
}
