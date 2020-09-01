import { randomId } from './util.js';

export default class Event {
    static types = [
        'view',
        'click',
        'error',
        'crash',
    ];

    id = randomId(32);
    appId = '';
    date = new Date();

    // For web only
    userAgent = '';

    platform = '';
    // For native only
    manufacturer = '';
    // This doubles as the browser for web
    model = '';
    version = '';

    locale = '';
    sessionId = '';

    /**
     * This can have different meanings depending on what the event's type is:
     * 
     * view -> page path
     * click -> element identifier
     * error & crash -> stacktrace
     */
    data;

    /**
     * view,click, error, or crash 
    */
    type;

    constructor(
        appId,
        date,
        userAgent,
        platform,
        manufacturer,
        model,
        version,
        locale,
        sessionId,
        data,
        type,
    ) {
        this.appId = appId;
        this.date = date;
        this.userAgent = userAgent;
        this.platform = platform;
        this.manufacturer = manufacturer;
        this.model = model;
        this.version = version;
        this.locale = locale;
        this.sessionId = sessionId;
        this.data = data;
        this.type = type;
    }
}
