# job-application-api
An API that receives applications and automatically filters out applications from unqualified applicants and returns just qualified applications to employers.

### How to use:

API Route:
https://snag-application-api.onrender.com/

POST/GET applications:
https://snag-application-api.onrender.com/api/applications

Headers required:
`'Content-Type': 'application/json'`

body: 
`{
      'name': 'String',
      'questions': [Array]
  }`

(optional) additional body props:
`{
    'email': 'String',
    'job_listing_id': 'String'
}`

JSON formatted questions:
`[
    { "Id": "1", "Question": "do you own a car?", "Answer": true }, 
    { "Id": "2", "Question": "do you have a valid license?", "Answer": true }, 
    { "Id": "3", "Question": "have you ever had a DUI?", "Answer": false },
    { "Id": "4", "Question": "are you willing to drive more than 1000 miles a month?", "Answer": true }
]`

or 

JSON formatted questions for submitting application - without listing the question (difference is when you hit API with GET request if you submitted without question prop you won't get question prop back):
`[
    { "Id": "1", "Answer": true }, 
    { "Id": "2", "Answer": true }, 
    { "Id": "3", "Answer": false },
    { "Id": "4", "Answer": true }
]`


The Acceptable Answers format in API / DB:
`[ 
   { Id: "1", Question: "do you own a car?", Answer: true }, 
   { Id: "2", Question: "do you have a valid license?", Answer: true }, 
   { Id: "3", Question: "have you ever had a DUI?", Answer: false },
   { Id: "4", Question: "are you willing to drive more than 1000 miles a month?", Answer: true },
]`
