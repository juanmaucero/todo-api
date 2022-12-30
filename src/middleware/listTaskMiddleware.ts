import { FastifyReply, FastifyRequest } from "fastify";
import DBInterface from "../ts/interfaces/db.interface.js";
import DBFactory from "../persitence/dbFactory.js";
import Utils from "../utils/utils.js";

/**
 * Class that contains the hooks of the lifecycle of a request on the endpoint list task.
 */
class ListTaskMiddleware {
    async onRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        if(!Utils.isAuthorized(request)) {
            reply.statusCode = 401;
            reply.send({'ERROR': 'Unauthorized'});
        }
    }
    async handler(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        const db: DBInterface = DBFactory.getInstance().db;
        const tasks = db.listTasks();
        const taskStatuses = [];
        for (const task of tasks) {
            taskStatuses.push(`Task ID: ${task.id}. Task '${task.name}'. Status: ${task.isDone? 'Done' : 'ToDo'}`)
        }
        reply.statusCode = 200;
        reply.send({
            'Status': 'Task list',
            'Tasks': taskStatuses
        })
    }
}

export default ListTaskMiddleware;