import { randomId } from './util.js';

export default class App {
    id = randomId(32);
    name;

    constructor(name) {
        this.name = name;
    }
}