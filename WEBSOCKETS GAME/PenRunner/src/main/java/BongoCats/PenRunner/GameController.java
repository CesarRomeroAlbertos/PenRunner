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
	public int meta = 0; //Indica cuantos jugadores han llegado a la meta
	boolean hasStartedTimer = false;
	boolean hasSelectedMap = false;
	boolean startedMatch; //Variable que controla si la partida ha empezado o no
	int mapSelected;
	int numPlayers = 0;
	
	//Devolvemos la información de todos los jugadores que haya en ese momento
	public Collection<Player> getPlayers() 
	{
		return players.values();
	}
	//Esta funcion devuelve la puntuación de todos los jugadores que hay en la partida en ese momento
	public Collection<Player> getPlayersScores() 
	{
		List<Player> temp = new ArrayList<Player>();
		temp.addAll(players.values());
		temp.sort((o1, o2) -> o2.getScore() - o1.getScore());
		return temp;
	}
	
	//Devolvemos el número de jugadores que hay en la partida en este momento
	public int getNumPlayers() 
	{
		return numPlayers;
	}
	
	//Devuelve si la partida ya ha empezado o no
	public boolean isStarted()
	{
		startedMatch = true;
		return startedMatch;
	}
	
	//Con este metodo borramos los jugadores al reiniciar la cache, para que siempre que se inicie un nuevo matchmaking, se reestablezcan los jugadores a 0.
	//También establecemos que los votos de los mapas se pongan a 0 y que reinicie las ids de los jugadores. Básicamente, que vuelve a reiniciar todo el proceso
	//para que se pueda volver a jugar otra partida como si fuera desde el principio
	public void deletePlayers() {
		System.out.println("He borrado a los jugadores");
		if(numPlayers > 0) {
		for(int i = 0; i<players.size(); i++)
		{
			players.remove(i);
			numPlayers--;
			nextId.set(0);
			votos[1] = 0;
			votos[2] = 0;
			votos[0] = 0;
		}
		if(hasSelectedMap)
		{
			hasSelectedMap = false;
			votos[0]=0;
			votos[1]=0;
			votos[2]=0;
		}
	}
	
	}
	
	//Esta función nos permite crear un jugador y guardar su información en el servidor, estableciendo todos los valores que queramos
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
		//numPlayers++;
		return player;
	}
	//Esta función devuelve la variable meta aumentada, que quiere decir que ha llegado un jugador a la meta, y así se ve en todos los jugadores
	public int metaAdd()
	{
		meta++;
		return meta;
	}
	//Devuelve el número de jugadores que han llegado a la meta
	public int meta()
	{
		return meta;
	}
	
	//Mediante esta función nos permite actualizar la información de un jugador en el servidor, en concreto la posición
	public void updatePlayer(Player player) {
		
		players.put(player.getId(), player);
		//System.out.println(players);
		
	}
	
	//Esta función nos permite crear un voto único para cada jugador que entra nuevo en la partida
	public int createVote() 
	{		
		Voto voto = new Voto();
		voto.setValor(1);
		return voto.getValor();
	}
	
	public void getVote(int vote)
	{
		votos[vote]++;
	}

	//cuando se acaba el tiempo en matchmaking, se llama a esta función para actualizar el mapa que se ha elegido en el server, cogiendo
	//el JSON desde el propio server, y mandarlo de nuevo al juego, para que se cargue el mismo mapa para todos los jugadores
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
	public void updateTimer(long time)
	{
		if(!hasStartedTimer || numPlayers <= 1)
		{
			startTime = System.currentTimeMillis();
			maxTime = time;
			hasStartedTimer = true;
		}
	}
	
	//devuelve el valor que tiene el contador en el server, para que tenga el mismo valor para todos los jugadores
	public int getTimer()
	{
		int currentTime = (int) (System.currentTimeMillis()-startTime);
		return currentTime;
	}
	
	//Actualiza el timer del semaforo de una partida
	public void updateGameTimer(@PathVariable long time)
	{
		startGameTime = System.currentTimeMillis();
		maxGameTime = time;
	}
	//Devuelve al juego el temporizador del semaforo, para que se actualice en todos los jugadores por igual
	public int getGameTimer()
	{
		int currentTime = (int) (System.currentTimeMillis()-startGameTime);
		return currentTime;
	}
}
