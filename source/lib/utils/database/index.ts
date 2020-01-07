import { MongoClient, MongoClientOptions, FilterQuery } from 'mongodb';
import { EagleCsvParsingError, EagleCsvExportingError } from '../../errors';
import { EagleRecord } from '../../interfaces/eagletrt';
import { ExportingOptions } from '../../interfaces/options';

export class Database {

    private uri: string;
    private connection: MongoClient = null;
    private options: MongoClientOptions = {
        useUnifiedTopology: true,
        useNewUrlParser: true
    };

    get connected(): boolean {
        return this.connection !== null;
    }

    private query(options: ExportingOptions): FilterQuery<any> {
        const id = { id: { $ne: undefined } };
        const after = options.after ? { timestamp: { $gte: options.after } } : null;
        const before = options.before ? { timestamp: { $lte: options.before } } : null;
        const and = [id, after, before].filter(filter => filter !== null);
        return { $and: and };
    }

    public constructor(uri: string, options: MongoClientOptions) {
        this.uri = uri;
        this.options = { ...options, ...this.options };
    }

    public async connect(): Promise<void> {
        this.connection = await MongoClient.connect(this.uri, this.options);
    }

    public async readCollection(db: string, collection: string, options: ExportingOptions): Promise<EagleRecord[]> {
        let query = this.connection.db(db).collection(collection).find(this.query(options));
        query = options.limit ? query.limit(options.limit) : query;
        return query.toArray();
    }

    public async disconnect(): Promise<void> {
        if (this.connected) {
            await this.connection.close();
            this.connection = null;
        }
    }

    public static async connectDatabase(database: Database): Promise<void> {
        try {
            await database.connect();
        }
        catch (error) {
            const info = {
                uri: database.uri,
                options: database.options
            };
            throw new EagleCsvParsingError('Error in connecting to mongo', info, error);
        }
    }

    public static async readCollection(database: Database, db: string, collection: string, options: ExportingOptions): Promise<EagleRecord[]> {
        try {
            return database.readCollection(db, collection, options);
        }
        catch (error) {
            const info = {
                uri: database.uri,
                options: database.options,
                db,
                collection,
                exportingOptions: options
            };
            throw new EagleCsvExportingError('Error in reading collection', info, error);
        }
    }

    public static async disconnectDatabase(database: Database): Promise<void> {
        try {
            await database.disconnect();
        }
        catch (error) {
            const info = {
                uri: database.uri,
                options: database.options
            };
            throw new EagleCsvParsingError('Error in disconnecting to mongo', info, error);
        }
    }

}