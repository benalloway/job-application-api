import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

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
export const isAcceptedApplication = (questions) => {
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
export const getAcceptedApplications = async (req, reply) => {
    const { data: accepted_applications, error } = await supabase
        .from('applications')
        .select('*')
        .eq('Accepted', true)
    
    if(error) {
        return reply.status(500).send(error);
    }

    return accepted_applications;
}

export const getRejectedApplications = async (req, reply) => {
    const { data: rejected_applications, error } = await supabase
        .from('applications')
        .select('*')
        .eq('Accepted', true)
    
    if(error) {
        return reply.status(500).send(error);
    }

    return rejected_applications;
}

export const addApplication = async (request, reply) => {
    const {Name, Questions} = request.body
    if (isAcceptedApplication(Questions)) {

    const { data, error } = await supabase
        .from('applications')
        .insert([
        { Accepted: true, Name, Questions },
        ])

        return {msg: "your application was accepted" ,data, error}
    } else {
        const { data, error } = await supabase
        .from('applications')
        .insert([
            { Accepted: false, Name, Questions },
        ])

        return {msg: "your application was rejected", data, error}
    }
}

// module.exports = {
//     getAcceptedApplications,
//     getRejectedApplications,
//     addApplication,
// }