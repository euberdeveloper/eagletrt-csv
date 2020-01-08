import complete from './complete/complete.test';
import getMongoConnection from './getMongoConnection/getMongoConnection.test';

describe('MongoBack module tests', function() {

    complete();
    getMongoConnection();

});