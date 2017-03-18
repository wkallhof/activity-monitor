import { BasePlatform } from "./platform-handlers/base-platform";
import { Darwin } from "./platform-handlers/darwin";
import Jimp = require("jimp");

export class ScreenshotUtility {
    public static async captureDesktop(outPath: string, config: ScreenshotConfig): Promise<string> {
        if (config.height <= 0 || config.quality <= 0 || config.width <= 0)
            throw new Error("Invalid configuration");

        const platformHandler = this.fetchPlatformHandler();
        const result = await platformHandler.TakeScreenshot(config);
        if (result.error) throw new Error(result.error);

        return await this.processImage(result.tempPath, outPath, config);
    }

    private static fetchPlatformHandler() : BasePlatform {
        switch (process.platform) {
            case "darwin": return new Darwin();
            default: throw new Error("Platform not handled: " + process.platform);
        }
    }

    private static async processImage(tempPath: string, outPath: string, config: ScreenshotConfig) {
        let image = await Jimp.read(tempPath);
        await image.scaleToFit(config.width, config.height)
            .quality(config.quality)
            .write(outPath);
        return outPath;
    }
}

export class ScreenshotConfig {
    public width: number;
    public height: number;
    public quality: number;
}