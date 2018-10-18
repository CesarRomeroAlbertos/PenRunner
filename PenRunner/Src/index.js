//creamos la variable del juego fijando el tamaño de la ventana
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv')
  
  //aquí se añaden las escenas al juego, si queréis añadir alguna más hay que hacerlo aquí
game.state.add('bootState', PenRunner.bootState)
game.state.add('preloadTitleState', PenRunner.preloadTitleState)
game.state.add('titleState', PenRunner.titleState)
game.state.add('preloadMenuState', PenRunner.preloadMenuState)
game.state.add('menuState', PenRunner.menuState)
game.state.add('preloadMatchState', PenRunner.preloadMatchState)
game.state.add('matchState', PenRunner.matchState)
game.state.add('preloadScoreState', PenRunner.preloadScoreState)
game.state.add('scoreState', PenRunner.scoreState)
game.state.add('preloadMatchmakingState', PenRunner.preloadMatchmakingState)
game.state.add('matchmakingState', PenRunner.matchmakingState)
game.state.add('preloadTrackBuildState', PenRunner.preloadTrackBuildState)


 // llamamos a la scena boot
game.state.start('bootState')

