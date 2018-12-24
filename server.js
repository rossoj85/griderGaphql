const express = require('express')
const expressGraphQL = require('express-graphql')
const schema = require('./schema/schema');
const volleyball = require('volleyball')

const app = express()
app.use(volleyball)
app.use('/graphql', expressGraphQL({
    schema,
    graphiql: true 
}))
app.listen(4000, ()=>{
    console.log('Listening')
});