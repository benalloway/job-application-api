const fastify = require('fastify')({
    logger: true
  })

const {getAcceptedApplications, addApplication} = require('./controller/applications')

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


  // Declare '/'
  fastify.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  })

  // Applications routes

  // Get Accepted Applications
  fastify.get('/applications', function (request, reply) {
      const appliations = getAcceptedApplications()
      console.log(appliations)
      reply.send(JSON.stringify(appliations))
  })

  // Submit new Application
  fastify.post('/applications',{
      body: {
        type: 'array',
      }
    }, async function (request, reply){
        // { Name: "John Doe",  Questions: [ {  Id: "1", Answer: "yes" }, {  Id: "2", Answer: "yes" }, {  Id: "3", Answer: "no" }, {  Id: "4", Answer: "yes" }] },
        // const {Name, Questions} = JSON.parse(request.body)
        
        const result = await addApplication(request, reply)
        reply.send(result)
    }
  )
  
  // Run the server!
  fastify.listen(3000, function (err, address) {
    if (err) {
      fastify.log.error(err)
      process.exit(1)
    }
    fastify.log.info(`server listening on ${address}`)
  })