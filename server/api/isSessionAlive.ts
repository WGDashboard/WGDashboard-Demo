import {checkAliveSession} from "~~/server/api/session";
import {execPromise} from "~~/server/utils/execPromise";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const sessionId = query.sessionId

    if (sessionId){
        const check = await checkAliveSession(sessionId.toString())
        if (check.status){
            let running = true;
            await execPromise(`curl http://localhost:${check.sessionData?.port}`).catch((e) => {
                running = false;
            })
            return {
                status: running
            }
        }
    }

    return {
        status: false
    }
})