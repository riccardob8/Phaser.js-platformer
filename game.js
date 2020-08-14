var back;
var player;
var platforms;
var cursors;
var jumpButton;
var fireButton;
var lifepoint;
var life;
var secondJump = false;
var weapon;
var bullet;
var enemywall;
var hitEnemywall;
var enemy;
var idleanimation;
var runanimation;
var label;
var isfiring = 0;
var badmemory;
var badmemory_direction = 1;
var fireballbutton;
var dodgebutton;
var doublejumpbutton;

const game = new Phaser.Game(800, 600, Phaser.AUTO,'', {
    preload: preload,
    create: create,
    update: update
});

function preload () {
    game.load.image('background', '../assets/backgrounds/background8000x2200.png');
    game.load.spritesheet('player', '../assets/sprites/playersprite1800x100.png', 100, 100, 18);
    game.load.image('bullet', '../assets/sprites/fireball50x50.png');
    game.load.image('badmemory', '../assets/sprites/badmemory50x50.png');
    game.load.image('life', '../assets/sprites/Life_on.png');
    game.load.spritesheet('fireballbutton', '../assets/sprites/Fire.png', 100, 100, 2);
    game.load.spritesheet('doublejumpbutton', '../assets/sprites/Jump.png', 100, 100, 2);
    game.load.spritesheet('dodgebutton', '../assets/sprites/Dodge.png', 100, 100, 2);
    game.load.image('platform1', '../assets/platforms/platformc800x50.png');
    game.load.image('platform2', '../assets/platforms/platforma400x35.png');
    game.load.image('platform3', '../assets/platforms/platformc200x30.png');
    game.load.image('platform4', '../assets/platforms/tower500x600.png');
    game.load.image('platform5', '../assets/platforms/cloud700x80.png');
    game.load.image('platform6', '../assets/platforms/cloud300x65.png');
    game.load.image('platform7', '../assets/platforms/cloud500x75.png');
}

function create () {
    game.world.setBounds (0, 0,8000,2200);
    this.add.image(0, 0, 'background');
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.time.desiredFps = 30;
    player = game.add.sprite(0, 200, 'player');
    player.frame = 0;
    game.physics.arcade.enable(player);
    player.body.bounce.y = 0.2;
    player.body.gravity.y = 900;
    player.body.collideWorldBounds = true;
    player.anchor.set(0.5, 0.5);
    player.animations.add("stop", [0]);
    player.animations.add("run", [1, 2, 3, 4, 5, 6, 7], 7, true);
    player.animations.add("jump", [8, 9, 10, 11, 12, 13, 14], 7, false);
    player.animations.add("shoot", [17], 7, false);
    player.animations.play("stop");
    platforms = game.add.physicsGroup();
    platforms.create(-300, 1600, 'platform1');
    platforms.create(900, 1600, 'platform1');
    platforms.create(5070, 1700, 'platform1');
    platforms.create(7400, 1400, 'platform1');
    platforms.create(500, 1400, 'platform2');
    platforms.create(1900, 1200, 'platform2');
    platforms.create(1500, 1000, 'platform2');
    platforms.create(750, 800, 'platform2');
    platforms.create(2100, 400, 'platform2');
    platforms.create(3200, 1000, 'platform2');
    platforms.create(6600, 1200, 'platform2');
    platforms.create(5500, 900, 'platform2');
    platforms.create(500, 600, 'platform3');
    platforms.create(2500, 1500, 'platform3');
    platforms.create(3000, 1500, 'platform3');
    platforms.create(4500, 1500, 'platform3');
    platforms.create(4820, 1400, 'platform3');
    platforms.create(1900, 1700, 'platform4');
    platforms.create(4000, 1700, 'platform4');
    platforms.create(2600, 400, 'platform5'); //move to 2870, 400
    platforms.create(3600, 400, 'platform6'); //move to 3600, 900
    platforms.create(3220, 1300, 'platform6'); //move to 3700, 1600
    platforms.create(6000, 1700, 'platform6'); //move to 6150, 1100
    platforms.create(5150, 900, 'platform6'); //move to 5150, 500
    platforms.setAll('body.immovable', true);
    weapon = game.add.weapon(9999, 'bullet');
    weapon.fireRate = 500;
    weapon.fireAngle = 0;
    weapon.bulletAngleVariance = 0;
    weapon.bulletSpeed = 450;
    weapon.trackSprite(player, 50, 0, true);
    badmemory = game.add.sprite(500, 1350, 'badmemory');
    badmemory.anchor.set(0.5, 0.5);
    game.physics.arcade.enable(badmemory);
    cursors = game.input.keyboard.createCursorKeys();
    jumpButton = game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    jumpButton.onDown.add(function(){
        if (!secondJump)
        player.body.velocity.y = -700;
        if (!(player.body.touching.down||player.body.onFloor())) {secondJump=true}
    })
    fireButton = game.input.keyboard.addKey(Phaser.Keyboard.F);
    fireButton.onDown.add(function(){
        isfiring = 15;
        weapon.fire()
    })
    enemy = game.add.sprite(300, 150, 'enemy');
    game.physics.arcade.enable(enemy);
    game.camera.follow(player)
    poteri = game.add.physicsGroup();
    poteri.create(1200, 100, 'dodgebutton');
    poteri.create(1400, 100, 'doublejumpbutton');
    poteri.create(1600, 100, 'fireballbutton');
    poteri.fixedToCamera = true;
    healthbar = game.add.physicsGroup();
    healthbar.create(20, 20, 'life');
    healthbar.create(420, 20, 'life');
    healthbar.create(820, 20, 'life');
    healthbar.scale.x = 0.2,
    healthbar.scale.y = 0.2;
    healthbar.fixedToCamera = true;
}

function update() {
    game.physics.arcade.collide(player, platforms);
    weapon.bulletSpeed = 600*player.scale.x;
    this.game.physics.arcade.collide(player, badmemory)
     player.body.velocity.x = 0;
    if ((game.input.keyboard.isDown(Phaser.Keyboard.LEFT) === true) && (player.body.onFloor() || player.body.touching.down)){
        player.body.velocity.x = -350;
        player.animations.play('run');
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.LEFT) === true){
        player.body.velocity.x = -350;
    }
    else if ((game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) === true) && (player.body.onFloor() || player.body.touching.down)){
        player.body.velocity.x = 350;
        player.animations.play('run');
    }
    else if (game.input.keyboard.isDown(Phaser.Keyboard.RIGHT) === true){
        player.body.velocity.x = 350;
    }
    else if (player.body.velocity.x == 0 && (player.body.onFloor() || player.body.touching.down)){
        player.animations.play("stop");
    }
    if (player.body.velocity.x < 0) {
        player.scale.x = -1;
    }
    else if (player.body.velocity.x > 0) {
        player.scale.x = 1;
    }
    if (isfiring > 0)
    {
        player.animations.play("shoot")
    isfiring--;
    }
    if (jumpButton.isDown) {
        player.animations.play('jump');
    }
    if (player.body.onFloor() || player.body.touching.down)
    secondJump=false;
    badmemory.body.velocity.x = 200 * badmemory_direction;
    if(badmemory.x > 900)
    {
        badmemory_direction = -1;
    }

    if(badmemory.x < 500)
    {
        badmemory_direction = 1;
    }
    function hitEnemywall(enemywall, bullet){
        enemywall.kill()
        bullet.kill()
    }
    var enemy_direction = 1;
    game.physics.arcade.collide(enemy, platforms);
}
