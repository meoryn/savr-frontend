import type { Session } from "./session";
import type { User } from "./user";

export interface AuthenticatedUser {
    user: User,
    session: Session
}