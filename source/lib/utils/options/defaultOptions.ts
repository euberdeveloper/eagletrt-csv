import { Options, ConnectionOptions, ExportingOptions, ExportedOptions, LogOptions, OutOptions } from '../../interfaces/options';

const DEFAULT_CONNECTION_OPTIONS: ConnectionOptions = {
    uri: undefined,
    host: 'localhost',
    port: 27017,
    username: undefined,
    password: undefined,
    authenticationDatabase: undefined,
    replicaSetName: undefined,
    srv: false,
    ssl: false,
    sslCAFile: undefined,
    sslPEMKeyFile: undefined,
    sslPEMKeyPassword: undefined,
    sslCRLFile: undefined,
    sslAllowInvalidCertificates: false,
    sslAllowInvalidHostnames: false,
    authenticationMechanism: undefined
};

const DEFAULT_EXPORTING_OPTIONS: ExportingOptions = {
    noHeaderLine: false,
    after: undefined,
    before: undefined,
    limit: undefined,
    prependDbName: false,
    collectionName: undefined
};

const DEFAULT_EXPORTED_OPTIONS: ExportedOptions = {
    all: false,
    databases: [],
    collections: [],
    throwIfLackOfPermissions: false,
    warnIfLackOfPermissions: false,
    throwIfOneFails: false,
    warnIfOneFails: false
};

const DEFAULT_LOG_OPTIONS: LogOptions = {
    silent: false,
    log: 'human',
    logCollections: false
};

const DEFAULT_OUT_OPTIONS: OutOptions = {
    outDir: './exported',
    outType: 'deep',
    detailedResult: false
};

export const DEFAULT_OPTIONS: Options = { 
    ...DEFAULT_CONNECTION_OPTIONS, 
    ...DEFAULT_EXPORTING_OPTIONS, 
    ...DEFAULT_EXPORTED_OPTIONS, 
    ...DEFAULT_LOG_OPTIONS,
    ...DEFAULT_OUT_OPTIONS 
};