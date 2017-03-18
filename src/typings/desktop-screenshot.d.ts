interface SreenshotStatic {
    (host: string, options?: any): any;
}

declare module "desktop-screenshot" {
    export = screenshot;
}

declare var screenshot: SreenshotStatic;