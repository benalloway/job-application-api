import { createClient } from '@supabase/supabase-js'
// import supabase from '../supabase'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

//
// Storing the acceptible answers in memory
// TODO: move to db table for reference
// STRETCH: Once in db, allow for the table to be used accross different job listings by storing listing ID so:
// table_1 : job_listing: id, acceptible answers
// table_2 : applications: id, qualified, name, email, questions, job_listing__id
const acceptibleAnswers = [ 
        { Id: "1", Question: "do you own a car?", Answer: true }, 
        { Id: "2", Question: "do you have a valid license?", Answer: true }, 
        { Id: "3", Question: "have you ever had a DUI?", Answer: false },
        { Id: "4", Question: "are you willing to drive more than 1000 miles a month?", Answer: true },
    ]

//
// Decided to store both application states, cause data!, I think it is valuable to store all the data at this point.
export const getApplications = async (isQualified = true) => {
    const { data, error } = await supabase
        .from('applications')
        .select('*')
        .eq('qualified', isQualified)

    return {data, error};
}

//
// post job application to supabase table with qualified field driving whether it's viewable by employer or not.
export const addApplication = async (request, reply) => {
    const {name, email, questions} = request.body
    console.log("request body:", request.body)
    
    try {
        const { data, error } = await supabase
            .from('applications')
            .insert([
            { qualified: qualifyApplication(questions), name, email, questions },
        ])
    
        return {data, error}

    } catch(error) {
        return {data: null, error}
    }

}

// 
// Takes just the questions that matter for qualification purposes, and determines if the submitted application meets min. qualifications.
function qualifyApplication (questions) {
    
    if(Array.isArray(questions) && questions.length > 0) {
        return !questions.filter(x => {
            // filter out non-qualifying questions
            return acceptibleAnswers.find(aa => aa.Id === x.Id)
        }).map((q) => { 
            // see if the answer they gave matches acceptible answers
            return acceptibleAnswers.find(x => x.Id == q.Id).Answer === q.Answer
        }).includes(false);
    } else {
        throw("Something went wrong in qualifyApplication")
    }
}