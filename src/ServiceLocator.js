import Api from './Api';
import Router from './Router';
import EventBus from './utils/EventBus';
import MagicTransport from "./game/io/MagicTransport";

/**
 * Holds services. Provides dependency injection pattern.
 */
const BASE_URL = "localhost:8081";
//const BASE_URL = "glitchless-java.herokuapp.com";

export default class ServiceLocator {
    constructor() {
        this.api = new Api("https://" + BASE_URL + "/api");
        this.magicTransport = new MagicTransport("ws://" + BASE_URL + "/game");
        this.router = new Router(this);
        this.user = null;
        this.eventBus = new EventBus();
    }
}
