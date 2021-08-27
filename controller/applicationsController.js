import { createClient } from '@supabase/supabase-js'
// import supabase from '../supabase'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// DB design:
// (table_1) job_listing: id, acceptible answers
// (table_2) applications: id, qualified, name, email, questions, job_listing__id

//
// Decided to store both application states, this way we can analyze all submissions to determine (for example) 
// do we need to update job listing description to not mislead those who do not qualifiy?
export const getApplications = async (isQualified = true) => {
    const { data, error } = await supabase
        .from('applications')
        .select('id, name, qualified, questions, email, job_listing_id ( title )')
        .eq('qualified', isQualified)

    return {data, error};
}

//
// post job application to db table with qualified field driving whether it's viewable by employer or not.
export const addApplication = async (request, reply) => {
    const {job_listing_id: jobListingId, name, email, questions} = request.body
    let isQualified
    
    // storing job_listing_id here to conform to requirements of the code review - not requiring you to submit job_listing_id
    const job_listing_id = jobListingId ?? "e84f7e28-c8c7-4588-8f81-e2a51e776564"

    // grab acceptible answers for this job-listing from the DB
    try {
        const {data, error} = await supabase
                .from('job_listings')
                .select('acceptible_answers')
                .eq('id', job_listing_id)
                .single()
        
        console.log("returned data from job_listing.acceptible_answers", data)
        
        if(error) return {data: null, error}
    
        // check if the application meets min. qualifications based on Acceptible Answers.
        isQualified = isQualifiedApplication(questions, data.acceptible_answers)

    } catch(error) {
        return {data: null, error}
    }

    // Save application to DB with proper qualified status
    try {
        const { data, error } = await supabase
            .from('applications')
            .insert([
            { qualified: isQualified, job_listing_id, name, email, questions },
        ])
    
        return {data, error}

    } catch(error) {
        return {data: null, error}
    }

}

// 
// Takes just the questions that matter for qualification purposes, and determines if the submitted application meets min. qualifications.
// step 1. filter out non-qualifying questions
// step 2. filter out qualifying questions that are answered correctly
// step 3. if there are no failed questions - returns true.
function isQualifiedApplication(questions, acceptibleAnswers) {
    console.log("questions", questions)
    console.log("acceptible anwers", acceptibleAnswers)

    if(Array.isArray(questions) && questions.length > 0) {
        
        // first check is to make sure we have the right amount of acceptible questions - if not return false
        const acceptibleQuestions = questions.filter(question => acceptibleAnswers.find(answer => answer.Id === question.Id))

        // quickly check to make sure we have the min. amount of acceptible answers for this job listing.
        // TODO: maybe enhance this to make sure acceptible answers coming through is 1:1 with acceptible answers in db? (like each individual one)
        if(acceptibleAnswers?.length !== acceptibleQuestions?.length) return false

        // keep track of any qualifying questions that fail
        const failedQuestions = questions.filter(question => {
            // check if this question is a qualifying question
            const qualifyingQuestion = acceptibleAnswers.find(answer => answer.Id === question.Id)
            
            // filter out if it is not a qualifying question
            if (!qualifyingQuestion) {
              return false
            }
          
            // filter out correctly answered qualifying questions - leaving just failed questions.
            return qualifyingQuestion.Answer !== question.Answer
        })
        
        // if there are no failed questions: Bob's your uncle!
        return failedQuestions.length === 0
    } else {
        throw("Something went wrong in qualifyApplication")
    }
}