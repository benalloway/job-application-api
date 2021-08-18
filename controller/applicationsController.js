import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// Storing the acceptible answers in memory
// TODO: move to db table for reference
// STRETCH: Once in db, allow for the table to be used accross different job listings by storing listing ID
const acceptibleAnswers = [ 
        { Id: "1", Question: "do you own a car?", Answer: true }, 
        { Id: "2", Question: "do you have a valid license?", Answer: true }, 
        { Id: "3", Question: "have you ever had a DUI?", Answer: false },
        { Id: "4", Question: "are you willing to drive more than 1000 miles a month?", Answer: true },
    ]

// Handlers

// Getting accepted applications from db using the Accepted column to drive what the employer gets back.. 
// Decided to store both application states, cause data!, I think it is valuable to store all the data at this point.
//(went with one table with status column instead of two seperate tables, I believe it'll make it easier to manage the code base / db)
export const getApplications = async (qualified = true) => {
    const { data: accepted_applications, error } = await supabase
        .from('applications')
        .select('*')
        .eq('qualified', qualified)

    return {accepted_applications, error};
}

// TODO: Need to make sure to implement defensive programming from a UX perspective
// STRETCH: account for Job listing ID in association with acceptibleAnswers - to keep the acceptible answers -> accepted application dynamic
export const addApplication = async (request, reply) => {
    const {name, questions} = request.body
    console.log("request body:", request.body)
    
    try {
        const { data, error } = await supabase
            .from('applications')
            .insert([
            { qualified: qualifyApplication(questions), name, questions },
        ])
    
        return {data, error}

    } catch(error) {
        return {data: null, error}
    }

}


// TODO: Need to test, analyze, and determine if this function can be enhanced!
// STRETCH: storing all the data, rejected and accepted, maybe enhance our rejection function to store it if they miss like just one question?
// or have more statuses instead of a bool: i.e. Stats: ['Accepted', 'Rejected', 'Investigate?', 'etc']
// would need further insight / discussion to see value in chasing this rabbit. 
function qualifyApplication (questions) {
    
    if(Array.isArray(questions) && questions.length > 0) {
        return questions.filter(x => {
            // filter out non-qualifying questions
            return acceptibleAnswers.find(aa => aa.Id === x.Id)
        }).reduce((prevQuestion, currentQuestion) => { 
            // if they don't meet a single qualifications the application is not qualified so return false  
            if(!prevQuestion) return false
            // see if the answer they gave matches acceptible answers
            return acceptibleAnswers.find(x => x.Id == currentQuestion.Id).Answer === Boolean(currentQuestion.Answer)
        });
    } else {
        console.log('questions are not coming through as an array.')
        throw("Something went wrong in qualifyApplication")
    }
}