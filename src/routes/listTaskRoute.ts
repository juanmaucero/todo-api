import {FastifyInstance, FastifyReply, FastifyRequest} from 'fastify';
import ListTaskMiddleware from '../middleware/listTaskMiddleware.js';
import endpoints from '../config/endpoints.js';

const listTaskRoute = async (server: FastifyInstance, opts: object, done: () => void) => {
  server.route({
    method: 'POST',
    url: endpoints.LIST,
    async onRequest(request: FastifyRequest, reply: FastifyReply) {
      const middleware = new ListTaskMiddleware();
      await middleware.onRequest(request, reply);
    },
    handler: async(request: FastifyRequest, reply: FastifyReply) => {
      const middleware = new ListTaskMiddleware();
      await middleware.handler(request, reply);
    }
  });
  done();
};

export default listTaskRoute;