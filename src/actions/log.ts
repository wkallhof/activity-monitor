import { Config } from "../config.default";
import { Activity } from "../models/activity";
import { DbUtility } from "../utilities/persistence/db-utility";
import * as template from "../templates/log-template";
import * as moment from "moment";
import * as _ from "lodash";
import * as ejs from "ejs";

export class Log {

    private _config: Config;
    private _currentActivity: Activity;
    private _dbUtility: DbUtility;
    private _options: any;

    constructor(options: any) {
        this._config = new Config();
        this._options = options;
        this._dbUtility = new DbUtility(this._config.historyPersistenceStorageFile);
        this._dbUtility.load();
    }

    public async logActivities(startDate: string, endDate: string) : Promise<void> {
        if (!startDate) throw new Error("No start date provided");
        const start = moment(startDate);
        if (!start.isValid()) throw new Error("Invalid start date format provided");
        if (!endDate) {
            this.render(await this.getSingleDay(start));
        } else {
            const end = moment(endDate);
            if (!end.isValid()) throw new Error("Invalid end date provided");
            this.render(await this.getRange(start, end));
        }
    }

    private async getSingleDay(date: moment.Moment): Promise<Array<Activity>> {
        const start = date.clone().startOf("day");
        const end = date.clone().endOf("day");
        return await this.getRange(start, end);
    }

    private async getRange(startDate: moment.Moment, endDate: moment.Moment): Promise<Array<Activity>> {
        let start = startDate.toDate();
        let end = endDate.toDate();

        let startQuery = { startTime: { $gte: start } };
        let endQuery = { startTime: { $lte: end } };

        return await this._dbUtility.find<Activity>({ $and: [startQuery, endQuery] }, {startTime : 1});
    }

    private render(activities: Array<Activity>) : void {
        if (!activities || activities.length <= 0) {
            console.log("No records to display for given dates");
        } else if (this._options.html) {
            this.renderHtml(activities);
        } else {
            console.log(activities);
        }
    }

    private renderHtml(activities: Array<Activity>): void {
        console.log(ejs.render(template.asString, { activities: activities, moment : moment, _ : _ }));
    }
}