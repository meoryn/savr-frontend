import { serverSupabaseClient } from '#supabase/server'

export default eventHandler(async (event) => {
//   const client = await serverSupabaseClient(event)

//   await client.auth.signInWithPassword

console.log(event);

  return {
    statusCode: 200,}
})