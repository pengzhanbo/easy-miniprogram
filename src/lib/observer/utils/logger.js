class Logger {
    constructor() {
        this.prefix = '[Observer]';
    }

    log(...args) {
        console.log(`%c${this.prefix}:`, 'color: green', ...args);
    }

    warn(...args) {
        console.log(`%c${this.prefix}`, 'color: blue', ...args);
    }

    error(...args) {
        console.log(`%c${this.prefix}`, 'color: red', ...args);
    }
}

export const logger = new Logger();
