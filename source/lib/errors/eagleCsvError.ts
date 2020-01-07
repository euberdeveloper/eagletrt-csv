/**
 * The class of the errors of the module eagletrt-csv
 */
export class EagleCsvError extends Error {
    /**
     * The error that triggered the problem
     */
    triggerError: Error;

    constructor(message: string, triggerError?: Error) {
        super(message);
        this.name = 'EagleCsvError';
        this.triggerError = triggerError || null;
    }
}