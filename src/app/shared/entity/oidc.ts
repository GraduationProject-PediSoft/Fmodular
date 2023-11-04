/**
 * OIDC (Open ID Connect) entity
 * the system is designed to use with the outh2 protocol
 */
export class OIDCEntity {
    access_token: string = ""
    expires_in: string = ""
    refresh_expires_in: string = ""
    refresh_token: string = ""
    token_type: string = ""
    id_token: string = ""
    not_before_policy: string = ""
    session_state: string = ""
    scope: string = ""
}