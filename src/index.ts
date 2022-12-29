import fastify from 'fastify';
import routes from './routes/index.js';

async function main() {
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  const server = fastify({});

  await server.register(routes);
  await server.ready();
  
  const port = 5000;
  const host = 'localhost';
  await server.listen({ host, port });
  
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
    server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }
}

main();
