import { setUpButtons, player1, player2 } from './BorneManager/borneManager.js'
import Game from './Objects/Game.js'
import * as PIXI from 'pixi.js'
import { debounce } from './utils/debounce.js'
import { longFarts, smallFarts, timelineY } from './settings.js'

const createApp = async () => {
    // Create a new PixiJS application
    const app = new PIXI.Application({
        width: window.innerWidth,
        height: window.innerHeight,
        resolution: window.devicePixelRatio || 1, // Set resolution to match device pixel ratio
        antialias: true, // Enable antialiasing for smoother graphics
        transparent: true
    });
    document.body.appendChild(app.view); // Append canvas to the document
    await setUpButtons()
    const game = new Game(app,)
    game.init()

    const animateChar = (playerID) => {
        document.querySelector(`div.char${playerID}`).classList.toggle(('active'))
        document.querySelector(`div.char${playerID}Fart`).classList.toggle(('active'))
    }

    const debouncedAnimateChar1 = debounce(() => animateChar(1), 500);
    const debouncedAnimateChar2 = debounce(() => animateChar(2), 500);

    const handleButtonADown = (playerID) => {
        let target = game.targets[playerID][0];
        if (!target) return

        if (target.type === 'hit') {
            const randomFart = smallFarts[Math.floor(Math.random() * smallFarts.length)]
            game.audioManager.debouncedPlay(randomFart.name);
        }

        else if (target.type === 'hold') {
            const randomFart = longFarts[Math.floor(Math.random() * longFarts.length)]
            game.audioManager.debouncedPlay(randomFart.name);
        }

        target.showFeedback()
        if (target.isHitCorrect() && target.type === 'hit') showProut()
        if (target.isHitCorrect() && target.type === 'hold') {
            game.userIsHolding = true;
        }

        if (playerID === 1) {
            debouncedAnimateChar1()
        }
        if (playerID === 2) {
            debouncedAnimateChar2()
        }
    }

    const handleButtonAUp = (playerID) => {
        const target = game.targets[playerID][0]
        if (!target) return
        game.userIsHolding = false;
        target.showFeedback()
        if (target.type === 'hold' && target.isHoldCorrect()) showProut()

        game.audioManager.clearDebouncedPlay()
        game.audioManager.stop()
    }

    player1.buttons[0].addEventListener('keydown', () => handleButtonADown(1))
    player1.buttons[0].addEventListener('keyup', () => handleButtonAUp(1))
    player2.buttons[0].addEventListener('keydown', () => handleButtonADown(2))
    player2.buttons[0].addEventListener('keyup', () => handleButtonAUp(2))

    const update = () => {
        game.updateAll()
    }

    app.ticker.maxFPS = 60
    app.ticker.add(update);

    window.addEventListener('resize', () => {
        app.renderer.resize(window.innerWidth, window.innerHeight);
    });

    const showProut = () => {
        const texture = PIXI.Texture.from('./assets/icons/prout.svg');
        const prout = new PIXI.Sprite(texture);
        prout.anchor.set(0.5);
        prout.x = window.innerWidth / 2;
        prout.y = timelineY;
        app.stage.addChild(prout);

        setTimeout(() => {
            app.stage.removeChild(prout);
        }, 500);
    }
}
createApp()
