//creamos la variable del juego fijando el tamaño de la ventana
var game = new Phaser.Game(800, 600, Phaser.AUTO, 'gameDiv')
  
  //aquí se añaden las escenas al juego, si queréis añadir alguna más hay que hacerlo aquí
game.state.add('bootState', PenRunner.bootState)
game.state.add('preloadState', PenRunner.preloadState)
game.state.add('titleState', PenRunner.titleState)
game.state.add('menuState', PenRunner.menuState)
game.state.add('matchState', PenRunner.matchState)
game.state.add('scoreState', PenRunner.scoreState)
game.state.add('matchMakingState', PenRunner.matchMakingState)


 // llamamos a la scena boot
game.state.start('bootState')

