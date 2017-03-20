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
            this._db.loadDatabase(err => {
                if (err) resolve(err.message); else resolve("success");
            });
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

    public async find<T>(query: any, sort?: any): Promise<Array<T>> {
        return new Promise<Array<T>>(resolve => {
            let findQuery = this._db.find(query);
            if (sort) {
                findQuery.sort(sort);
            }
            findQuery.exec((err: Error, documents: T[]) => {
                if (err) throw err;
                resolve(documents);
            });
        });
    }
}