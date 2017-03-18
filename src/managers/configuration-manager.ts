import * as os from "os";
import * as path from "path";
import { ScreenshotConfig } from "../utilities/screenshot/screenshot-utility";

export class ConfigurationManager {
    public timeBetweenHistoryPersistenceInSeconds: number = 30;
    public historyPersistenceStorageFile: string = path.join(os.homedir(), ".ActivityMonitor/activity.db");
    public timeBetweenWindowLoggingInSeconds: number = 5;
    public idleThresholdInSeconds: number = 30;
    public idlePollIntervalInSeconds: number = 5;
    public timeBetweenScreenshotsInSeconds: number = 30;
    public screenshotStorageDirectory: string = path.join(os.homedir(), ".ActivityMonitor/Screenshots");
    public screenshotImageSettings: ScreenshotConfig = {
        width: 900,
        height: 620,
        quality: 60
    };
}