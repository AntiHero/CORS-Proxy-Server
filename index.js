const fastify = require('fastify')({ logger: true });
const fetch = require('node-fetch');

const start = async () => {
  const limit =
    typeof process.argv[2] !== 'undefined' ? process.argv[2] : '200kb';
    
  await fastify.register(require('fastify-express'));
  fastify.use(require('body-parser').json({ limit }));

  const opts = {
    schema: {
      response: {
        200: {
          type: 'object',
        },
      },
    },
    handler: async function (request, reply) {
      reply.header('Access-Control-Allow-Origin', '*');
      reply.header(
        'Access-Control-Allow-Methods',
        'GET, PUT, PATCH, POST, DELETE'
      );
      reply.header('Access-Control-Allow-Headers', '*');

      if (request.method === 'OPTIONS') {
        reply.send('CORS preflight');
      } else {
        const targetURL = request.headers['target-url'];
        if (!targetURL) {
          reply.send('There is not Target-Endpoint header in the request');
          return;
        }

        const url = targetURL + request.url;

        fetch(url, {
          method: request.method,
        })
          .then((response) => response.text())
          .then((data) => reply.send(data).code(204))
          .catch((err) => console.log(err.message));
      }
    },
  };

  fastify.all('*', opts);

  fastify.get('/', opts);

  const PORT = 3000;

  try {
    await fastify.listen(PORT);
    /* console.log(`server listening at 'http://127.0.0.1:${PORT}`); */
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};

start();
