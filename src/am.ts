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
            .option("--html", "Renders the output to html")
            .description("Outputs the log for the given <start> date. If the optional [end] date is provided, it will return logs for the range")
            .action((start, end, options) => this.runLogCommand(start, end, options));

        program.parse(process.argv);

        if (program.args.length === 0) program.help();
    }

    private runStartCommand() {
        let action = new Start();
        action.start();
    }

    private runLogCommand(start: string, end: string, options: any) {
        let log = new Log(options);
        log.logActivities(start, end).then(() => process.exit());
    }
}