import { randomId } from './util.js';

export default class User {
    id = randomId(8);
    name = '';
    email = '';
    password = '';
}