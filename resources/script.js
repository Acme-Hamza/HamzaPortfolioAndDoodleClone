//Doodle clone

//board
let board;
let boardWidth = 360;
let boardHeight = 576;
let context;

//GokuBlack
let GBwidth = 40;
let GBheight = 68;
let gbX = boardWidth / 2 - GBwidth / 2;
let gbY = boardHeight * 7 / 8 - GBheight;
let gbDefaultRightImg;
let gbDefaultLeftImg;
let gbFromWallLeftImg;
let gbFromWallRightImg;
let gbRoseDefaultLeftImg;
let gbRoseDefaultRightImg;
let gbRoseEndPoseImg;
let gbRoseFromWallLeftImg;
let gbRoseFromWallRightImg;
let gbTransformFrame1LeftImg;
let gbTransformFrame2LeftImg;
let gbTransformFrame3LeftImg;
let gbTransformFrame4LeftImg;
let gbTransformFrame1RightImg;
let gbTransformFrame2RightImg;
let gbTransformFrame3RightImg;
let gbTransformFrame4RightImg;

//GokuBlack-Sprites
let defaultRight = 0;
let defaultLeft = 0;

//physics
let velocityX = 0;
let velocityY = 0; //jump speed
let initalVelocityY = -2; //starting velocity Y
let gravity = 0.015;

//platforms
let platformArray = [];
let platformWidth = 60;
let platformHeight = 18;
let platformImg;

let score = 0;
let maxScore = 0;
let gameOver = false;


let GokuBlack = {
    img: null,
    x: gbX,
    y: gbY,
    width: GBwidth,
    height: GBheight,
    spriteX: 0,
    spriteY: 0,
    spriteWidth: 60,
    spriteHeight: 130
};

window.onload = function () {
    board = document.getElementById("board");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //load images
    gbDefaultRightImg = new Image();
    gbDefaultRightImg.src = '/resources/images/GBdefaultRight.png'; // Correct path to spritesheet
    gbDefaultRightImg.onload = function () {
        console.log('Image loaded successfully');
        GokuBlack.img = gbDefaultRightImg;
        requestAnimationFrame(update);
    };
    gbDefaultRightImg.onerror = function() {
        console.error('Failed to load image');
    };

    gbDefaultLeftImg = new Image();
    gbDefaultLeftImg.src = '/resources/images/GBdefaultLeft.png';

    gbFromWallLeftImg = new Image();
    gbFromWallLeftImg.src = '/resources/images/GBfromWallLeft.png';

    gbFromWallRightImg = new Image();
    gbFromWallRightImg.src = '/resources/images/GBfromWallRight.png';

    gbRoseFromWallLeftImg = new Image();
    gbRoseFromWallLeftImg.src = '/resources/images/GBroseFromWallLeft.png';

    gbRoseFromWallRightImg = new Image();
    gbRoseFromWallRightImg.src = '/resources/images/GBroseFromWallRight.png';

    gbTransformFrame1LeftImg = new Image();
    gbTransformFrame1LeftImg.src = '/resources/images/GBtransformFrame1Left.png';

    gbTransformFrame2LeftImg = new Image();
    gbTransformFrame2LeftImg.src = '/resources/images/GBtransformFrame2Left.png';

    gbTransformFrame3LeftImg = new Image();
    gbTransformFrame3LeftImg.src = '/resources/images/GBtransformFrame3Left.png';

    gbTransformFrame4LeftImg = new Image();
    gbTransformFrame4LeftImg.src = '/resources/images/GBtransformFrame4Left.png';

    gbTransformFrame1RightImg = new Image();
    gbTransformFrame1RightImg.src = '/resources/images/GBtransformFrame1Right.png';

    gbTransformFrame2RightImg = new Image();
    gbTransformFrame2RightImg.src = '/resources/images/GBtransformFrame2Right.png';

    gbTransformFrame3RightImg = new Image();
    gbTransformFrame3RightImg.src = '/resources/images/GBtransformFrame3Right.png';

    gbTransformFrame4RightImg = new Image();
    gbTransformFrame4RightImg.src = '/resources/images/GBtransformFrame4Right.png';

    gbRoseEndPoseImg = new Image();
    gbRoseEndPoseImg.src = '/resources/images/GBroseEndPose.png';

    platformImg = new Image();
    platformImg.src = '/resources/images/platformRed.png';

    velocityY = initalVelocityY;
    placePlatforms();
    requestAnimationFrame(update);

    document.addEventListener("keydown", movePlayer);
    document.addEventListener("keyup", stopPlayer);
};

function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }

    context.clearRect(0, 0, board.width, board.height);

        if (GokuBlack.x > board.width) {
            GokuBlack.x = 0;
        } else if (GokuBlack.x + GokuBlack.width < 0) {
            GokuBlack.x = board.width;
        }
    
    
    

    // Update GokuBlack position
    GokuBlack.x += velocityX;
    velocityY += gravity;
    GokuBlack.y += velocityY;
    if (GokuBlack.y > board.height) {
        gameOver = true;
    }

    // Draw the sprite
    context.drawImage(
        GokuBlack.img,
        GokuBlack.spriteX * GokuBlack.spriteWidth, GokuBlack.spriteY * GokuBlack.spriteHeight, GokuBlack.spriteWidth, GokuBlack.spriteHeight, // Source rectangle
        GokuBlack.x, GokuBlack.y, GokuBlack.width, GokuBlack.height // Destination rectangle on canvas
    );
    
    for (let i = 0; i < platformArray.length; i++) {
    let platform = platformArray[i];
    if(velocityY < 0 && GokuBlack.y < boardHeight*3/4) {
        platform.y -= initalVelocityY; //slide platform down
    }
     if (detectCollision(GokuBlack, platform) && velocityY >= 0) {
        velocityY = initalVelocityY;
     }
    context.drawImage(platform.img, platform.x, platform.y, platform.width, platform.height);
    }

    // clear platforms and add new ones
    while (platformArray.length > 0 && platformArray[0].y >= boardHeight) {
        platformArray.shift(); // removes first element from the array
        newPlatform(); 
    } 

    //score
    updateScore();
    context.fillStyle = "white";
    context.font = "16px sans-serif";
    context.fillText(score, 5, 20);

    if (gameOver) {
        context.fillText("Game Over: 'Space' to Restart", boardWidth/5, boardHeight*7/8);
    }


}       

//platforms


function movePlayer(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") { //move right
        velocityX = 1;
        GokuBlack.img = gbDefaultRightImg;
        GokuBlack.spriteX = defaultRight; 
    }
    else if (e.code == "ArrowLeft" || e.code == "KeyA") { //move left
        velocityX = -1;
        GokuBlack.img = gbDefaultLeftImg;
        GokuBlack.spriteX = defaultLeft; 
    }
    else if (e.code == 'Space' && gameOver) {
        //reset
        let GokuBlack = {
            img: gbDefaultRightImg,
            x: gbX,
            y: gbY,
            width: GBwidth,
            height: GBheight,
            spriteX: 0,
            spriteY: 0,
            spriteWidth: 60,
            spriteHeight: 130
        };

        velocityX = 0;
        velocityY = -3;
        score = 0;
        maxScore = 0;
        gameOver = false;
        placePlatforms();
    }
}

function stopPlayer(e) {
    if (e.code == "ArrowRight" || e.code == "KeyD") {
        velocityX = 0;
        GokuBlack.spriteX = 0; 
    }   else if (e.code == "ArrowLeft" || e.code == "KeyA") {
        velocityX = 0;
        GokuBlack.spriteX = 0;
    }
}

function placePlatforms() {
    platformArray = [];

    //starting platforms
    let platform = {
        img : platformImg,
        x : boardWidth/2,
        y : boardHeight - 50,
        width : platformWidth,
        height : platformHeight
    }
 
    platformArray.push(platform);


 //starting platforms
    //     platform = {
    //     img : platformImg,
    //     x : boardWidth/2,
    //     y : boardHeight - 150,
    //     width : platformWidth,
    //     height : platformHeight
    // }

    

    for (let i = 0; i < 6; i++) {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : boardHeight - 75*i - 150,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);
    }
    }

    function newPlatform() {
        let randomX = Math.floor(Math.random() * boardWidth*3/4); //(0-1) * boardWidth*3/4
        let platform = {
            img : platformImg,
            x : randomX,
            y : -platformHeight,
            width : platformWidth,
            height : platformHeight
        }
        platformArray.push(platform);
    }
    

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function updateScore() {
    let points = Math.floor(10*Math.random());
    if (velocityY < 0) { //negative going up
        maxScore += points;
        if (score < maxScore) {
            score = maxScore;
        }
    } else if (velocityY >= 0) {
        maxScore -= points;
    }
}
