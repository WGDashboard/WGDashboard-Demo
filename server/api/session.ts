import {getQuery} from "#imports";
import { v4 } from 'uuid'
import { exec } from "child_process";
import pool from "~~/utils/pool";
import type {Session} from "~~/interfaces/session";



export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const sessionId = query.sessionId

    if (sessionId){
        const check = await checkSession(sessionId.toString())
        if (check.status){
            return check
        }
    }

    if (await nextAvailableSession() === -1){
        return {
            status: false
        }
    }


    const newSessionId = v4().toString().replace('-', '')
    return await createSession(newSessionId)
})

const nextAvailableSession = async (): Promise<number> => {
    const availablePort = await pool.query(
        `SELECT * FROM pool WHERE sessionId IS NULL LIMIT 1`
    )
    return availablePort.rows.length === 1 ? availablePort.rows[0].port : -1
}

const checkSession = async (sessionId: string): Promise<Session> => {
    const checkSession = await pool.query(
        'SELECT * FROM sessions WHERE sessionId = $1 AND expire_at IS NULL', [sessionId])

    if (checkSession.rows.length > 0){
        return {
            status: true,
            sessionData: {
                sessionId: sessionId,
                port: checkSession.rows[0].port
            }
        }
    }

    return {
        status: false,
        sessionData: null
    }
}

const execPromise = (command: string, options = {}) : Promise<any> => {
    return new Promise((resolve, reject) => {
        exec(command, options, (error, stdout, stderr) => {
            if (error) {
                error.stdout = stdout;
                error.stderr = stderr;
                reject(error);
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

const createSession = async (sessionId: string): Promise<Session> => {


    const currentDate = new Date()
    const availablePort = await nextAvailableSession()
    await pool.query(
        `UPDATE pool SET sessionId = $1 WHERE port = $2`, [sessionId, availablePort]
    )
    await pool.query(
        `INSERT INTO sessions VALUES ($1, $2, null)`, [sessionId, currentDate]
    )
    
    try{
        const { stdout, stderr } = await execPromise(`docker run -d --name ${sessionId} --cap-add NET_ADMIN -p ${availablePort}:10086/tcp ghcr.io/wgdashboard/wgdashboard:latest`);
        console.log(stdout)
        return {
            status: true,
            sessionData: {
                sessionId: sessionId,
                port: availablePort
            }
        }
    }catch (e) {
        console.log('Failed')
        return {
            status: false,
            sessionData: null
        }
    }


}