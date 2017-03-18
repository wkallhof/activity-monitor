import { ScreenshotConfig } from "../screenshot-utility";

export abstract class BasePlatform {
    public abstract async TakeScreenshot(config: ScreenshotConfig): Promise<TakeScreenshotResult>;
}

export class TakeScreenshotResult {
    public tempPath: string;
    public error: string;
}