import { createClient } from '@supabase/supabase-js'
// import supabase from '../supabase'

const supabaseUrl = process.env.SUPABASE_URL
const supabaseKey = process.env.SUPABASE_PUBLIC_KEY
const supabase = createClient(supabaseUrl, supabaseKey)

// DB design:
// (table_1) job_listing: id, acceptible answers, title
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
    const {data, error} = await supabase
            .from('job_listings')
            .select('acceptible_answers')
            .eq('id', job_listing_id)
            .single()
    
    if(error) return {data: null, error}

    // check if the application meets min. qualifications based on Acceptible Answers.
    isQualified = validate(questions, data.acceptible_answers)

    // Save application to DB with proper qualified status
    const { data, error } = await supabase
        .from('applications')
        .insert([
        { qualified: isQualified, job_listing_id, name, email, questions },
    ])

    return {data, error}

}

// validates incoming application: if it is not a valid application it will be rejected.
function validate(questions, answers) {

    // Make sure things are in order
    if(!Array.isArray(questions) || !questions.length > 0) {
        console.log("There is an issue with the Incoming questions ")
    }
    if(!Array.isArray(answers) || !answers.length > 0) {
        console.log("There is something wrong with the acceptible answers")
    }

    let valid = true

    // checks each question against the acceptible answer, if ANY of them are false stop loop and return false.
    for(let x=0; x < questions.length; x++) {
      let matched = answers.find(ans => ans.Id === questions[x].Id)
      if(!matched) continue

      if(matched.Answer !== questions[x].Answer) {
        valid = false
        break
      }
    }
    return valid
  }