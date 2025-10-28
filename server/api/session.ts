import {getQuery} from "#imports";
import { v4 } from 'uuid'
import { exec } from "child_process";
import pool from "~~/utils/pool";
import type {Session} from "~~/interfaces/session";
import {execPromise} from "~~/server/utils/execPromise";



export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    const sessionId = query.sessionId

    if (sessionId){
        const check = await checkAliveSession(sessionId.toString())
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

export const checkAliveSession = async (sessionId: string): Promise<Session> => {
    const checkSession = await pool.query(
        'SELECT p.sessionid, port FROM sessions LEFT JOIN public.pool p on sessions.sessionid = p.sessionid WHERE sessions.sessionId = $1 AND expire_at IS NULL', [sessionId])

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



const createSession = async (sessionId: string): Promise<Session> => {
    const currentDate = new Date()
    const availablePort = await nextAvailableSession()
    await pool.query(
        `UPDATE pool SET sessionId = $1 WHERE port = $2`, [sessionId, availablePort]
    )
    await pool.query(
        `INSERT INTO sessions VALUES ($1, $2, null)`, [sessionId, currentDate]
    )
    const nginxTemplate =
        `
        server {
            server_name ${sessionId}.demo.wgdashboard.dev;
            listen 443 ssl;
            ssl_certificate /etc/letsencrypt/live/demo.wgdashboard.dev-0001/fullchain.pem;
            ssl_certificate_key /etc/letsencrypt/live/demo.wgdashboard.dev-0001/privkey.pem;
        
            location / {
                proxy_pass http://0.0.0.0:${availablePort};
                proxy_set_header Host \\\$host;
                proxy_set_header X-Real-IP \\\$remote_addr;
                proxy_set_header X-Forwarded-For \\\$proxy_add_x_forwarded_for;
                proxy_set_header X-Forwarded-Proto \\\$scheme;
            }
        }
        server {
            server_name ${sessionId}.demo.wgdashboard.dev;
            listen 80;
        
             if (\\\$host = ${sessionId}.demo.wgdashboard.dev) {
                return 301 https://\\\$host\\\$request_uri;
            }
        }
        `


    try{
        await execPromise(`echo "${nginxTemplate}" > /etc/nginx/sites-enabled/${sessionId}`)
        await execPromise(`nginx -t`)
        execPromise(`systemctl restart nginx`)
        const { stdout, stderr } = await execPromise(`docker run -d --name ${sessionId} --cap-add NET_ADMIN -p ${availablePort}:10086/tcp docker.io/donaldzou/wgdashboard-1:latest`);
        console.log(stdout)
        return {
            status: true,
            sessionData: {
                sessionId: sessionId,
                port: availablePort
            }
        }
    }catch (e) {
        console.log('Failed', e)
        return {
            status: false,
            sessionData: null
        }
    }


}