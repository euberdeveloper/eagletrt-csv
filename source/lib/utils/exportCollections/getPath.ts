import { join } from 'path';

import { ExportingCollection } from '../../interfaces/result';
import { Options } from '../../interfaces/options';

export function getPath(db: string, collection: ExportingCollection, options: Options): string {
    let result = '';

    switch (options.outType) {
        case 'deep':
            result = join(options.outDir, db);
            break;
        case 'flat':
            result = join(options.outDir);
            break;
    }

    if (collection.collectionName) {
        const collectionName = collection.collectionName
        result = typeof collectionName === 'string' 
            ? join(result, collectionName)
            : join(result, collectionName(db, collection.name));
    }
    else {
        if (collection.prependDbName || (options.outType === 'flat' && collection.prependDbName !== false)) {
            result = join(result, `${db}_${collection.name}`);
        }
        else {
            result = join(result, collection.name);
        }
    }

    return result;
}