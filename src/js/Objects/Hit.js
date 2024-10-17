import Chou from './Chou.js'
import * as PIXI from 'pixi.js'
import { timelineY } from '../settings.js'
import { showProut } from '../main.js'

export default class Hit extends Chou {
    constructor(container, direction, index, initXPos, playerId, arrowType) {
        super(container, direction, index, initXPos, playerId)
        this.type = 'hit'
        this.direction = this.playerID === 1 ? -1 : 1
        this.arrowType =  arrowType
        this.texture = PIXI.Texture.from('/assets/icons/fleche.svg');
        this.fleche = new PIXI.Sprite(this.texture);
        this.fleche.x = this.circlePos;
        this.fleche.y = timelineY;
        this.loadFleche();
        this.drawChou()
    }

    showFeedback() {
        this.color =  this.isHitCorrect() ? 0x00FF00 : 0xFF0000;
        this.drawChou()
        if (currTarget.isHitCorrect()) {
            this.showProut(this.targetsContainer)
        }
    }

    loadFleche() {
        this.fleche.anchor.set(0.5)

        switch (this.arrowType) {
            case 'left':
                this.fleche.rotation = Math.PI
                break;
            case 'right':
                this.fleche.rotation = 0
                break;
            case 'up':
                this.fleche.rotation = - Math.PI / 2
                break;
            case 'down':
                this.fleche.rotation = Math.PI / 2
                break;
            default:
                break;
        }

       
        this.container.addChild(this.fleche);
    }

    isSuccessful() {
        this.isHitCorrect()
    }

    showFeedback() {
        this.color = this.isHitCorrect() ? 0x00FF00 : 0xFF0000;
        console.log("success", this.isHitCorrect())
    }

    drawChou() {
        this.background.x = this.circlePos
        this.fleche.x = this.circlePos
    }

    remove() {
        this.container.removeChild(this.background);
        this.container.removeChild(this.fleche);
    }

    move() {
        this.circlePos += (-this.direction);
        this.drawChou();
    }
}