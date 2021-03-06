/**
 * A payload of a JWT token
 */
export interface JwtPayload {
  iss: string
  sub: string
  aud: string
  iat: number
  exp: number
  at_hash: string
  nonce: string
}
