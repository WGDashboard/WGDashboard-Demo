import {getQuery} from "#imports";
import { v4 } from 'uuid'
import { exec } from "child_process";

export default defineEventHandler(async (event) => {
    const query = getQuery(event)
    console.log('hi')
    if (!query.session){
        const sessionId = v4().toString()
        const d = await new Promise((resolve, reject) => {
            exec("ping 1.1.1.1 -c 3", (error, stdout, stderr) => {
                if (error) {
                    reject({ error: stderr });
                } else {
                    resolve({ output: stdout });
                }
            })
        })
        console.log(d)
    }
})