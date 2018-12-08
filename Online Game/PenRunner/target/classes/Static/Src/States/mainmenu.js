PenRunner.menuState = function (game) { }

PenRunner.menuState.prototype =
	{
		create: function () {
			game.stage.backgroundColor = '#182d3b'; //Establecemos un color de fondo, que no se ve por el sprite del background

			var background = game.add.tileSprite(0, 0, 800, 600, 'background'); //Ponemos una imagen de fondo

			//Asignamos los tres botones que están en el menú principal a las variables creadas previamente
			var buttonStartLocalMenu = game.add.button(game.world.x + 160, 370, 'buttonStartLocalMenu', this.startLocalMenu, this, 1, 0, 2);
			var buttonStartOnlineMenu = game.add.button(game.world.x + 440, 370, 'buttonStartOnlineMenu', this.startOnlineMenu, this, 1, 0, 2);
			var buttonSettingsMenu = game.add.button(game.world.x + 720, 40, 'buttonSettingsMenu', this.settingsMenu, this, 1, 0, 2);

			//Añadimos el título del menú principal
			var tituloMenu = 'Menú Principal';
			game.add.text(game.world.x + 185, game.world.y + 180, tituloMenu, style1)

			//Escalamos los tres botones para que se vean adecuadamente en la pantalla
			buttonStartLocalMenu.scale.setTo(0.4, 0.5);
			buttonStartOnlineMenu.scale.setTo(0.4, 0.5);
			buttonSettingsMenu.width = buttonSettingsMenu.height = 40;
		},
		
		startLocalMenu: function () //Función llamada cuando pulsamos el botón local, llama al script de carga de matchmaking local
		{
			game.state.start('matchmakingState');
		},


		startOnlineMenu: function () //Función llamada cuando pulsamos el botón online, llama al script de carga de matchmaking online
		{
			game.state.start('matchmakingOnlineState');
		},

		settingsMenu: function () //Función llamada cuando pulsamos el botón de opciones, llama al script de carga de settings
		{
			game.state.start('settingsState');
		}
	}

