import { mongoExport, Options } from '../../../source/lib/index';

import * as fs from 'fs';
import * as path from 'path';
import * as chai from 'chai';
import chaiAsPromised from 'chai-as-promised';

chai.use(chaiAsPromised);
import { expect } from 'chai';
import { getResult, removeExported } from '../../utils';

const EXPORTED_PATH = path.join(__dirname, 'exported');
const EXPECTED_PATH = path.join(__dirname, 'expected');

export default function () {

    describe('Test: collections property (with databases)', function () {

        function getExpected(name: string): string {
            return require(path.join(EXPECTED_PATH, name));
        }

        this.timeout(0);
        this.beforeEach(function () {
            removeExported(EXPORTED_PATH);
        });
        this.afterAll(function () {
            removeExported(EXPORTED_PATH);
        });

        it(`Should export test_mattina1911_1730 of vadena_2511_round_1 and log_01911_1405 of log_volante_round_3`, async function () {

            const options: Options = {
                collections: {
                    vadena_2511_round_1mals: 'test_mattina1911_1730',
                    log_volante_round_3: 'log_01911_1405'
                },
                outDir: EXPORTED_PATH,
                silent: true
            };

            await mongoExport(options);
            const result = getResult(EXPORTED_PATH);
            const expected = getExpected('first');
            expect(result).to.equal(expected);

        });

    });

}