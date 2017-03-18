import { BasePlatform, TakeScreenshotResult } from "./base-platform";
import { ScreenshotConfig } from "../screenshot-utility";
import * as path from "path";
import * as childProcess from "child_process";

export class Darwin extends BasePlatform {

    public async TakeScreenshot(config: ScreenshotConfig): Promise<TakeScreenshotResult> {
        let tempFileName = this.uniqueId() + ".png";
        let tempFullPath = path.resolve(path.join(__dirname, tempFileName));
        const captureResult = await this.capture(tempFullPath);
        const response = new TakeScreenshotResult();
        response.error = captureResult;
        response.tempPath = tempFullPath;
        return response;
    }

    private async capture(outPath: string) {
        var cmd = "screencapture";
		var args = [
			// will create PNG by default
			"-t",
			path.extname(outPath).toLowerCase().substring(1),
			"-x",
			outPath
		];

		var captureChild = childProcess.spawn(cmd, args);

        return new Promise<string>(resolve => {
            captureChild.on("close", resolve);
            captureChild.stderr.on("data", resolve);
        });
    }

    private uniqueId() : string {
		function s4() {
			return Math.floor((1 + Math.random()) * 0x10000)
				.toString(16)
				.substring(1);
		}
		return s4() + s4() + "-" + s4() + "-" + s4() + "-" + s4() + "-" + s4() + s4() + s4();
	}
}