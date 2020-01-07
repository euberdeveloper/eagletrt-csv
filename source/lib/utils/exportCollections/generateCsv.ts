import * as fs from 'fs';
import * as path from 'path';
import * as util from 'util';

import { EagleGroup, instanceOfEagleGroup, EagleMessages } from "../../interfaces/eagletrt";
import { ExportingOptions } from '../../interfaces/options';
import { EagleCsvExportingError } from '../../errors';
import { createPath } from "./createPath";

const mkdirAsync = util.promisify(fs.mkdir);
const writeFileAsync = util.promisify(fs.writeFile);

async function saveCsv(path: string, content: string): Promise<void> {
    try {
        await writeFileAsync(path, content);
    }
    catch (error) {
        const info = {
            path,
            content
        };
        throw new EagleCsvExportingError('Error in writing csv file', info, error);
    }
}

async function createFolder(path: string): Promise<void> {
    try {
        await mkdirAsync(path);
    }
    catch (error) {
        const info = {
            path
        };
        throw new EagleCsvExportingError('Error in creating folder', info, error);
    }
}

async function generateFile(messages: EagleMessages, path: string, options: ExportingOptions): Promise<void> {
    if (messages && messages.length) {
        let keysRow: string, valueRows: string[];
        if (typeof messages[0].value === 'object') {
            keysRow = ['timestamp', ...Object.keys(messages[0].value)].join('\t');
            valueRows = messages.sort((x, y) => x.timestamp - y.timestamp).map(el => {
                let row = '';
                row += `${el.timestamp}\t`;
                row += Object.keys(el.value).map(key => `${el.value[key]}`).join('\t');
                return row;
            });
        }
        else {
            keysRow = ['timestamp', 'value'].join('\t');
            valueRows = messages.sort((x, y) => x.timestamp - y.timestamp).map(el => {
                let row = '';
                row += `${el.timestamp}\t`;
                row += `${el.value}`;
                return row;
            });
        }
        const rows = options.noHeaderLine ? valueRows : [keysRow, ...valueRows];
        const content = rows.join('\n');
        await saveCsv(path, content);
    }
}

async function generateFiles(record: EagleGroup, outPath: string, options: ExportingOptions): Promise<void> {
    for (const key in record) {
        const messages = record[key];

        if (instanceOfEagleGroup(messages)) {
            const newPath = path.join(outPath, key);
            await createFolder(newPath)
            await generateFiles(messages, newPath, options);
        }
        else {
            await generateFile(messages, outPath, options);
        }
    }
}

export async function generateCsv(record: EagleGroup, outPath: string, options: ExportingOptions): Promise<void> {
    await createPath(outPath);
    await generateFiles(record, outPath, options);
}