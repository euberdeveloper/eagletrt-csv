import { EagleCsvError } from './eagleCsvError';

/**
 * The EagleCsvError that happens when parsing the mongodb collections
 */
export class EagleCsvParsingError extends EagleCsvError {

    private static readonly DEFAULT_MESSAGE = 'Error while parsing the collections';

    constructor(message?: string, info?: any, triggerError?: Error) {
        super(message || EagleCsvParsingError.DEFAULT_MESSAGE, info, triggerError);
        this.name = 'EagleCsvParsingError';
    }

}