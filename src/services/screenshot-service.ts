import { ServiceBase } from "./service-base";
import * as screenshot from "desktop-screenshot";
import * as path from "path";
import * as moment from "moment";
import * as fs from "fs-extra";
import { ScreenshotUtility, ScreenshotConfig } from "../utilities/screenshot/screenshot-utility";

export class ScreenshotService extends ServiceBase {

    private _screenshotStorageDirectory: string;
    private _timeBetweenScreenshotsInSeconds: number;
    private _screenshotConfig: ScreenshotConfig;

    public static SCREENSHOT_SUCCESS: string = "SCREENSHOT_SUCCESS";
    public static SCREENSHOT_ERROR: string = "SCREENSHOT_ERROR";

    private _currentIntervalId: number;

    constructor(screenshotStorageDirectory: string, timeBetweenScreenshotsInSeconds: number, screenshotConfig: ScreenshotConfig) {
        super();
        this._screenshotStorageDirectory = screenshotStorageDirectory;
        this._timeBetweenScreenshotsInSeconds = timeBetweenScreenshotsInSeconds;
        this._screenshotConfig = screenshotConfig;
    }

    public start() {
        if (!super.canStart()) return;
        this._currentIntervalId = setInterval(this.tick.bind(this), this._timeBetweenScreenshotsInSeconds * 1000);
    }

    public stop() {
        if (!super.canStop()) return;
        clearInterval(this._currentIntervalId);
    }

    public tick() {
        const dateFolder = moment().format("MM-DD-YYYY");
        const file = moment().format("hh-mm-ss-a") + ".jpg";
        const fullFolderPath = path.join(this._screenshotStorageDirectory, dateFolder);
        const fullFilePath = path.join(fullFolderPath, file);
        fs.ensureDir(fullFolderPath, (err: Error) => {
            if (err) console.log(err); // => null

            ScreenshotUtility.captureDesktop(fullFilePath, this._screenshotConfig)
                .then(outPath => this.emitScreenshot(outPath))
                .catch(err => this.emitError(err));
        });
    }

    public emitScreenshot(path: string) {
        this.emit(ScreenshotService.SCREENSHOT_SUCCESS, path);
    }

    public emitError(error: string) {
        this.emit(ScreenshotService.SCREENSHOT_ERROR, error);
    }
}