import { mongoExport, Options } from '../../../source/lib/index';

import * as path from 'path';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';
import sinon from 'sinon';

chai.use(chaiAsPromised);
import { expect } from 'chai';
import { removeExported } from '../../utils';
declare const console: {
    log: sinon.SinonStub<string[], void>,
    warn: sinon.SinonStub<any[], void>
};

const EXPORTED_PATH = path.join(__dirname, 'exported');

export default function () {

    describe('Test: log property', function () {

        this.timeout(0);
        this.beforeEach(function () {
            removeExported(EXPORTED_PATH);
            sinon.stub(console, 'log');
        });
        this.afterEach(function () {
            console.log.restore();
        });
        this.afterAll(function () {
            removeExported(EXPORTED_PATH);
        });

        it(`Should export the "test_service" database and log nothing (silent)`, async function () {

            const options: Options = {
                databases: 'test_service',
                outDir: EXPORTED_PATH,
                silent: true
            };
            await mongoExport(options);

            expect(console.log.notCalled).to.be.true;

        });

        it(`Should export the "test_service" database and log something`, async function () {

            const options: Options = {
                databases: 'test_service',
                outDir: EXPORTED_PATH,
                log: 'machine'
            };
            await mongoExport(options);

            expect(console.log.called).to.be.true;

        });

    });

}