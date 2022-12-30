import { FastifyReply, FastifyRequest } from "fastify";
import DBInterface from "../ts/interfaces/db.interface.js";
import DBFactory from "../persitence/dbFactory.js";
import Utils from "../utils/utils.js";

/**
 * Class that contains the hooks of the lifecycle of a request on the endpoint mark done.
 */
class MarkDoneMiddleware {
    async onRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        if(!Utils.isAuthorized(request)) {
            reply.statusCode = 401;
            reply.send({'ERROR': 'Unauthorized'});
        }
    }
    async handler(request: FastifyRequest<{Body: {id: string}}>, reply: FastifyReply): Promise<void> {
        const db: DBInterface = DBFactory.getInstance().db;
        const task = db.getTask(request.body.id);
        if (task === null) {
            reply.statusCode = 404;
            reply.send({
                'Status': `Task with ID ${request.body.id} not found`
            })
        } else {
            task.isDone = true;
            db.updateTask(task);
            reply.statusCode = 200;
            reply.send({
                'Status': `Task with ID ${request.body.id} marked as done`,
            });
        }
        
    }
}

export default MarkDoneMiddleware;