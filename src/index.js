import {
    Button,
    GameLoop,
    init,
    initGesture,
    initKeys,
    initPointer,
    keyPressed,
    onGesture,
    onKey,
    Scene,
    Sprite
} from './kontra.min.mjs';

let {canvas} = init();

const sprite = Sprite({
    x: canvas.width / 2,        // starting x,y position of the sprite
    y: canvas.height,
    anchor: {x: 0.5, y: 1},
    color: 'cyan',  // fill color of the sprite rectangle
    width: 60,     // width and height of the sprite rectangle
    height: 120,
    dx: 0,          // move the sprite 2px to the right every frame
    ddx: 0,
    update: function () {
        this.advance();
        if (keyPressed('arrowleft' || 'a')) {
            console.log('arrowleft, a');
            this.ddx = -0.3;
        } else if (keyPressed('arrowright' || 'a')) {
            this.ddx = 0.3;
        } else {
            this.ddx = 0;
            this.dx = 0;
        }

        // offKey('arrowleft');
        // if (offKey('arrowleft')) {
        //     console.log("kaldirr be meyh");
        //     this.ddx = 0;
        // }
    }
});

let survivalScene = Scene(
    {
        id: 'survival',
        hidden: true
    }
);

survivalScene.add(sprite);

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
        console.log("clicked");
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

loop.start();

initGesture();
initKeys();

onGesture('swipeleft', function () {
    console.log("swipe");
    sprite.ddx = -0.3;
})

onKey('arrowleft' || 'swipeleft', function () {
    // console.log("arrow or swipe");
    // sprite.ddx = -0.3;
})

onKey('arrowright', function () {
    console.log("right");
    sprite.ddx = 0.3;
})
