import {
    Button,
    GameLoop,
    imageAssets,
    init,
    initGesture,
    initKeys,
    initPointer,
    keyPressed,
    load,
    Scene,
    setImagePath,
    Sprite,
    SpriteSheet,
    Text
} from './kontra.min.mjs';

let {canvas} = init();

setImagePath("images");

function initGame() {

    let lastDirection = 0;

    const jellySpriteSheet = SpriteSheet({
        image: imageAssets['jelly_spritesheet'],
        frameWidth: 10,
        frameHeight: 6,
        animations: {
            // create a named animation: walk
            walk_right: {
                frames: [0, 1],
                frameRate: 5
            },
            walk_left: {
                frames: [2, 3],
                frameRate: 5
            },
            idle_left: {
                // a single frame
                frames: 0
            },
            idle_right: {
                // a single frame
                frames: 2
            }
        }
    });
    const sprite = Sprite({
        x: canvas.width / 2,        // starting x,y position of the sprite
        y: canvas.height,
        anchor: {x: 0.5, y: 1},
        // color: 'cyan',  // fill color of the sprite rectangle
        // width: 60,     // width and height of the sprite rectangle
        // height: 120,
        scaleX: 10,
        scaleY: 10,
        dx: 0,
        ddx: 0,
        animations: jellySpriteSheet.animations,
        update: function () {
            this.advance();
            if (keyPressed('arrowleft') || keyPressed('a')) {
                lastDirection = 0;
                this.playAnimation('walk_right');
                if (this.x < 54) {
                    this.ddx = 0;
                    this.dx = 0;
                } else {
                    this.ddx = -ddx;
                }
            } else if (keyPressed('arrowright' || 'a') || keyPressed('d')) {
                lastDirection = 1;
                if (this.x > canvas.width - 52) {
                    this.ddx = 0;
                    this.dx = 0;
                } else {
                    this.ddx = ddx;
                }
                this.playAnimation('walk_left');
            } else if (lastDirection === 0 || lastDirection === 1){
                this.ddx = 0;
                if (this.dx !== 0) {
                    this.dx /= 1.1;
                    if (Math.abs(this.dx) < 0.001) {
                        this.dx = 0;
                    }
                }
                this.playAnimation(lastDirection === 0 ? 'idle_left' : 'idle_right');
            }
        }
    });

    let text = Text({
        text: 'Git!\nLen!',
        font: '48px Arial',
        color: 'white',
        x: canvas.width / 2,
        y: canvas.height / 2,
        anchor: {x: 0.5, y: 0.5},
        textAlign: 'center'
    });

    let survivalScene = Scene(
        {
            id: 'survival',
            hidden: true
        }
    );

    survivalScene.add(sprite);
    survivalScene.add(text);

    let menuScene = Scene(
        {
            id: 'main'
        }
    );

    initPointer();

    let button = Button({
        // sprite properties
        x: canvas.width / 2,
        y: canvas.height / 2,
        scaleX: 4,
        scaleY: 4,
        anchor: {x: 0.5, y: 0.5},

        // text properties
        text: {
            text: 'BAŞLA',
            color: 'white',
            font: '20px Arial, sans-serif',
            anchor: {x: 0.5, y: 0.5}
        },
        onDown() {
            document.ontouchmove = (evt) => {
                evt.preventDefault();
                if (x > evt.changedTouches[0].clientX) {
                    sprite.playAnimation('walk_right');
                    lastDirection = -1;
                    if (sprite.x < 54) {
                        sprite.ddx = 0;
                        sprite.dx = 0;
                    } else {
                        sprite.ddx = -ddx;
                    }
                } else if (x < evt.changedTouches[0].clientX) {
                    lastDirection = 2;
                    sprite.playAnimation('walk_left');
                    if (sprite.x > canvas.width - 52) {
                        sprite.ddx = 0;
                        sprite.dx = 0;
                    } else {
                        sprite.ddx = ddx;
                    }
                } else {
                    sprite.ddx = 0;
                }
            }
            menuScene.hide();
            survivalScene.show();
        },
        onOver() {
            this.textNode.color = 'red';
            canvas.style.cursor = 'pointer';
        },
        onOut() {
            this.textNode.color = 'white';
            canvas.style.cursor = 'initial';
        },

        // button properties
        padX: 20,
        padY: 10,
    });

    menuScene.add(button);

    var loop = GameLoop({  // create the main game loop
        update: function () {        // update the game state
            menuScene.update();
            survivalScene.update();
            // sprite.update();
            // wrap the sprites position when it reaches
            // the edge of the screen
            if (sprite.x > canvas.width) {
                sprite.x = -sprite.width;
            }
        },
        render: function () {        // render the game state
            menuScene.render();
            survivalScene.render();
            // sprite.render();
        }
    });

    initGesture();
    initKeys();

    let x;
    const ddx = 0.3;

    document.ontouchstart = (evt) => {
        evt.preventDefault();
        x = evt.changedTouches[0].clientX;
    }

    document.ontouchend = (evt) => {
        lastDirection = lastDirection === -1 ? 0 : 1;
        x = evt.changedTouches[0].clientX;
    }

    loop.start();
}

load('jelly_spritesheet.png').then(
    function () {
        initGame();
    }
)
