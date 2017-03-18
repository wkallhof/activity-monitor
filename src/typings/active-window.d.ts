declare module "active-window" {
    export function getActiveWindow(callback: Function): void;
    export class Window{
        public app: string
        public title : string
    }
}