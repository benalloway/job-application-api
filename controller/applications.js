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


// Handlers
const getAcceptedApplications = async (req, reply) => {
    return accpetedApplications
}

const getRejectedApplications = async (req, reply) => {
    return rejectedApplications
}

const addApplication = async (req, reply) => {
    let id;
    let newApplication = req.body
    
    console.log(newApplication)

    // acceptedApplications.push(newApplication)
    return newApplication
}

module.exports = {
    getAcceptedApplications,
    getRejectedApplications,
    addApplication,
}