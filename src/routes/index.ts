import {FastifyPluginAsync} from 'fastify';

const routes: FastifyPluginAsync = async (server) => {
  server.post('/', {}, async function () {
    return { hello: 'world' };
  });
}

export default routes;
