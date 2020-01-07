import { EagleCsvError } from './eagleCsvError';

/**
 * The EagleCsvError that happens when exporting the mongodb collections
 */
export class EagleCsvExportingError extends EagleCsvError {

    private static readonly DEFAULT_MESSAGE = 'Error while exporting the collections';r;

    constructor(message?: string, info?: any, triggerError?: Error) {
        super(message || EagleCsvExportingError.DEFAULT_MESSAGE, info, triggerError);
        this.name = 'EagleCsvExportingError';
    }

}