/* tslint:disable:no-empty */
import ServiceLocator from '../ServiceLocator.js';
/**
 * Abstract class.
 * Represents view component on the page.
 */
export default class View {
    public serviceLocator: ServiceLocator;
    constructor(serviceLocator) {
        this.serviceLocator = serviceLocator;
    }

    /**
     * Initialize view in DOM element.
     *
     * @param root {Element} DOM element to initialize in
     */
    public open(root) {
    }

    /**
     * Process cleanup.
     */
    public close() {
    }
}
