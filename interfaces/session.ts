import {SessionData} from "./sessionData";

export interface Session {
    status: Boolean,
    sessionData: SessionData | null
}