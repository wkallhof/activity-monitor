import * as moment from "moment";

export class Activity {

    private screenshots: Array<string>;
    public appName: string;
    public windowName: string;

    public startTime: moment.Moment;
    public endTime: moment.Moment;

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
        this.startTime = moment();
    }

    public endActivity() {
        this.endTime = moment();
    }
}