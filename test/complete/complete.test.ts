import databases from './databases/databases.test';
import collections from './collections/collections.test';
import collectionsWithDatabases from './collectionsWithDatabases/collectionsWithDatabases.test';
import logger from './logger/logger.test';
import result from './result/result.test';

export default function () {
    
    describe('Test: mongoExport function', function () {

        databases();
        collections();
        collectionsWithDatabases();
        logger();
        result();

    });

}