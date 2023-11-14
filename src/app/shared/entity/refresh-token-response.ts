/**
 * Refresh token response to get a new access_token 
 */
export class RefreshTokenResponse{
    access_token: string = ""
    expires_in: string = ""
    refresh_expires_in: string = ""
    token_type: string = ""
    not_before_policy: string = ""
    scope: string = ""
}