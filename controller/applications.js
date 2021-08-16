const acceptibleAnswers = [ 
        { Id: "1", Question: "do you own a car?", Answer: "yes" }, 
        { Id: "2", Question: "do you have a valid license?", Answer: "yes" }, 
        { Id: "3", Question: "have you ever had a DUI?", Answer: "no" },
        { Id: "4", Question: "are you willing to drive more than 1000 miles a month?", Answer: "yes" },
    ]

// Demo data
let accpetedApplications = [
    { Name: "John Doe",  Questions: [ {  Id: "1", Answer: "yes" }, {  Id: "2", Answer: "yes" }, {  Id: "3", Answer: "no" }, {  Id: "4", Answer: "yes" }] },
]
let rejectedApplications = [
    { Name: "John Doe",  Questions: [ {  Id: "1", Answer: "no" }, {  Id: "2", Answer: "no" }, {  Id: "3", Answer: "yes" }, {  Id: "4", Answer: "no" }] },
]

// Utils
const isAcceptedApplication = (questions) => {
    let test
    if(Array.isArray(questions) && questions.length > 0) {
        test = questions.map(question => {
            // {  Id: "1", Answer: "yes" }
            const answerIndex = acceptibleAnswers.findIndex(x => x.Id == question.Id)
            return acceptibleAnswers[answerIndex].Answer == question.Answer ? true : false
        });
    } else {
        console.log('questions are not coming through as an array.')
    }

    return test.includes(false) ? false : true
}

// Handlers
const getAcceptedApplications = (req, reply) => {
    return accpetedApplications
}

const getRejectedApplications = (req, reply) => {
    return rejectedApplications
}

const addApplication = async (request, reply) => {
    if (isAcceptedApplication(request.body.Questions)) {
        accpetedApplications.push(request.body)
        return {msg: "your application was accepted" ,accpetedApplications}
    } else {
        rejectedApplications.push(request.body)
        return {msg: "your application was rejected", rejectedApplications}
    }
    return null
}

module.exports = {
    getAcceptedApplications,
    getRejectedApplications,
    addApplication,
}