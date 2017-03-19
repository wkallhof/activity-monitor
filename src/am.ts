import * as program from "commander";
import { Start } from "./actions/start";
import { Log } from "./actions/log";

export class ActivityMonitor {

    constructor() {

        // START
        program.command("start")
            .description("Start the activity monitoring.")
            .action(() => this.runStartCommand());

        // LOG
        program.command("log <start> [end]")
            .description("Outputs the log for the given <start> date. If the optional [end] date is provided, it will return logs for the range")
            .action((start, end) => this.runLogCommand(start, end));

        program.parse(process.argv);

        if (program.args.length === 0) program.help();
    }

    private runStartCommand() {
        let action = new Start();
        action.start();
    }

    private runLogCommand(start: string, end: string) {
        let log = new Log();
        log.getActivities(start, end).then(activities => {
            if (activities.length <= 0) {
                console.log("No records for given dates");
            } else {
                console.log(activities);
            }

            process.exit();
        });
    }
}