import {getQuery} from "#imports";
import { v4 } from 'uuid'
import { exec } from "child_process";
import pool from "~~/utils/pool";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    if (!query.session){
        const sessionId = v4().toString().replace('-', '')
        await createSession(sessionId)
        return {
            sessionId: sessionId
        }
    }else{

    }
})

const createSession = async (sessionId: string): Promise<Boolean> => {
    const checkSession = await pool.query(
        'SELECT * FROM sessions WHERE sessionId = $1', [sessionId])

    if (checkSession.rows.length > 0){
        return false
    }

    const currentDate = new Date()
    await pool.query(
        `INSERT INTO sessions VALUES ($1, $2, null)`, [sessionId, currentDate]
    )
    return true
}