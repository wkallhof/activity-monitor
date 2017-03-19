import * as moment from "moment";

export class Activity {

    private screenshots: Array<string>;
    public appName: string;
    public windowName: string;

    public startTime: Date;
    public endTime: Date;

    constructor(appName: string, windowName: string) {
        this.appName = appName;
        this.windowName = windowName;
        this.screenshots = new Array<string>();
    }

    public addScreenshotReference(url: string) {
        if (url.length <= 0) return;

        this.screenshots.push(url);
    }

    public startActivity() {
        this.startTime = moment().toDate();
    }

    public endActivity() {
        this.endTime = moment().toDate();
    }
}