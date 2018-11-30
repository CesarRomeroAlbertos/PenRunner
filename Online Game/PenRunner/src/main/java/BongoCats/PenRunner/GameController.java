package BongoCats.PenRunner;

import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
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
	List<TrackData> tracks;
	List<String> trackJsonDirections = new ArrayList<String>() {{
	    add(".../resources/Static/Src/json/track1.json");
	    add(".../resources/Static/Src/json/track2.json");
	    add(".../resources/Static/Src/json/track3.json");
	}};;
	
	
	//devolvemos número de jugadores
	@GetMapping(value = "/player")
	public int getNumPlayers() 
	{
		return players.size();
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
	@PutMapping(value = "/game/{numeroDeVotos1}")
	public ResponseEntity<Integer> updateVote(@RequestBody int numeroDeVotos) 
	{
		
		if (numeroDeVotos<9) 
		{
			numeroDeVotos++;
			return new ResponseEntity<Integer>(numeroDeVotos, HttpStatus.OK);
		} 
		else 
		{
			return new ResponseEntity<Integer>(HttpStatus.NOT_FOUND);
		}
	}
	/*public int updateVote()
	{
		int voto = 1;
		return voto;
	}*/
	
	@GetMapping(value = "/track/{id}")
	public TrackData getTrack(@PathVariable long id)
	{
		if(tracks.size()==0)
		{
			FillTrackList();
		}
		return tracks.get((int)id);
	}
	
	private void FillTrackList()
	{
		for(int i = 0; i<trackJsonDirections.size();i++)
		{
			
		}
	}
}