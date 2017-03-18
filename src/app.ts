import * as os from "os";
import { ConfigurationManager } from "./managers/configuration-manager";
import { IdleService } from "./services/idle-service";
import { ScreenshotService } from "./services/screenshot-service";
import { WindowActivityService } from "./services/window-activity-service";
import { ServiceBase } from "./services/service-base";
import { Window } from "active-window";
import { Activity } from "./activity";
import { DbUtility } from "./utilities/persistence/db-utility";
import * as fs from "fs-extra";
import * as path from "path";

export class App {

    private _config: ConfigurationManager;
    private _idleService: IdleService;
    private _screenshotService: ScreenshotService;
    private _windowActivityService: WindowActivityService;
    private _services: Array<ServiceBase>;
    private _currentActivity: Activity;
    private _activityHistory: Array<Activity>;
    private _currentIntervalId: number;
    private _lastSavedHistoryFile: string;
    private _shouldPersistHistory: boolean;
    private _dbUtility: DbUtility;

    constructor() {
        this._config = new ConfigurationManager();
        this._activityHistory = new Array<Activity>();

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
        console.log("APP START CALLED");
        this._services.forEach((service: ServiceBase) => service.start());
        this._currentIntervalId = setInterval(this.persistHistory.bind(this), this._config.timeBetweenHistoryPersistenceInSeconds * 1000);
    }

    public stop() : void {
        this._services.forEach((service: ServiceBase) => service.stop());
        clearInterval(this._currentIntervalId);
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

    private onActiveWindowStatus(window: Window) : void {
        // same task, ignore
        if (this._currentActivity != null
            && this._currentActivity.appName === window.app
            && this._currentActivity.windowName === window.title) {
            this._shouldPersistHistory = false;
            return;
        }
        // not the same task, current task in progress
        if (this._currentActivity != null) {
            this._currentActivity.endActivity();
            this._activityHistory.push(this._currentActivity);
        }

        // start new activity        
        this._currentActivity = new Activity(window.app, window.title);
        this._currentActivity.startActivity();
        this._shouldPersistHistory = true;

        console.log(`Current activity : App : ${this._currentActivity.appName} Title : ${this._currentActivity.windowName}`);
    }

    private persistHistory(): void {
        const fileDateFormat = "MM-DD-YYYY_hh-mm-ss-a";
        if (this._activityHistory.length <= 0 || !this._shouldPersistHistory) return;

        const firstActivity = this._activityHistory[0];
        const lastActivity = this._activityHistory[this._activityHistory.length - 1];

        const fileName = `${firstActivity.startTime.format(fileDateFormat)}-${lastActivity.endTime.format(fileDateFormat)}.json`;
        const fullPath = path.join(this._config.historyPersistenceStorageDirectory, fileName);
        fs.writeFile(fullPath, JSON.stringify(this._activityHistory), err => {
            if (err) console.log(err);

            console.log("History updated: " + fullPath);
            if (this._lastSavedHistoryFile && fullPath !== this._lastSavedHistoryFile) {
                fs.unlink(this._lastSavedHistoryFile, err => {
                    if (err) console.log(err);
                });
            }
            this._lastSavedHistoryFile = fullPath;
        });
    }
}