const PhysicsObject = require('./primitive/PhysicsObject.js');
const PIXI = require('pixi.js');
const Point = require('./primitive/Point.js');

const basicAlienSprite = PIXI.Sprite.fromImage('./images/spacestation.png');

class Alien extends PhysicsObject {
    constructor(coords = new Point(0, 0)) {
        super(basicAlienSprite, coords);
    }
}

module.exports = Alien;