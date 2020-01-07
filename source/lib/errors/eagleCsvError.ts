/**
 * The class of the errors of the module eagletrt-csv
 */
export class EagleCsvError extends Error {
    /**
     * The error that triggered the problem
     */
    triggerError: Error;
    /**
     * Additional information object
     */
    info: any;

    constructor(message: string, info?: any, triggerError?: Error) {
        super(message);
        this.name = 'EagleCsvError';
        this.info = info || null;
        this.triggerError = triggerError || null;
    }
}