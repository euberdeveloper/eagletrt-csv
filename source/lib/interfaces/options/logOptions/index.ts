/**
 * The various log types
 *
 * - 'human': A human log, with colors and spinners
 * - 'machine': A machine log, with timestamp and no colors and spinners
 */
export type LogType = 'human' | 'machine';
/**
 * The options about what will be logged during the function execution
 */
export interface LogOptions {
    /**
     * If nothing will be logged.
     *
     * Default: false
     */
    silent?: boolean;
    /**
     * The log type.
     *
     * Possible values:
     * - 'human': A human log, with colors and spinners.
     * - 'machine': A machine log, with timestamp and no colors and spinners.
     *
     * Default: 'human'
     */
    log?: LogType;
    /**
     * If the collections expected to be exported and the collections correctly exported
     * are logged.
     * 
     * Default: false
     */
    logCollections?: boolean;
}
