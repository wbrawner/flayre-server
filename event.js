import { randomId } from './util.js';

export default class Event {
    id = randomId(32);
    appId = '';
    date = new Date();

    // For web only
    userAgent = '';

    platform = '';
    // Unused on web
    manufacturer = '';
    // This doubles as the browser for web
    model = '';
    version = '';

    locale = '';
    sessionId = '';
    data;

    // For interactions only
    // The path for page views or some identifier for clicks
    element;
    // view or click, more could be added later
    type;

    // For errors only
    stacktrace;
    fatal;

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
        element,
        type,
        stacktrace,
        fatal
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
        this.element = element;
        this.type = type;
        this.stacktrace = stacktrace;
        this.fatal = fatal;
    }

    static Interaction(
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
        element,
        type,
    ) {
        return new Event(
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
            element,
            type,
        )
    }

    static Error(
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
        stacktrace,
        fatal
    ) {
        return new Event(
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
            null,
            null,
            stacktrace,
            fatal,
        )
    }
}
