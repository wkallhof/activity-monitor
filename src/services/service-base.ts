import { EventEmitter } from "events";
export abstract class ServiceBase extends EventEmitter {

    private _running: boolean = false;

    constructor() {
        super();
    }
    public abstract start(): void;

    public abstract stop(): void;

    public canStart() : boolean {
        if (this._running) {
            return false;
        } else {
            this._running = true;
            return true;
        }
    }

    public canStop() : boolean {
        if (!this._running) {
            return false;
        } else {
            this._running = false;
            return true;
        }
    }
}