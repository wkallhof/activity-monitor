import { ServiceBase } from "./service-base";
import { getActiveWindow, Window } from "active-window";
import * as path from "path";

export class WindowActivityService extends ServiceBase {

    private _timeBetweenWindowLoggingInSeconds: number;

    public static ACTIVE_WINDOW_STATUS: string = "ACTIVE_WINDOW_STATUS";

    private _currentIntervalId: number;

    constructor(timeBetweenWindowLoggingInSeconds: number) {
        super();
        this._timeBetweenWindowLoggingInSeconds = timeBetweenWindowLoggingInSeconds;
    }

    public start() {
        if (!super.canStart()) return;
        this._currentIntervalId = setInterval(this.tick.bind(this), this._timeBetweenWindowLoggingInSeconds * 1000);
    }

    public stop() {
        if (!super.canStop()) return;
        clearInterval(this._currentIntervalId);
    }

    public tick() {
        getActiveWindow(this.onGetActiveWindowResponse.bind(this));
    }

    public onGetActiveWindowResponse(window: Window) {
        if (!window || !window.app || !window.title) {
            throw Error("Unable to process window");
        }

        this.emit(WindowActivityService.ACTIVE_WINDOW_STATUS, window);
    }
}