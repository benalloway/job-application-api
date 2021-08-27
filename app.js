import fastify from 'fastify'
import cors from "fastify-cors";

const server = fastify({
  logger: true
})


import {getApplications, addApplication} from './controller/applicationsController.js'

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


server.register(cors, {
    origin: [
      "https://job-application-app.onrender.com",
      "http://localhost:3000",
      "http://localhost:4200",
      "https://snag-angular.netlify.app"
    ],
  });

  // Declare '/'
  server.get('/', function (request, reply) {
    reply.send({ hello: 'world' })
  })

  // Get Accepted Applications
  server.get('/api/applications', async function (request, reply) {
      const {data: accepted_applications, error} = await getApplications()

      if(error) {
        return reply.status(500).send(error);
      }

      return reply.status(200).send(accepted_applications)
  })
  
  // Get Rejected Applications
  server.get('/api/rejected-applications', async function (request, reply) {
      const {data: rejected_applications, error} = await getApplications(false)
      if(error) {
        return reply.status(500).send(error);
      }

      return reply.status(200).send(rejected_applications)
  })

  // Submit a new Application
  server.post('/api/applications',{
      body: {
        type: 'array',
      }
    }, async function (request, reply){
        const {data, error} = await addApplication(request, reply)
        if(error) {
          return reply.status(500).send(error);
        }

        return reply.status(200).send(data)
    }
  )
  
  // Run the server
  server.listen(process.env.PORT, '0.0.0.0', function (err, address) {
    if (err) {
      server.log.error(err)
      process.exit(1)
    }
    server.log.info(`server listening on ${address}`)
  })