var game = new Phaser.Game(window.innerWidth, window.innerHeight, Phaser.CANVAS, "", {preload: preload, create: create, update: update});
var startGraphic;
var startText;
var instructionText;
var pickedKey = "up";
var left;
var right;
var playerAngle = 0;
var playerAngleText;
var mainTimer;
var scoreTrackingText;
var score = 0;
var speed = 0;
var graphicsOne;
var graphicsTwo;
var graphicsOneFreeSide = "bottom";
var graphicsTwoFreeSide = "right";
var previousGraphics = 1;
var direction;
var backColor;
var emitter;
var endTimer;
var endGraphic;
var scoreDisplayText;
var restartButton;

function preload() {
	game.load.image('sky', 'hellophaser/assets/sky.png');
	game.load.image('star', 'hellophaser/assets/star.png');
	game.load.image('diamond', 'hellophaser/assets/diamond.png');
	game.load.image('player', 'player.png');
	game.load.image('tiles', 'tiles.png');
	game.load.image('particle1', 'particle1.png');
	game.load.image('particle2', 'particle2.png');
	game.load.spritesheet('restartButton', 'button.png', 200, 50);
}

function create() {
	switchBackColour();
	game.stage.backgroundColor = backColor;
	gameLayer = game.add.group();
	tile = game.add.tileSprite(0, 0, window.innerWidth * 2, window.innerHeight * 2, 'tiles');
	keys = game.input.keyboard.createCursorKeys();

	player = game.add.sprite(game.world.centerX, game.world.centerY, 'player');
	player.anchor.setTo(0.5);

	left = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
	right = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
	left.onDown.add(turnLeft);
	right.onDown.add(turnRight);

	scoreTrackingText = game.add.text(10, 10, "Score: 0", { fill: '#d9d9d9', fontSize: 60 });

	graphicsOne = game.add.graphics();
	graphicsOne.lineStyle(40, 0xd9d9d9, 1);
	graphicsOne.drawRect(window.innerWidth / 2 - 25, 200, 40, (Math.random() * 400 + 350));
	player.moveUp();

	graphicsTwo = game.add.graphics();
	graphicsTwo.lineStyle(40, 0xd9d9d9, 1);
	graphicsTwo.drawRect(window.innerWidth / 2 - 25, 200, (Math.random() * 400 + 350), 40);
	player.moveUp();

	startGraphic = game.add.graphics();
	startGraphic.lineStyle(window.innerWidth * window.innerHeight, 0xd9d9d9, 1);
	startGraphic.drawRect(0, 0, window.innerWidth, window.innerHeight);
	game.add.tween(startGraphic).to({alpha: 0}, 1000, "Linear", true, 2500);
	player.moveUp();

	startText = game.add.text(0, 0, "Traverse", {fill: '#212121', fontSize: 130, boundsAlignH: 'center', boundsAlignV: 'middle'})
	startText.setTextBounds(0, 0, window.innerWidth, window.innerHeight - 200);
	startText.alpha = 1;
	game.add.tween(startText).to({alpha: 0}, 1500, "Linear", true, 1500);

	instructionText = game.add.text(0, 0, "Use left and right arrowkeys to move.", {fill: '#212121', fontSize: 50, boundsAlignH: 'center', boundsAlignV: 'middle'})
	instructionText.setTextBounds(0, 0, window.innerWidth, window.innerHeight + 100);
	instructionText.alpha = 1;
	game.add.tween(instructionText).to({alpha: 0}, 1500, "Linear", true, 1500);

	endGraphic = game.add.graphics();
	endGraphic.lineStyle(30, 0xd9d9d9, 0.5);

	restartButton = game.add.button(window.innerWidth / 2 - 100, window.innerHeight / 2 + 25, 'restartButton', restart, this, 1, 0, 2, 3);
	restartButton.alpha = 0;

	mainTimer = game.time.create(this, false);

	mainTimer.loop(15000, switchBackColour, this);

	mainTimer.loop(15000, function() {speed += 2}, this);

	mainTimer.add(4000, function() {mainTimer.loop(1000, function() {score += 1; scoreTrackingText.text = "Score: " + score;}, this)});

	mainTimer.add(4000, function() {speed = 10}, this);

	mainTimer.start();

	emitter = game.add.emitter(player.x, player.y, 100);
	emitter.makeParticles(['particle1', 'particle2']);
	emitter.gravity = 0;
}

function update() {
	if (playerAngle === 0) {
		tile.tilePosition.y += speed;
		graphicsOne.y += speed;
		graphicsTwo.y += speed;
	} else if (playerAngle === 90) {
		tile.tilePosition.x -= speed;
		graphicsOne.x -= speed;
		graphicsTwo.x -= speed;
	} else if (playerAngle === -180) {
		tile.tilePosition.y -= speed;
		graphicsOne.y -= speed;
		graphicsTwo.y -= speed;
	} else if (playerAngle === -90) {
		tile.tilePosition.x += speed;
		graphicsOne.x += speed;
		graphicsTwo.x += speed;
	}

	if (player.overlap(graphicsTwo)) {
		game.stage.backgroundColor = backColor;
		if ((graphicsTwo.y > 243 || graphicsTwo.y < 207) && !player.overlap(graphicsOne)) {
			endGame();
		}
		if (previousGraphics !== 2 && !(player.overlap(graphicsOne))) {
			direction = Math.floor(Math.random() * 2)
			if (direction) {
				graphicsOne.y = graphicsTwo.top - graphicsOne.height + graphicsOne.width;
				graphicsOneFreeSide = "top";
			} else {
				graphicsOne.y = graphicsTwo.top;
				graphicsOneFreeSide = "bottom";
			}
			if (graphicsTwoFreeSide === "right") {
				graphicsOne.x = graphicsTwo.right - graphicsOne.width;
			} else {
				graphicsOne.x = graphicsTwo.left;
			}
			previousGraphics = 2
		}
	} else if (player.overlap(graphicsOne)) {
		game.stage.backgroundColor = backColor;
		if ((graphicsOne.x > 23 || graphicsOne.x < -13) && !player.overlap(graphicsTwo)) {
			endGame();
		}
		if (previousGraphics !== 1 && !player.overlap(graphicsTwo)) {
			direction = Math.floor(Math.random() * 2);
			if (direction) {
				graphicsTwo.x = graphicsOne.right - graphicsTwo.width;
				graphicsTwoFreeSide = "left";
			} else {
				graphicsTwo.x = graphicsOne.left;
				graphicsTwoFreeSide = "right";
			}
			if (graphicsOneFreeSide === "top") {
				graphicsTwo.y = graphicsOne.top;
			} else {
				graphicsTwo.y = graphicsOne.bottom - graphicsTwo.height;
			}
			previousGraphics = 1
		}
	} else {
		endGame();
	}
}

function turnLeft() {
	pickedKey = "left";
	playerAngle = Math.ceil((playerAngle - 90) / 90) * 90;
	game.add.tween(player).to({angle: playerAngle},300,Phaser.Easing.Linear.None,true);
	player.angle = playerAngle;
	playerAngle = player.angle;
}

function turnRight() {
	pickedKey = "right";
	playerAngle = Math.ceil((playerAngle + 90) / 90) * 90;
	game.add.tween(player).to({angle: playerAngle},300,Phaser.Easing.Linear.None,true);
	player.angle = playerAngle;
	playerAngle = player.angle;
}

function endGame() {
	game.stage.backgroundColor = "ff3333";
	speed = 0;
	emitter.start(true, 0, 0, 75);
	player.visible = false;

	endTimer = game.time.create();
	endTimer.add(1500, function() {
		endGraphic.drawRect(10, 250, window.innerWidth, 30);
		scoreDisplayText = game.add.text(0, 0, "Your score was " + score, { fill: "#212121", fontSize: "30px", boundsAlignH: "center", boundsAlignV: "middle" });
		scoreDisplayText.setTextBounds(0, 250, window.innerWidth, 30);
		scoreDisplayText.alpha = 0;
		game.add.tween(scoreDisplayText).to({alpha: 1}, 1500, "Linear", true);
		game.add.tween(restartButton).to({alpha: 1}, 500, "Linear", true);
		restartButton.bringToTop();
	});
	endTimer.start();

	mainTimer.stop();
}

function switchBackColour() {
	backColor = Phaser.Color.HSLtoRGB(Math.random(), 0.5, 0.8);
	backColor = "#" + Phaser.Color.componentToHex(backColor.r) + Phaser.Color.componentToHex(backColor.g) + Phaser.Color.componentToHex(backColor.b);
}

function restart() {
	window.location.reload();
}