import fastify from 'fastify';
import addTaskRoute from '../routes/addTaskRoute.js';
import markDoneRoute from '../routes/markDoneRoute.js';
import listTaskRoute from '../routes/listTaskRoute.js';
import { test, describe, expect } from 'vitest';
import {defaultEnvs, wrongDbEnvs} from './envs.mock.js';
import DBFactory from '../persitence/dbFactory.js';

defaultEnvs();
const server = fastify();
server.register(addTaskRoute);
server.register(listTaskRoute);
server.register(markDoneRoute);

describe('Wrong DB', () => {
  test('Should throw an exception', async () => {
    wrongDbEnvs();
    DBFactory.reset();
    await expect(() => DBFactory.getInstance()).toThrowError('DB MARIADB is not implemented');
    DBFactory.reset();
  });
});

describe('Server', () => {
  test('Should return server instance', async () => {
    expect(typeof server).eq('object');
  });
});

describe('[ADD] Unauthorized', () => {
  test('Should be unauthorized', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/add',
      headers: {
        'key': 'challengee'
      },
    });
    expect(response.statusCode).eq(401);
    expect(response.json()).deep.eq({ ERROR: 'Unauthorized' });
  });
});

describe('[ADD] Incorrect body key', () => {
  test('Should be incorrect body key', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/add',
      headers: {
        'key': 'challenge'
      },
      payload: {
        'test': 1
      }
    });
    expect(response.statusCode).eq(400);
    expect(response.json()).deep.eq(
      { error: 'Bad Request', 'message':  'body must have required property \'name\'', 'statusCode': 400}
    );
  })
});

  describe('[ADD] Incorrect body value', () => {
    test('Should be incorrect body value', async () => {
      defaultEnvs();
      DBFactory.getInstance();
      const response = await server.inject({
        method: 'POST',
        path: '/add',
        headers: {
          'key': 'challenge'
        },
        payload: {
          'name': ''
        }
      });
      expect(response.statusCode).eq(400);
      expect(response.json()).deep.eq(
        { error: 'Bad Request', 'message':  'body/name must NOT have fewer than 1 characters', 'statusCode': 400}
      );
    });
});

var id: string | null = null;

describe('[ADD] Correct insertion', () => {
  test('Should be correct insertion', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/add',
      headers: {
        'key': 'challenge'
      },
      payload: {
        'name': 'test'
      }
    });
    expect(response.statusCode).eq(201);
    id = response.json()['ID']
  });
});

describe('[LIST] Unauthorized', () => {
  test('Should be unauthorized', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/list',
      headers: {
        'key': 'challengee'
      },
    });
    expect(response.statusCode).eq(401);
    expect(response.json()).deep.eq({ ERROR: 'Unauthorized' });
  });
});

describe('[LIST] Get list - not done', () => {
  test('Should retrieve the recently added task', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/list',
      headers: {
        'key': 'challenge'
      },
    });
    expect(response.statusCode).eq(200);
    expect(response.json()).deep.eq({ 
      Status: 'Task list',
      Tasks: [`Task ID: ${id}. Task 'test'. Status: ToDo`] 
    });
  });
});

describe('[DONE] Unauthorized', () => {
  test('Should be unauthorized', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/done',
      headers: {
        'key': 'challengee'
      },
    });
    expect(response.statusCode).eq(401);
    expect(response.json()).deep.eq({ ERROR: 'Unauthorized' });
  });
});

describe('[DONE] Incorrect body key', () => {
  test('Should be incorrect body key', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/done',
      headers: {
        'key': 'challenge'
      },
      payload: {
        'test': 1
      }
    });
    expect(response.statusCode).eq(400);
    expect(response.json()).deep.eq(
      { error: 'Bad Request', 'message':  'body must have required property \'id\'', 'statusCode': 400}
    );
  })
});

  describe('[DONE] Incorrect body value', () => {
    test('Should be incorrect body value', async () => {
      defaultEnvs();
      DBFactory.getInstance();
      const response = await server.inject({
        method: 'POST',
        path: '/done',
        headers: {
          'key': 'challenge'
        },
        payload: {
          'id': ''
        }
      });
      expect(response.statusCode).eq(400);
      expect(response.json()).deep.eq(
        { error: 'Bad Request', 'message':  'body/id must NOT have fewer than 1 characters', 'statusCode': 400}
      );
    });
});

describe('[DONE] Mark as done', () => {
  test('Should be incorrect body value', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/done',
      headers: {
        'key': 'challenge'
      },
      payload: {
        'id': id
      }
    });
    expect(response.statusCode).eq(200);
    expect(response.json()).deep.eq(
      { Status: `Task with ID ${id} marked as done`}
    );
  });
});

describe('[LIST] Get list - done', () => {
  test('Should retrieve the recently added task', async () => {
    defaultEnvs();
    DBFactory.getInstance();
    const response = await server.inject({
      method: 'POST',
      path: '/list',
      headers: {
        'key': 'challenge'
      },
    });
    expect(response.statusCode).eq(200);
    expect(response.json()).deep.eq({ 
      Status: 'Task list',
      Tasks: [`Task ID: ${id}. Task 'test'. Status: Done`] 
    });
  });
});
