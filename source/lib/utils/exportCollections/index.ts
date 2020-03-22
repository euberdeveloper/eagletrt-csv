import { DetailedExportSchema, ExportingCollection } from '../../interfaces/result';
import { Options } from '../../interfaces/options';
import { ExportResultCode } from '../../interfaces/result';

import { Database } from '../database';
import { Logger } from '../logger';
import { getPath } from './getPath';
import { parseRecords } from './parseRecords';
import { generateCsv } from './generateCsv';
import { EagleSession } from '../../interfaces/eagletrt';

function addExported(exportedCollections: DetailedExportSchema, db: string, collection: ExportingCollection): void {
    if (exportedCollections[db]) {
        exportedCollections[db].push(collection);
    }
    else {
        exportedCollections[db] = [collection];
    }
}

async function exportSession(db: string, collection: ExportingCollection, session: EagleSession, options: Options, database: Database, logger: Logger): Promise<boolean> {
    try {
        const outPath = getPath(db, collection, session.sessionName, options);
        const records = await Database.readRecords(database, db, collection.name, session.sessionName, collection);
        const parsedRecords = await parseRecords(records);
        await generateCsv(parsedRecords, outPath, collection);
    }
    catch (error) {
        logger.exportingCollectionStop(db, collection.name, false);
        if (options.warnIfOneFails) {
            logger.warn(`EagleCsv: error in exporting session ${session.sessionName} of collection ${collection.name} of db ${db}`, error);
        }
        if (options.throwIfOneFails) {
            throw error;
        }
        return false;
    }
}

async function exportCollection(db: string, collection: ExportingCollection, options: Options, exportedCollections: DetailedExportSchema, database: Database, logger: Logger): Promise<boolean> {
    try {
        logger.exportingCollectionStart(db, collection.name);
        const sessions = await Database.readSessions(database, db, collection.name, collection);
        let total = true;
        for (const session of sessions) {
            total = await exportSession(db, collection, session, options, database, logger) ? total : false;
        }
        logger.exportingCollectionStop(db, collection.name, true);
        addExported(exportedCollections, db, collection);
        return total;
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