import {GameLoop, init, initGesture, initPointer, onGesture, Scene, Sprite} from './kontra.min.mjs';

let {canvas} = init();

const sprite = Sprite({
    x: 100,        // starting x,y position of the sprite
    y: 80,
    color: 'black',  // fill color of the sprite rectangle
    width: 60,     // width and height of the sprite rectangle
    height: 120,
    dx: 2          // move the sprite 2px to the right every frame
});


let mainScene = Scene(
    {
        id: 'main',
        objects: [sprite]
    }
);

var loop = GameLoop({  // create the main game loop
    update: function() {        // update the game state
        mainScene.update();

        // wrap the sprites position when it reaches
        // the edge of the screen
        if (sprite.x > canvas.width) {
            sprite.x = -sprite.width;
        }
    },
    render: function() {        // render the game state
        mainScene.render();
    }
});

loop.start();

initPointer();
initGesture();

onGesture('swipeleft', function () {
    console.log("lol");
    mainScene.hide();
})