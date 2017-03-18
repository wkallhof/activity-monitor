import * as Datastore from "nedb";

export class DbUtility {

    private _dbPath: string;
    private _db: Datastore;

    public constructor(dbPath: string) {
        this._dbPath = dbPath;
        this._db = new Datastore({ filename: dbPath });
    }

    public async load(): Promise<string> {
        return new Promise<string>(resolve => {
            this._db.loadDatabase(err => resolve(err.message));
        });
    }

    public async insert<T>(value: T): Promise<T> {
        return new Promise<T>(resolve => {
            this._db.insert(value, (err: Error, doc: T) => {
                if (err) throw err;
                resolve(doc);
            });
        });

    }
}