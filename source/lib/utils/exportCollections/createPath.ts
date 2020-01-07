import * as fs from 'fs';
import * as util from 'util';
import { EagleCsvExportingError } from '../../errors';

const existsAsync = util.promisify(fs.exists);
const mkdirAsync = util.promisify(fs.mkdir);

export async function createPath(path: string): Promise<void> {
    try {
        if (!existsAsync(path)) {
            await mkdirAsync(path, { recursive: true });
        }
    }
    catch (error) {
        const info = { path };
        throw new EagleCsvExportingError('Error in creating folder', info, error);
    }
}