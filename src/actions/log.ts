import { Config } from "../config.default";
import { Activity } from "../models/activity";
import { DbUtility } from "../utilities/persistence/db-utility";
import * as moment from "moment";

export class Log {

    private _config: Config;
    private _currentActivity: Activity;
    private _dbUtility: DbUtility;

    constructor() {
        this._config = new Config();

        this._dbUtility = new DbUtility(this._config.historyPersistenceStorageFile);
        this._dbUtility.load();
    }

    public async getActivities(startDate: string, endDate: string) : Promise<Array<Activity>> {
        if (!startDate) throw new Error("No start date provided");
        const start = moment(startDate);
        if (!start.isValid()) throw new Error("Invalid start date format provided");
        if (!endDate) return await this.getSingleDay(start);

        const end = moment(endDate);
        if (!end.isValid()) throw new Error("Invalid end date provided");
        return await this.getRange(start, end);
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

        console.log(`Checking for activities between ${start} and ${end}`);
        return await this._dbUtility.find<Activity>({ $and: [startQuery, endQuery] });
    }
}