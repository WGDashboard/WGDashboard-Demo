import { defineCronHandler } from '#nuxt/cron'
import pool from "~~/utils/pool";
import { exec } from "child_process";
import {execPromise} from "~~/server/utils/execPromise";



export default defineCronHandler('everyThreeMinutes', async () => {
    const ongoingSessions = await pool.query(
        `SELECT sessionid, created_at FROM sessions WHERE expire_at IS NULL`
    )
    let currentDate = new Date()

    for (let i = 0; i < ongoingSessions.rows.length; i++){
        let expire = new Date(ongoingSessions.rows[i].created_at)
        let sessionId = ongoingSessions.rows[i].sessionid
        console.log(sessionId)
        expire.setMinutes(
            expire.getMinutes() + 15
        )
        console.log(expire, currentDate)
        if (expire < currentDate){
            console.log(`Removing ${sessionId}`)
            try{
                await execPromise(`docker stop ${sessionId}`)
                await execPromise(`docker remove ${sessionId}`)
            } catch (e) {

            }
            await pool.query(
                `UPDATE sessions SET expire_at = $1 WHERE sessionId = $2`, [currentDate, sessionId]
            )
            await pool.query(
                `UPDATE pool SET sessionId = NULL WHERE sessionId = $1`, [sessionId]
            )
        }
    }
})