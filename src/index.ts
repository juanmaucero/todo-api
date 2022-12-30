import * as dotenv from 'dotenv'
import fastify from 'fastify';
import addTaskRoute from './routes/addTaskRoute.js';
import markDoneRoute from './routes/markDoneRoute.js'
import listTaskRoute from './routes/listTaskRoute.js';
import DBFactory from './persitence/dbFactory.js';

async function main() {
  // Error displaying via console
  process.on('unhandledRejection', (err) => {
    console.error(err);
    process.exit(1);
  });

  // Init DB
  DBFactory.getInstance();

  // Init fastify
  const server = fastify({
    logger: {
      level: 'info'
    }
  });

  // Register routes
  await server.register(addTaskRoute);
  await server.register(markDoneRoute);
  await server.register(listTaskRoute);
  await server.ready();

  // Start server on the given host & port
  console.log(`Starting server on ${process.env.SERVER_HOST}:${process.env.SERVER_PORT}`)
  const port = Number(process.env.SERVER_PORT);
  const host = process.env.SERVER_HOST;
  await server.listen({ host, port });
  console.log('Server listening...')
  
  // Check for server termination
  for (const signal of ['SIGINT', 'SIGTERM']) {
    process.on(signal, () =>
    server.close().then((err) => {
        console.log(`close application on ${signal}`);
        process.exit(err ? 1 : 0);
      }),
    );
  }
}

// Load environment variables
const result = dotenv.config()
if (result.error) {
  throw result.error;
}
main();
