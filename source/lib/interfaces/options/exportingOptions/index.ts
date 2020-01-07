/**
 * The function type that can be used as value of the "collectionName" option.
 * @param db The database of the collection that will be exported
 * @param collection The the collection that will be exported
 * @returns The folder name of the exported collection
 */
export type ExportingCollectionName = string | ((db: string, collection: string) => string);
/**
 * The options about how the collections will be exported.
 *
 */
export interface ExportingOptions {
    /**
     * By default, the exported field names are included as the first
     * line in the csv output. This option avoid that.
     *
     * Default: false
     */
    noHeaderLine?: boolean;
    /**
     * Specifies a maximum number of documents to include in the export.
     *
     * Default: undefined
     */
    limit?: number;
    /**
     * Specifies a timestamp and only the records whose timestamp are after or equal to
     * that timestamp will be exported.
     *
     * NB: The timestamp is the sending timestamp
     *
     * Default: undefined
     */
    after?: number;
    /**
     * Specifies a timestamp and only the records whose timestamp are before or equal to
     * that timestamp will be exported.
     *
     * NB: The timestamp is the sending timestamp
     *
     * Default: undefined
     */
    before?: number;
    /**
     * If the collection folder will be prepended by the database of the collection.
     * The format is: "database_collection".
     *
     * When undefined, if the outType is 'deep' the file name is not prepended while
     * if the outType is 'flat' it is prepended
     *
     * Default: undefined
     */
    prependDbName?: boolean;
    /**
     * The string that overwrites the default name of the folder where the collection
     * is exported
     *
     * Default: undefined
     */
    collectionName?: string | ExportingCollectionName;
}
