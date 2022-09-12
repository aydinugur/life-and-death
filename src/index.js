import {
    Button,
    collides,
    GameLoop,
    imageAssets,
    init,
    initGesture,
    initKeys,
    initPointer,
    keyPressed,
    load,
    Pool,
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
    let health = 2;
    let score = 0;

    const jellySpriteSheet = SpriteSheet({
        image: imageAssets['jelly_spritesheet'],
        frameWidth: 10,
        frameHeight: 6,
        animations: {
            walk_right: {
                frames: [0, 1],
                frameRate: 5
            },
            walk_left: {
                frames: [2, 3],
                frameRate: 5
            },
            idle_left: {
                frames: 0
            },
            idle_right: {
                frames: 2
            }
        }
    });
    const sprite = Sprite({
        x: canvas.width / 2,        // starting x,y position of the sprite
        y: canvas.height,
        anchor: {x: 0.5, y: 1},
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
            } else if (lastDirection === 0 || lastDirection === 1) {
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

    const healthHearts = [Sprite({
        image: imageAssets["heart"],
        x: canvas.width,
        y: 0,
        scaleX: 4,
        scaleY: 4,
        anchor: {x: 1, y: 0},
    }), Sprite({
        image: imageAssets["heart"],
        x: canvas.width - imageAssets["heart"].width * 4,
        y: 0,
        scaleX: 4,
        scaleY: 4,
        anchor: {x: 1, y: 0},
    }), Sprite({
        image: imageAssets["heart"],
        x: canvas.width - imageAssets["heart"].width * 2 * 4,
        y: 0,
        scaleX: 4,
        scaleY: 4,
        anchor: {x: 1, y: 0},
    })];

    const heading = Text({
        text: 'You are a nasty cell that\n wants to survive and find your way through to the world!\n Press Start to feed yourself!',
        font: '36px Arial',
        color: 'black',
        x: canvas.width / 2,
        y: canvas.height / 4,
        anchor: {x: 0.5, y: 0.5},
        textAlign: 'center'
    });

    const status = Text({
        text: '',
        font: '48px Arial',
        color: 'white',
        x: canvas.width / 2,
        y: canvas.height / 2,
        anchor: {x: 0.5, y: 0.5},
        textAlign: 'center'
    });

    const survivalScene = Scene(
        {
            id: 'survival',
            hidden: true
        }
    );

    survivalScene.add(sprite);
    survivalScene.add(healthHearts);
    survivalScene.add(status);

    const menuScene = Scene(
        {
            id: 'main'
        }
    );

    const restartScene = Scene(
        {
            id: 'restart',
            hidden: true
        }
    );

    menuScene.add(heading);

    initPointer();

    const restartButton = Button({
        x: canvas.width / 2,
        y: canvas.height / 4,
        scaleX: 4,
        scaleY: 4,
        anchor: {x: 0.5, y: 0.5},

        text: {
            text: 'START AGAIN',
            color: 'white',
            font: '20px Arial, sans-serif',
            anchor: {x: 0.5, y: 0.5}
        },
        onDown() {
            flag = true;
            status.text = '';
            restartScene.hide();

            for (let i = 0; i < 3; i++) {
                healthHearts[i].image = imageAssets["heart"];
            }
        },
        onOver() {
            this.textNode.color = 'red';
            canvas.style.cursor = 'pointer';
        },
        onOut() {
            this.textNode.color = 'white';
            canvas.style.cursor = 'initial';
        },
    });

    restartScene.add(restartButton);

    const button = Button({
        x: canvas.width / 2,
        y: canvas.height / 2,
        scaleX: 4,
        scaleY: 4,
        anchor: {x: 0.5, y: 0.5},

        text: {
            text: 'START',
            color: 'white',
            font: '20px Arial, sans-serif',
            anchor: {x: 0.5, y: 0.5}
        },
        onDown() {
            flag = true;
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

        padX: 20,
        padY: 10,
    });

    menuScene.add(button);

    const poisonPool = Pool({
        create: Sprite
    });

    const foodPool = Pool({
        create: Sprite
    });

    let flag = false;

    function startPoisons() {
        let timer = null;
        let func = () => {
            timer = setTimeout(() => {
                const ddy = Math.random();

                if (flag) {
                    poisonPool.get({
                        x: Math.random() * canvas.width,
                        // x: canvas.width / 2,
                        y: 0,
                        scaleX: 10,
                        scaleY: 10,
                        ddy: ddy,
                        image: getRandomPoisonImage(),
                        ttl: 620
                    });
                }
                func();
            }, 850);
        };
        timer = setTimeout(func, 20);
    }

    function startFoods() {
        let timer = null;
        let func = () => {
            timer = setTimeout(() => {
                let ddy = Math.random();

                if (flag) {
                    foodPool.get({
                        x: Math.random() * canvas.width,
                        // x: canvas.width / 2,
                        y: 0,
                        scaleX: 10,
                        scaleY: 10,
                        ddy: ddy,
                        image: getRandomFoodImage(),
                        ttl: 620
                    });
                }
                func();
            }, 3000);
        };
        timer = setTimeout(func, 20);
    }

    const loop = GameLoop({  // create the main game loop
        update: function () {        // update the game state
            menuScene.update();
            survivalScene.update();
            poisonPool.update();
            foodPool.update();
            restartScene.update();

            function resetGame(element) {
                flag = false;
                poisonPool.clear();
                foodPool.clear();
                if (health < 0) {
                    const poison = element.image.currentSrc.split('/').pop();
                    status.text = endings[poison];
                } else {
                    status.text = 'Perfect!\nYou made it to ovary\nBut it was just the beginning of the journey';
                }
                health = 2;
                score = 0;
                restartScene.show();
            }

            poisonPool.objects.forEach(element => {

                if (collides(element, sprite)) {
                    healthHearts[health].image = imageAssets['blank_heart'];
                    health--;
                    element.y = canvas.height + 50;
                    if (health < 0) {
                        resetGame(element);
                    }
                }
            });

            foodPool.objects.forEach(element => {
                if (collides(element, sprite)) {
                    if (++score > 9) {
                        resetGame(element);
                    }
                    element.y = canvas.height + 50;
                }
            });

        },
        render: function () {
            menuScene.render();
            survivalScene.render();
            poisonPool.render();
            restartScene.render();
            foodPool.render();
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

    startPoisons();
    startFoods();
    loop.start();
}

function getRandomPoisonImage() {
    let names = ['condom', 'pill'];
    return imageAssets[names[Math.floor(Math.random() * names.length)]];
}

function getRandomFoodImage() {
    let names = ['handcuff', 'heart', 'lip', 'rabbit_ears'];
    return imageAssets[names[Math.floor(Math.random() * names.length)]];
}

const endings = {
    'condom.png': 'Oh no!\nYou were just dumped into a dirty condom\nand thrown away!',
    'pill.png': 'Oh no\n Your destination just got\na couple of birth control pills ):',
}

load('jelly_spritesheet.png', 'blank_heart.png', 'baby_spritesheet.png', 'condom.png', 'pill.png', 'handcuff.png', 'heart.png', 'lip.png', 'rabbit_ears.png').then(
    function () {
        initGame();
    }
)
