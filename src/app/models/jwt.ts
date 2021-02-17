export interface JWT {
  token_type: string;
  jti: string;
  exp: number;
  user_id: number;
}
