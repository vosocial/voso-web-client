
/**
 * Represents a stripped down, critical set of properties that we initially
 * store in the DB when a new DeSo user connects to VoSo
 * @export
 * @interface IStoreableUser
 */
export interface IStoreableUser {
    id: string;
    canonicalUserName: string;
    desoUserName: string;
    desoPublicKeyBase58Check: string;
    desoIdentityUsersFromStorage?: string; // reserved
}