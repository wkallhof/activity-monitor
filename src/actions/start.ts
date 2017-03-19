import * as os from "os";
import { Config } from "../config.default";
import { IdleService } from "../services/idle-service";
import { ScreenshotService } from "../services/screenshot-service";
import { WindowActivityService } from "../services/window-activity-service";
import { ServiceBase } from "../services/service-base";
import { Window } from "active-window";
import { Activity } from "../models/activity";
import { DbUtility } from "../utilities/persistence/db-utility";
import * as fs from "fs-extra";
import * as path from "path";

export class Start {

    private _config: Config;
    private _idleService: IdleService;
    private _screenshotService: ScreenshotService;
    private _windowActivityService: WindowActivityService;
    private _services: Array<ServiceBase>;
    private _currentActivity: Activity;
    private _dbUtility: DbUtility;

    constructor() {
        this._config = new Config();

        // define the idle service;        
        this._idleService = new IdleService(this._config.idleThresholdInSeconds, this._config.idlePollIntervalInSeconds);

        // define the screenshot service
        this._screenshotService = new ScreenshotService(
            this._config.screenshotStorageDirectory,
            this._config.timeBetweenScreenshotsInSeconds,
            this._config.screenshotImageSettings);

        // define the window activity service
        this._windowActivityService = new WindowActivityService(this._config.timeBetweenWindowLoggingInSeconds);

        // create service array        
        this._services = new Array<ServiceBase>(this._idleService, this._screenshotService, this._windowActivityService);

        this._dbUtility = new DbUtility(this._config.historyPersistenceStorageFile);
        this._dbUtility.load();

        this.bind();
    }

    private bind() {
        this._idleService.on(IdleService.USER_ACTIVE_EVENT, this.onUserActive.bind(this));
        this._idleService.on(IdleService.USER_INACTIVE_EVENT, this.onUserInactive.bind(this));

        this._screenshotService.on(ScreenshotService.SCREENSHOT_SUCCESS, this.onScreenshotSuccess.bind(this));
        this._screenshotService.on(ScreenshotService.SCREENSHOT_ERROR, this.onScreenshotError.bind(this));

        this._windowActivityService.on(WindowActivityService.ACTIVE_WINDOW_STATUS, this.onActiveWindowStatus.bind(this));
    }

    public start(): void {
        this._services.forEach((service: ServiceBase) => service.start());
    }

    public stop() : void {
        this._services.forEach((service: ServiceBase) => service.stop());
    }

    private onUserActive() : void {
        console.log("User is now active.");
        this._screenshotService.start();
        this._windowActivityService.start();
    }

    private onUserInactive() : void {
        console.log("User is now inactive.");
        this._screenshotService.stop();
        this._windowActivityService.stop();
    }

    private onScreenshotSuccess(path: string) : void {
        console.log("Screenshot logged : " + path);
        if (this._currentActivity != null)
            this._currentActivity.addScreenshotReference(path);
    }

    private onScreenshotError(error: string) : void {
        console.log("Error taking screenshot : " + error);
    }

    private async onActiveWindowStatus(window: Window) : Promise<void> {
        // same task, ignore
        if (this._currentActivity != null
            && this._currentActivity.appName === window.app
            && this._currentActivity.windowName === window.title) return;

        // not the same task, current task in progress
        if (this._currentActivity != null) {
            this._currentActivity.endActivity();
            await this._dbUtility.insert(this._currentActivity);
        }

        // start new activity        
        this._currentActivity = new Activity(window.app, window.title);
        this._currentActivity.startActivity();

        console.log(`Activity Started : ${this._currentActivity.appName} - ${this._currentActivity.windowName} ${this._currentActivity.startTime}`);
    }
}