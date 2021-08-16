// Require the framework and instantiate it
const fastify = require('fastify')({
    logger: true
  })

// Implement a solution that:
// 1. Contains a list of Questions with an acceptable answer for each question:
// var acceptibleAnswers = [ 
//     { Id: "id1", Question: "string", "Answer": "string" }, 
//     { Id: "id2", Question: "string", "Answer": "string" }, 
//     { Id: "id3", Question: "string", "Answer": "string" } 
//   ]
// 2. Receives job applications where each application is a JSON document conforming to this design:
// { Name: "string",  Questions: [ {  Id: "id10", Answer: "string" }, {  Id: "id20", Answer: "string" }, … ] }
// 3. The program should decide to accept or reject each application.
// 4. Accepted applications must answer all questions correctly.
// 5. Accepted applications must be shown to the employer.
// 6. Unaccepted applications must not be shown to the employer.


  // Declare a route
  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  })
  
  // Run the server!
  fastify.listen(3000, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })