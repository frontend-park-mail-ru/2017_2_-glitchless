import * as PIXI from 'pixi.js';
import GameScene from './GameScene';

import PhysicLoop from './physics/PhysicLoop';
import SinglePlayerStrategy from './strategy/SinglePlayerStrategy';
import EventBus from './GameEventBus';
import MultiplayerStrategy from './strategy/MultiplayerStrategy';
import ScoreManager from './ScoreManager';

export default class GameManager {
    constructor(serviceLocator, gameRestartFunc, newWindowSizeCalcFunc) {
        this.serviceLocator = serviceLocator;
        this.scene = new GameScene();
        this.eventBus = EventBus;
        this.scoreManager = new ScoreManager(this);
        this.restart = gameRestartFunc;
        this.findNewWindowSize = newWindowSizeCalcFunc;
    }

    /**
     * @param {Element} field The field in which the game will be rendered.
     */
    setGameField(field) {
        this.scene.field = field;
    }

    /**
     * @param {Number[]} resolution Resolution in which the game will be rendered.
     */
    setResolution(resolution) {
        this.scene.width = resolution[0];
        this.scene.height = resolution[1];
    }

    initiateGame(data) {
        this.app = new PIXI.Application(this.scene.width, this.scene.height, {transparent: true});

        this.scene.setRenderer(this.app.renderer);
        this.scene.field.appendChild(this.app.view);
        this.scene.stage = this.app.stage;
        this.scene.initContainer();

        PIXI.settings.SCALE_MODE = PIXI.SCALE_MODES.LINEAR;
        this.scene.initBackground(this.app);

        this.loopObj = new PhysicLoop(this);
        this.loopObj.initTick(this);

        this._initStrategy(this.loopObj, data);
        this.gameStrategy.initUI(this.loopObj);

        this.app.ticker.add(this._onTick, this);
    }

    _onTick(deltaTime) {
        let elapsedMS = deltaTime /
            PIXI.settings.TARGET_FPMS /
            this.app.ticker.speed;

        const {appWidth, appHeight} = this.findNewWindowSize();
        this.setResolution([appWidth, appHeight]);
        this.app.renderer.resize(appWidth, window.innerHeight);

        this.gameStrategy.gameplayTick(this.loopObj, elapsedMS);
        this.loopObj._mainTick(deltaTime);
        this.scene.Tick();
    }

    _initStrategy(physicObject, data) {
        if (data !== null && data.type === 'FullSwapScene') {
            this.gameStrategy = new MultiplayerStrategy(this.scene,
                this.serviceLocator.magicTransport, physicObject,
                data);
        } else {
            this.gameStrategy = new SinglePlayerStrategy(this.scene);
        }

        EventBus.subscribeOn('forcefield_hit', this.gameStrategy.onForceFieldDepletion, this.gameStrategy);
        EventBus.subscribeOn('hpblock_hit', this.gameStrategy.onHpLoss, this.gameStrategy);
        EventBus.subscribeOn('player_won', this.scene.displayEndResult, this.scene);
        EventBus.subscribeOn('player_won', this.onGameEnd, this);
    }

    onGameEnd() {
        setTimeout(function() {
            this.app.ticker.stop();
            this.restart();
        }.bind(this), 1000);
    }

    destroy() {
        this.gameStrategy.destroy();
        this.app.destroy(true);
    }

    addObject(tag, physicObject) {
        this.loopObj.addObjectToPhysic(tag, physicObject);
        physicObject.onDraw(this.scene.mainScene);
        physicObject.subscribeToDestroy((item) => {
            item.onDestroy();
        });
    }
}
