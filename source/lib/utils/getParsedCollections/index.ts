import { MongoScanner, ScanOptions, MongoScannerError, ListDatabasesError, ListCollectionsError } from 'mongo-scanner';

import { Options } from '../../interfaces/options';
import { ConnectionParameters } from '../../interfaces/connection';
import { ExportSchema, DetailedExportSchema } from '../../interfaces/result';

import { Logger } from '../logger';
import { purgeExportingOptions } from './purgeExportingOptions';
import { divideCollections } from './parseCollection';
import { parseSpecificCollections } from './parseSpecificCollections';
import { parseGeneralCollections } from './parseGeneralCollections';
import { parseDatabases } from './parseDatabases';
import { parseAll } from './parseAll';
import { EagleCsvParsingError } from '../../errors';

function getWarnMessage(options: Options, logger: Logger) {
    if (options.warnIfLackOfPermissions) {
        return (db: string, error: ListDatabasesError | ListCollectionsError) => {
            let message = error instanceof ListCollectionsError 
                ? `EagleCsv: cannot list collections of ${db}`
                : 'EagleCsv: cannot list databases';
            logger.warn(message, error);
        };
    }
    else {
        return undefined;
    }
}

export async function getParsedCollections(options: Options, dbParams: ConnectionParameters, logger: Logger): Promise<DetailedExportSchema> {
    const result: DetailedExportSchema = {};
    const mongoScannerOptions: ScanOptions = {
        useCache: true, 
        excludeDatabases: ['admin', 'config', 'local'],
        excludeSystem: false,
        ignoreLackOfPermissions: !options.throwIfLackOfPermissions,
        onLackOfPermissions: getWarnMessage(options, logger)
    };
    const mongoScanner = new MongoScanner(dbParams.uri, dbParams.options, mongoScannerOptions);

    const rootOptions = purgeExportingOptions(options);
    const collections = Array.isArray(options.collections) ? options.collections : [options.collections];
    const { specific, general } = divideCollections(collections);
    const databases = Array.isArray(options.databases) ? options.databases : [options.databases];
    const all = options.all;

    try {
        await mongoScanner.startConnection();
        await parseSpecificCollections(rootOptions, specific, result, mongoScanner);
        await parseGeneralCollections(rootOptions, general, result, mongoScanner);
        await parseDatabases(rootOptions, databases, result, mongoScanner);
        await parseAll(rootOptions, all, result, mongoScanner);
        await mongoScanner.endConnection();
    }
    catch (error) {
        throw new EagleCsvParsingError(null, null, error);
    }

    return result;
}

export function removeSchemaDetails(detailedExportSchema: DetailedExportSchema): ExportSchema {
    const purged: ExportSchema = {};

    for (const db in detailedExportSchema) {
        const collections = detailedExportSchema[db].map(collection => collection.name);
        purged[db] = collections;
    }

    return purged;
}