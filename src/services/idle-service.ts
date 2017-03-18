import { ServiceBase } from "./service-base";
import * as system from "@paulcbetts/system-idle-time";
export class IdleService extends ServiceBase {

    private _idleThresholdInSeconds: number;
    private _idlePollIntervalInSeconds: number;

    public static USER_ACTIVE_EVENT: string = "USER_ACTIVE_EVENT";
    public static USER_INACTIVE_EVENT: string = "USER_INACTIVE_EVENT";

    private _idleMessageSent: boolean = false;
    private _activeMessageSent: boolean = false;
    private _currentIntervalId: number;

    constructor(idleThresholdInSeconds: number, idlePollIntervalInSeconds: number) {
        super();
        this._idleThresholdInSeconds = idleThresholdInSeconds;
        this._idlePollIntervalInSeconds = idlePollIntervalInSeconds;
    }

    public start() {
        if (!super.canStart()) return;
        this._currentIntervalId = setInterval(this.tick.bind(this), this._idlePollIntervalInSeconds * 1000);
    }

    public stop() {
        if (!super.canStop()) return;
        clearInterval(this._currentIntervalId);
    }

    public tick() {
        // if idle time is above threshold, emit if we haven't yet
        if ((system.getIdleTime() > this._idleThresholdInSeconds * 1000)) {
            this._activeMessageSent = false;
            if (!this._idleMessageSent) {
                this.emit(IdleService.USER_INACTIVE_EVENT);
                this._idleMessageSent = true;
            }
        // idle isn't above threshold, emit active if we haven't already;
        } else {
            this._idleMessageSent = false;
            if (!this._activeMessageSent) {
                this.emit(IdleService.USER_ACTIVE_EVENT);
                this._activeMessageSent = true;
            }
        }
    }
}