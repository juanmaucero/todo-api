import { FastifyReply, FastifyRequest } from "fastify";
import DBInterface from "../ts/interfaces/db.interface.js";
import DBFactory from "../persitence/dbFactory.js";
import Task from "../ts/models/task.model.js";
import Utils from "../utils/utils.js";

/**
 * Class that contains the hooks of the lifecycle of a request on the endpoint add task.
 */
class AddTaskMiddleware {
    async onRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        if(!Utils.isAuthorized(request)) {
            reply.statusCode = 401;
            reply.send({'ERROR': 'Unauthorized'});
        }
    }
    async handler(request: FastifyRequest<{Body: {name: string}}>, reply: FastifyReply): Promise<void> {
        const task = new Task(request.body.name);
        const db: DBInterface = DBFactory.getInstance().db;
        const id = db.createTask(task);
        reply.statusCode = 201;
        reply.send({
            'Status': 'Task created',
            'ID': id
        })
    }
}

export default AddTaskMiddleware;