//creating the game state variables
var PLAY = 1;
var END = 0;
var gameState = PLAY;

//creating the trex variables 
var trex, trex_running, trex_collided;

//creating the ground variables
var ground, invisibleGround, groundImage;

//creating the cloud variables
var cloudsGroup, cloudImage;

//creating the obstacle variables
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

//creating score variable
var score;

//creating jump over and restart variables
var gameOverImg,restartImg

//creating the sound variables
var jumpSound , checkPointSound, dieSound



function preload(){
  
  //loading the trex images
  trex_running =loadAnimation("trex1.png","trex3.png","trex4.png");
  trex_collided = loadAnimation("trex_collided.png");
  
  //loading the ground image
  groundImage = loadImage("ground2.png");
  
  //loading the cloud image
  cloudImage = loadImage("cloud.png");
  
  //loading the obstacle images
  obstacle1 = loadImage("obstacle1.png");
  obstacle2 = loadImage("obstacle2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacle4.png");
  obstacle5 = loadImage("obstacle5.png");
  obstacle6 = loadImage("obstacle6.png");
  
  //loading the restart image
  restartImg = loadImage("restart.png")
  
  //loading the game over images
  gameOverImg = loadImage("gameOver.png")
  
  //loading the sounds
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
}


function setup() {
  
  //creating canvas
  createCanvas(600, 200);

  //creating the trex sprite and adding image 
  trex = createSprite(50,160,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = 0.5;
  
  //creating the ground sprite and adding the image
  ground = createSprite(200,180,400,20);
  ground.addImage("ground",groundImage);
  ground.x = ground.width /2;
  
  //creating the gameover sprite and adding the image 
  gameOver = createSprite(300,100);
  gameOver.addImage(gameOverImg);
  gameOver.scale = 0.5;
  
  //creating the restart sprite and adding the image 
  restart = createSprite(300,140);
  restart.addImage(restartImg);
  restart.scale = 0.5;
  
  //creating the invisible ground and adding the image
  invisibleGround = createSprite(200,190,400,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = createGroup();
  cloudsGroup = createGroup();

  //settiing collider for the trex
  trex.setCollider("circle",0,0,50);
  trex.debug = false
  
  //creating the score
  score = 0;
  
}

function draw() {
  
  //creating the background
  background("pink");
  
  //displaying score
  text("Score: "+ score, 500,50);
  
  //creating game state play
  if(gameState === PLAY){
 
    //making game over sprite visible
    gameOver.visible = false;
    
    //making restart sprite visible
    restart.visible = false;
    
    //giving velocity X to ground
    ground.velocityX = -(4 + 3* score/100)
    
    //scoring
    score = score + Math.round(getFrameRate()/60);
    
    //playing sound on everytime score increasing 300
    if(score>0 && score%100 === 0){
         checkPointSound.play() 
    } 
    
    //giving ground.x position 
    if (ground.x < 0){
         ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if(keyDown("space")&& trex.y >= 100) {
        trex.velocityY = -12;
        jumpSound.play();
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    //reseting on obstacles touching trex
    if(obstaclesGroup.isTouching(trex)){
        //trex.velocityY = -12;
        jumpSound.play();
        gameState = END;
        dieSound.play()
      
    }
  }
  
   //creating gamestate end
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     //changing ground velocity x andy
      ground.velocityX = 0;
      trex.velocityY = 0
      
     //reseting when mouse is touching restart sprite
     if(mousePressedOver(restart)) {
      reset();
    }
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     //giving obstacle group the velocity x 
     obstaclesGroup.setVelocityXEach(0);
     
     //giving clouds group the velocity x
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
     //stop trex from falling down
     trex.collide(invisibleGround);
  
  
  //drawing all the sprites
  drawSprites();
}



























































//function to reset the game
function reset(){
  gameState = PLAY
  obstaclesGroup.destroyEach()
  cloudsGroup.destroyEach()  
  gameOver.visible = false;
  restart.visible = false;
  trex.changeAnimation("running" , trex_running)
  score = 0
}


//function to spawn the obstacles
function spawnObstacles(){
 if (frameCount % 60 === 0){
   var obstacle = createSprite(600,165,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.5;
    obstacle.lifetime = 300;
   
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}


//function to spawn the clouds
function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 60 === 0) {
    var cloud = createSprite(600,120,40,10);
    cloud.y = Math.round(random(80,120));
    cloud.addImage(cloudImage);
    cloud.scale = 0.5;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

