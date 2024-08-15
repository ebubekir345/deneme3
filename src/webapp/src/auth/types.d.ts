export interface AuthResult {
  expiresIn: any;
  accessToken: string;
  idToken: string;
  idTokenPayload: IdTokenPayload;
  scope: string;
}

export type IdTokenPayload = Dictionary<any>;

export interface UserMetadata {
  given_name: string;
  family_name: string;
  tenantId: string;
}
