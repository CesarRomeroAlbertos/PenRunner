# PenRunner
This repository is for an university project making a simple online game with javascript.
Título: Pen Runner
Estudio: BongoCats
Plataforma: PC
Versión: 0.5
Sinopsis de Jugabilidad y Contenido:

	Pen Runner es un juego de carreras multijugador competitivo. Es una interpretación de las carreras de chapas o carreras de bolis en una hoja de papel, juegos de un ambiente escolar. Todo esto cambiando las mecánicas ligeramente para adaptarlo a la plataforma.

Categoría:

	Carreras. Recuerda a la idea de jugabilidad del Mario Kart, por los diferentes “power-ups” que se tienen pensado incluir; o incluso, por su mecánica, a un juego de golf por el control que se tiene del vehículo.

Mecánica:

	El jugador controlará un vehículo determinando la dirección en la que se va a desplazar y la fuerza con la que va a ser lanzado. Cogiendo la dirección del ratón tenemos un arco cuya bisectriz siempre apunta al ratón, y dentro de dicho arco la flecha se desplazará rápidamente, fijando su dirección con el primer click del jugador. Después tendremos un medidor indicando la fuerza que irá subiendo y bajando y se quedará en el punto que marque el jugador con su segundo click. Todo esto simultáneamente funciona para todos los jugadores, de forma que tienen que apresurarse para hacer rápido sus lanzamientos y así ir por delante de sus rivales, pero con las prisas se arriesgan a hacer un mal lanzamiento, pues la dirección y la fuerza dependen de la velocidad de reacción del jugador. Los jugadores empezarán en una línea inicial y tendrán que entrar en la zona pasada la línea de meta para que se considere que han ganado. Además habrá distintos power ups y desventajas delimitados en zonas en las que si cae el jugador se le aplicarán sus efectos.

Tecnología:

	Phaser, javascript y adobe audition.

Público:

	El juego va dirigido a todos los públicos, no tiene un perfil específico de jugador. Presenta un enfoque casual para sesiones de juego cortas entre varias personas, con una temática competitiva pero con un tono relajado.

Historial de versiones: 
	
	Versión 0.0: Redacción del documento en primera instancia, explicando la visión general del mismo. Móstoles, 19 de Septiembre de 2018.

Cámara:

	Cenital en 2D y tercera persona. Se utilizará únicamente el ratón.

Controles:

	El juego se controla únicamente con el ratón. Se nos mostrará un arco y una flecha dentro de dicho arco que empieza en una posición aleatoria del arco y que gira rápidamente en dicho arco. El arco como tal se orientará en torno al ratón, apuntando en todo momento su bisectriz al cursor. Cuando el jugador de un click la posición de la flecha se fijará y entonces pasará a decidirse la potencia del tiro. Un medidor irá subiendo y bajando rápidamente y el tamaño de la flecha escalará acorde con el tamaño actual de dicho medidor. Con el siguiente click del jugador se decidirá la potencia y entonces el vehículo del jugador se desplazará acorde a la dirección y potencia elegidos.

Puntuación:

	Se darán puntos en base a la posición de llegada a la meta y el número de jugadores. De esta forma el primer jugador en llegar a la meta recibirá tantos puntos como jugadores haya, el siguiente uno menos y así hasta llegar al último. Este sistema de puntuación sólo se aplica si se juegan varias carreras sucesivas, para una sola carrera sólo es relevante la posición final del jugador.

Guardar/Cargar:

	En este juego no es necesario implementar una función de guardado y cargado de partida, al menos no en la primera versión que se plantea del juego.

Estados del juego:

	El juego tendrá las siguientes pantallas: Menú principal, pantalla de juego y menú de opciones, al que se puede acceder desde el menú principal y desde la pantalla del juego. Habrá un menú durante la partida que nos permitirá abandonar la partida pero no la pausará ya que se trata de un juego online.

Interfaces:

	Menú principal: Nos permite acceder al juego, al menú de opciones y salir.
	Menú opciones: Nos da la opción de configurar varios aspectos del juego, como el volumen del mismo.
	Menú in-game: Se trata del menú que aparece cuando quieres pausar el juego. Al ser un juego multijugador competitivo, dicho menú no congelará el juego, sino que simplemente nos dará paso a poder acceder al menú de opciones y también la opción de salir de la partida, volviendo al menú principal.
	Pantalla de juego: Esta será la pantalla principal del juego, se verá todo el desarrollo del juego. No poseerá ningún tipo de HUD más que los indicadores de dirección (el arco que indica la dirección a la que nos moveremos) y de potencia. A partir de esta pantalla sólo podremos acceder al menú pausa.
	
Niveles: 

	Los distintos niveles que tendrá el juego, serán escenarios con diferentes temáticas y ambientaciones. En algunos casos, representarán escenarios cotidianos; y en otros, escenarios más abstractos. No obstante, siempre tendrá un estudio detrás, para que no resulte en escenarios demasiado confusos o desorientadores. Siempre se tendrá una visión explícita de donde se encuentra el camino a seguir.
	Si es la primera vez que se juega al juego, antes de poder jugar en modo competitivo se incluirá un pequeño tutorial para enseñar al jugador las mecánicas de juego. En este tutorial se explicará cómo funcionan los potenciadores de dirección y de fuerza, así como las funciones de los distintos “power-ups” que habrá. Este tutorial se ejecutará automáticamente al darle al botón de “Jugar”. Si no es la primera vez que se juega, el nivel o escenario donde se realizará la partida será sometido a votación por parte de los jugadores, o bien, será aleatorio.
	Dentro del juego no existe un enemigo al uso, es decir, no existen NPCs hostiles. El enemigo sería el otro u otros jugadores que haya jugando contra ti.
	Existen unos objetos, llamados “power-ups”, como ya se mencionó antes, que serán consumibles por cualquiera de los jugadores de la partida, y que tendrán distintas ventajas para el jugador que lo consuma.
	Respecto a la música y los efectos de sonido, tanto el menú principal como la pantalla de juego tendrán una música de fondo. Todavía no está claro si la música utilizada será original del equipo, o bien se buscará libre de copyright.

Progreso del Juego:	

	El juego no tiene ningún progreso, hablando en un ámbito de juego de historia. El único progreso que se puede evaluar es la evolución de la puntuación de los jugadores a medida que van haciendo carreras. A continuación se muestra un gráfico con un ejemplo de cómo podría ser la progresión en nuestro juego.

Personajes y Enemigos:

	Al ser un juego multijugador competitivo, no hay unos personajes y/o enemigos bien diferenciados o definidos. Cuando tú te unes a una partida, cada jugador tendrá un personaje, elegido aleatoriamente; ese será el número total de personajes que habrá en la partida, que se representará con la imagen de algún tipo de vehículo.
	Cuando hablamos de los enemigos, habría que mencionar que los enemigos son los demás jugadores que están en la partida. No hay enemigos NPCs, ni de ningún otro tipo.
	Podría considerarse enemigo algún obstáculo animado que pudiese estar incluído en alguno de los mapas que se jugarán. Aún así, todavía no se ha decidido si esto último se incluirá.


