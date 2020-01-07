import { DetailedExportSchema, ExportingCollection } from '../../interfaces/result';
import { Options } from '../../interfaces/options';
import { ExportResultCode } from '../../interfaces/result';

import { Database } from '../database';
import { Logger } from '../logger';
import { getPath } from './getPath';
import { parseRecords } from './parseRecords';
import { generateCsv } from './generateCsv';

function addExported(exportedCollections: DetailedExportSchema, db: string, collection: ExportingCollection): void {
    if (exportedCollections[db]) {
        exportedCollections[db].push(collection);
    }
    else {
        exportedCollections[db] = [collection];
    }
}

async function exportCollection(db: string, collection: ExportingCollection, options: Options, exportedCollections: DetailedExportSchema, database: Database, logger: Logger): Promise<boolean> {
    try {
        const outPath = getPath(db, collection, options);
        logger.exportingCollectionStart(db, collection.name);
        const records = await Database.readCollection(database, db, collection.name, collection);
        const parsedRecords = await parseRecords(records);
        await generateCsv(parsedRecords, outPath, collection);
        logger.exportingCollectionStop(db, collection.name, true);
        addExported(exportedCollections, db, collection);
        return true;
    }
    catch (error) {
        logger.exportingCollectionStop(db, collection.name, false);
        if (options.warnIfOneFails) {
            logger.warn(`EagleCsv: error in exporting collection ${collection.name} of db ${db}`, error);
        }
        if (options.throwIfOneFails) {
            throw error;
        }
        return false;
    }
}

async function exportDatabase(db: string, collections: ExportingCollection[], options: Options, exportedCollections: DetailedExportSchema, database: Database, logger: Logger): Promise<boolean> {
    let total = true;

    logger.exportingDatabase(db);
    for (const collection of collections) {
        total = await exportCollection(db, collection, options, exportedCollections, database, logger) ? total : false;
    }

    return total;
}

export async function exportCollections(schema: DetailedExportSchema, options: Options, database: Database, logger: Logger): Promise<{ exportedCollections: DetailedExportSchema, code: ExportResultCode }> {
    const exportedCollections: DetailedExportSchema = {};
    let code = ExportResultCode.TOTAL;

    await Database.connectDatabase(database);
    for (const db in schema) {
        code = await exportDatabase(db, schema[db], options, exportedCollections, database, logger) ? code : ExportResultCode.PARTIAL;
    }
    await Database.disconnectDatabase(database);

    return { exportedCollections, code };
}