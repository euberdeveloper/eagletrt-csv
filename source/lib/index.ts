export * from './errors';
export * from './interfaces/options';
export * from './interfaces/result';

import { Options } from './interfaces/options';
import { ExportResult } from './interfaces/result';

import { Logger } from './utils/logger';
import { mergeOptions } from './utils/options';
import { getParsedCollections, removeSchemaDetails } from './utils/getParsedCollections';
import { exportCollections } from './utils/exportCollections';
import { getMongoConnectionFromOptions } from './utils/connection';
import { Database } from './utils/database';

export async function mongoExport(options?: Options): Promise<ExportResult> {
    // Get purged options
    options = mergeOptions(options);
    // Instantiate logger util
    const logger = new Logger(options);
    // Get connection parameters
    const dbParams = await getMongoConnectionFromOptions(options);
    // Get parsed collections
    const parsedCollections = await getParsedCollections(options, dbParams, logger);
    // Log collections expected to be exported
    const expectedCollections = removeSchemaDetails(parsedCollections);
    logger.printExpectedCollections(expectedCollections);
    // Get database util
    const database = new Database(dbParams.uri, dbParams.options);
    // Export collections with mongoexport and get the ones succesfully exported
    const { exportedCollections, code } = await exportCollections(parsedCollections, options, database, logger);
    // Log collections succesfully exported
    const actualCollections = removeSchemaDetails(exportedCollections);
    logger.printExportedCollections(actualCollections);
    // Return the result
    return {
        code: code,
        expected: options.detailedResult ? parsedCollections : expectedCollections,
        actual: options.detailedResult ? exportedCollections : actualCollections
    };
}