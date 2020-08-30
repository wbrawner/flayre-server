export function randomId(length) {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"
    let id = ""
    while (id.length < length) {
        id += characters[Math.floor(Math.random() * characters.length)]
    }
    return id
}

export function firstOfMonth() {
    const d = new Date();
    d.setUTCDate(1);
    d.setUTCHours(0, 0, 0, 0);
    return d;
}

export function lastOfMonth() {
    const d = new Date();
    d.setUTCMonth(d.getUTCMonth() + 1)
    d.setUTCDate(0);
    d.setUTCHours(23, 59, 59, 999);
    return d;
}
