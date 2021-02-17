import { Token } from "./token";
import { User } from "./user";

export interface UserSession extends Token,User{}
