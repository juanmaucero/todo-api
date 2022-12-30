import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import MarkDoneMiddleware from '../middleware/markDoneMiddleware.js';
import endpoints from '../config/endpoints.js';
import { SCHEMAS, SCHEMA_NAMES } from '../config/schemas.js';

/**
 * markDoneRoute function, it configures the mark done endpoint and attaches properties like
 * schema validation, url and request lifecycle hooks. It connects the route layer with 
 * the middleware layer as well.
 * @param server
 * @param opts 
 * @param done 
 */
const markDoneRoute = async (server: FastifyInstance, opts: object, done: () => void) => {
  server.addSchema(SCHEMAS.MARK_DONE_SCH);
  server.route({
    method: 'POST',
    url: endpoints.DONE,
    schema: {
      body: {
        $ref: SCHEMA_NAMES.MARK_DONE
      }
    },
    async onRequest(request: FastifyRequest, reply: FastifyReply) {
      const middleware = new MarkDoneMiddleware();
      await middleware.onRequest(request, reply);
    },
    handler: async(request: FastifyRequest, reply: FastifyReply) => {
      const middleware = new MarkDoneMiddleware();
      await middleware.handler(request as FastifyRequest<{Body: {id: string}}>, reply);
    }
  });
  done();
};

export default markDoneRoute;
