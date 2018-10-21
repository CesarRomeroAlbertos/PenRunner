PenRunner.matchState = function(game) {

}

PenRunner.matchState.prototype =
{
	create: function()
	{
		game.stage.backgroundColor = "#FFFFFF";
		var trackJson = game.cache.getJSON('track');
		var collisionJson = game.cache.getJSON('wallsCollision');
		walls = game.add.sprite(trackJson.wallsPositionX,trackJson.wallsPositionY,'walls',{shape: collisionJson.wallsTrack});
		start = game.add.sprite(trackJson.startPositionX,trackJson.startPositionY,'start');
		goal = game.add.sprite(trackJson.goalPositionX,trackJson.goalPositionY,'goal');

	},

	update:function()
	{



	}
}

