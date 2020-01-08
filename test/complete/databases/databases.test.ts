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

    describe('Test: databases property', function () {

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

        it(`Should export everything`, async function () {

            const options: Options = {
                all: true,
                outDir: EXPORTED_PATH,
                silent: true
            };

            await mongoExport(options);
            const result = getResult(EXPORTED_PATH);
            const expected = getExpected('first');
            expect(result).to.equal(expected);

        });

        it(`Should export databases vadena_2511_round_1 and vadena_2511_round_2`, async function () {

            const options: Options = {
                databases: ['vadena_2511_round_1', 'vadena_2511_round_1'],
                outDir: EXPORTED_PATH,
                silent: true
            };

            await mongoExport(options);
            const result = getResult(EXPORTED_PATH);
            const expected = getExpected('second');
            expect(result).to.equal(expected);

        });

        it(`Should export databases containing "log"`, async function () {

            const options: Options = {
                databases: /log/,
                outDir: EXPORTED_PATH,
                silent: true
            };

            await mongoExport(options);
            const result = getResult(EXPORTED_PATH);
            const expected = getExpected('third');
            expect(result).to.equal(expected);

        });

    });

}