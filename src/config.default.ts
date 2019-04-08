import * as os from "os";
import * as path from "path";
import { ScreenshotConfig } from "./utilities/screenshot/screenshot-utility";

export class Config {
    public historyPersistenceStorageFile: string = path.join(os.homedir(), ".am/activity.db");
    public timeBetweenWindowLoggingInSeconds: number = 15;
    public idleThresholdInSeconds: number = 120;
    public idlePollIntervalInSeconds: number = 5;
    public timeBetweenScreenshotsInSeconds: number = 60;
    public screenshotStorageDirectory: string = path.join(os.homedir(), ".am/Screenshots");
    public screenshotImageSettings: ScreenshotConfig = {
        width: 900,
        height: 620,
        quality: 60
    };
}