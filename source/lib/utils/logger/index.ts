import ora from 'ora';
import chalk from 'chalk';

import { LogOptions } from '../../interfaces/options';
import { ExportSchema } from '../../interfaces/result';

export class Logger {

    private human = false;
    private machine = false;
    private logCollections = false;
    private spinners = {};

    constructor(options: LogOptions) {
        if (!options.silent) {
            this.human = options.log === 'human';
            this.machine = options.log === 'machine';
            this.logCollections = options.logCollections;
        }
    }

    public logMachine(message: string, object?: any): void {
        if (this.machine) {
            const timestamp = Date.now();
            const text = `[${timestamp}] ${message}`;
            if (object) {
                console.log(text, object);
            }
            else {
                console.log(text);
            }
        }
    }

    public warnMachine(message: string, object?: any): void {
        if (this.machine) {
            const timestamp = Date.now();
            const text = `[${timestamp}] ${message}`;
            if (object) {
                console.warn(text, object);
            }
            else {
                console.warn(text);
            }
        }
    }

    public exportingDatabase(db: string): void {
        if (this.human) {
            console.log(chalk.white(db));
        }
        else if (this.machine) {
            this.logMachine(`DATABASE ${db}`);
        }
    }

    public exportingCollectionStart(db: string, collection: string): void {
        if (this.human) {
            const spinner = ora({
                text: chalk.grey(collection),
                indent: 2,
                spinner: 'dots2'
            }).start();
            this.spinners[`${db}${collection}`] = spinner;
        }
        else if (this.machine) {
            this.logMachine(`COLLECTION STARTED ${collection}`);
        }
    }

    public exportingCollectionStop(db: string, collection: string, succeded: boolean): void {
        if (this.human) {
            const spinner = this.spinners[`${db}${collection}`];
            if (succeded) {
                spinner.succeed();
            }
            else {
                spinner.fail();
            }
        }
        else if (this.machine) {
            const esito = succeded ? 'SUCCEDED' : 'FAILED';
            this.logMachine(`COLLECTION ${esito} ${collection}`);
        }
    }

    public printExpectedCollections(expected: ExportSchema): void {
        if (this.logCollections) {
            if (this.human) {
                const tag = chalk.keyword('yellow')('[COLLECTIONS TO EXPORT]');
                const text = JSON.stringify(expected, null, 2);
                console.log(`${tag}\n${text}`);
            }
            else if (this.machine) {
                this.logMachine('EXPECTED', expected);
            }
        }
    }

    public printExportedCollections(exported: ExportSchema): void {
        if (this.logCollections) {
            if (this.human) {
                const tag = chalk.keyword('yellow')('[COLLECTIONS EXPORTED]');
                const text = JSON.stringify(exported, null, 2);
                console.log(`${tag}\n${text}`);
            }
            else if (this.machine) {
                this.logMachine('EXPORTED', exported);
            }
        }
    }

    public warn(message: string, error: any): void {
        if (this.machine) {
            this.warnMachine(`WARNING ${message}`, error);
        }
        else {
            const tag = chalk.keyword('yellow')('[WANING]');
            const text = chalk.keyword('orange')(message);
            console.warn(`${tag} ${text}`, error);
        }
    }

}