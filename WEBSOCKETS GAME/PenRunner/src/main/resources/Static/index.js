//creamos la variable del juego fijando el tamaño de la ventana
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv')
game.global = {player1: null};

  //aquí se añaden las escenas al juego, si queréis añadir alguna más hay que hacerlo aquí
game.state.add('bootState', PenRunner.bootState)
game.state.add('preloadStart', PenRunner.preloadStart)
game.state.add('titleState', PenRunner.titleState)
game.state.add('menuState', PenRunner.menuState)
game.state.add('matchState', PenRunner.matchState)
game.state.add('matchOnlineState', PenRunner.matchOnlineState)
game.state.add('matchWSState', PenRunner.matchWSState)
game.state.add('scoreState', PenRunner.scoreState)
game.state.add('scoreOnlineState', PenRunner.scoreOnlineState)
game.state.add('scoreWSState', PenRunner.scoreWSState)
game.state.add('matchmakingState', PenRunner.matchmakingState)
game.state.add('matchmakingOnlineState', PenRunner.matchmakingOnlineState)
game.state.add('matchmakingWSState', PenRunner.matchmakingWSState)
game.state.add('preloadMatchState', PenRunner.preloadMatchState)
game.state.add('preloadMatchOnlineState', PenRunner.preloadMatchOnlineState)
game.state.add('preloadTrackBuildState', PenRunner.preloadTrackBuildState)
game.state.add('preloadTrackBuildOnlineState', PenRunner.preloadTrackBuildOnlineState)
game.state.add('settingsState', PenRunner.settingsState)



 // llamamos a la scena boot
game.state.start('bootState')

