import { MongoClient, MongoClientOptions, FilterQuery } from 'mongodb';
import { EagleCsvParsingError, EagleCsvExportingError } from '../../errors';
import { EagleRecord, EagleSession } from '../../interfaces/eagletrt';
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

    private queryRecords(session: string, options: ExportingOptions): FilterQuery<any> {
        const id = { id: { $ne: undefined } };
        const sessionFilter = { sessionName: session };
        const optionsQuery = typeof options.query === 'string' ? JSON.parse(options.query) : (options.query || null);
        const after = options.after ? { timestamp: { $gte: options.after } } : null;
        const before = options.before ? { timestamp: { $lte: options.before } } : null;
        const and = [id, after, before, sessionFilter, optionsQuery].filter(filter => filter !== null);
        return { $and: and };
    }

    private querySessions(options: ExportingOptions): FilterQuery<any> {
        const id = { id: undefined };
        const optionsQuery = typeof options.query === 'string' ? JSON.parse(options.query) : (options.query || null);
        const after = options.after ? { timestamp: { $gte: options.after } } : null;
        const before = options.before ? { timestamp: { $lte: options.before } } : null;
        const and = [id, after, before, optionsQuery].filter(filter => filter !== null);
        return { $and: and };
    }

    public constructor(uri: string, options: MongoClientOptions) {
        this.uri = uri;
        this.options = { ...options, ...this.options };
    }

    public async connect(): Promise<void> {
        this.connection = await MongoClient.connect(this.uri, this.options);
    }

    public async readSessions(db: string, collection: string, options: ExportingOptions): Promise<EagleSession[]> {
        let query = this.connection.db(db).collection(collection).find(this.querySessions(options));
        query = options.limit ? query.limit(options.limit) : query;
        return query.toArray();
    }

    public async readRecords(db: string, collection: string, session: string, options: ExportingOptions): Promise<EagleRecord[]> {
        let query = this.connection.db(db).collection(collection).find(this.queryRecords(session, options));
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

    public static async readSessions(database: Database, db: string, collection: string, options: ExportingOptions): Promise<EagleSession[]> {
        try {
            return database.readSessions(db, collection, options);
        }
        catch (error) {
            const info = {
                uri: database.uri,
                options: database.options,
                db,
                collection,
                exportingOptions: options
            };
            throw new EagleCsvExportingError('Error in reading collection sessions', info, error);
        }
    }

    public static async readRecords(database: Database, db: string, collection: string, session: string, options: ExportingOptions): Promise<EagleRecord[]> {
        try {
            return database.readRecords(db, collection, session, options);
        }
        catch (error) {
            const info = {
                uri: database.uri,
                options: database.options,
                db,
                collection,
                exportingOptions: options
            };
            throw new EagleCsvExportingError('Error in reading collection records', info, error);
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