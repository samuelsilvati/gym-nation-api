import fastify from 'fastify'

const app = fastify()

app
  .listen({
    port: 3333,
    host: '192.168.3.3',
  })
  .then(() => {
    console.log('HTTP server running on http://192.168.3.3:3333')
  })
