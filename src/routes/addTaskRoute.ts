import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import endpoints from '../config/endpoints.js';
import AddTaskMiddleware from '../middleware/addTaskMiddleware.js';
import { SCHEMAS, SCHEMA_NAMES } from '../config/schemas.js';

const addTaskRoute = async (server: FastifyInstance, opts: object, done: () => void) => {
  server.addSchema(SCHEMAS.ADD_TASK_SCH);
  server.route({
    method: 'POST',
    url: endpoints.ADD,
    schema: {
      body: {
        $ref: SCHEMA_NAMES.ADD_TASK
      }
    },
    async onRequest(request: FastifyRequest, reply: FastifyReply) {
      const middleware = new AddTaskMiddleware();
      await middleware.onRequest(request, reply);
    },
    handler: async(request: FastifyRequest, reply: FastifyReply) => {
      const middleware = new AddTaskMiddleware();
      await middleware.handler(request as FastifyRequest<{Body: {name: string}}>, reply);
    }
  });
  done();
};

export default addTaskRoute;
