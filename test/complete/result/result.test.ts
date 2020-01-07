import { mongoExport, Options, ExportResultCode, ExportResult, ExportingOptions } from '../../../source/lib/index';

import * as path from 'path';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
import { expect } from 'chai';
import { removeExported } from '../../utils';

const EXPORTED_PATH = path.join(__dirname, 'exported');

export default function () {

    describe('Test: result of the function', function () {

        this.timeout(0);
        this.beforeEach(function () {
            removeExported(EXPORTED_PATH);
        });
        this.afterAll(function () {
            removeExported(EXPORTED_PATH);
        });

        it(`Should result is TOTAL`, async function () {

            const options: Options = {
                collections: /^log/,
                outDir: EXPORTED_PATH,
                silent: true
            };
            const result = await mongoExport(options);

            const expected = ExportResultCode.TOTAL;
            expect(result.code).to.equal(expected);

        });

    });

}