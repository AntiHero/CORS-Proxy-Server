const fastify = require("fastify")({ logger: true });
const fetch = require("node-fetch");

const start = async () => {
  const limit =
    typeof process.argv[2] !== "undefined" ? process.argv[2] : "100kb";
  await fastify.register(require("fastify-express"));
  fastify.use(require("body-parser").json({ limit }));

  fastify.get("/", async function (_, res) {
    res.send("CORS server is running");
  });

  fastify.all("*", async function (req, res, next) {
    console.log(res);
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods", "GET, PUT, PATCH, POST, DELETE");
    console.log(req.headers, "headers");
    res.header("Access-Control-Allow-Headers", "*");
  });

  try {
    await fastify.listen(3000);
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
};
start();
