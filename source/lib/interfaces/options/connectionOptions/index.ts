/**
 * The enum of the possible authentication mechanisms of MongoDB.
 */
export enum AuthenticationMechanism {
    SCRAM_SHA_1 = 'SCRAM-SHA-1',
    SCRAM_SHA_256 = 'SCRAM-SHA-256',
    MONGODB_X509 = 'MONGODB-X509',
    GSSAPI = 'GSSAPI',
    PLAIN = 'PLAIN',
    MONGODB_CR = 'MONGODB-CR'
}

/**
 * The replica set interface of the MongoDB connection.
 */
export interface ReplicaSet {
    /**
     * The host name
     */
    host: string;
    /**
     * The port number
     */
    port: string | number;
}

/**
 * The MongoDB connection options. This module uses under the hood the mongodb npm module. These
 * options will define both the uri and the options passed to the MongoClient.
 */
export interface ConnectionOptions {
    /**
     * The uri of the MongoDB connection.
     * If it is specified, the options
     * - host
     * - port
     * - password
     * - username
     * - srv
     * - authenticationMechanism
     * - authenticationDatabase
     * will be set to undefined and ignored.
     *
     * Default: undefind
     */
    uri?: string;
    /**
     * The host of the MongoDB connection.
     * It can be a string or an array of [[ReplicaSet]].
     *
     * Default: 'localhost'
     */
    host?: string | ReplicaSet[];
    /**
     * The port of the MongoDB connection.
     *
     * Default: 27017
     */
    port?: string | number;
    /**
     * The username of the MongoDB connection.
     *
     * Default: undefined
     */
    username?: string;
    /**
     * The password of the MongoDB connection.
     *
     * Default: undefined.
     */
    password?: string;
    /**
     * The authentication database of the MongoDB connection.
     *
     * Default: undefined
     */
    authenticationDatabase?: string;
    /**
     * The authentication mechanism of the MongoDB connection.
     *
     * Default: undefined
     */
    authenticationMechanism?: AuthenticationMechanism;
    /**
     * If the MongoDB connection uri is an srv.
     *
     * This property is not present in the mongoexport options, where
     * the "+srv" is added manually in the host option.
     *
     * Default: false;
     */
    srv?: boolean;
    /**
     * The replicaSetName of the MongoDB connection.
     *
     * This property is not present in the mongoexport options, where
     * the replica set name is passed in the uri options or in the host option.
     *
     * Default: undefined
     */
    replicaSetName?: string;
    /**
     * If the MongoDB connection uses ssl or tls.
     *
     * Default: false
     */
    ssl?: boolean;
    /**
     * The path to the ssl certificate file
     *
     * Default: undefined
     */
    sslCAFile?: string;
    /**
     * The path to the ssl the certificate-key
     *
     * Default: undefined
     */
    sslPEMKeyFile?: string;
    /**
     * The password to decrypt the ssl certificate-key file.
     *
     * Default: undefined
     */
    sslPEMKeyPassword?: string;
    /**
     * The path to the .pem file that contains the Certificate Revocation List.
     *
     * Default: undefined
     */
    sslCRLFile?: string;
    /**
     * Bypasses the validation checks for server certificates and allows the
     * use of invalid certificates. When using the allowInvalidCertificates
     * setting, MongoDB logs as a warning the use of the invalid certificate.
     *
     * Default: false
     */
    sslAllowInvalidCertificates?: boolean;
    /**
     * Disables the validation of the hostnames in TLS/SSL certificates.
     *
     * Default: false
     */
    sslAllowInvalidHostnames?: boolean;
}