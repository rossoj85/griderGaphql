 const graphql = require('graphql');
 const axios = require('axios');
 const _ = require('lodash');


 const {
     GraphQLObjectType,
     GraphQLString,
     GraphQLInt,
     GraphQLSchema,
     GraphQLList, 
     GraphQLNonNull
 } = graphql;

 //iunstructs graphQL about what a user object type loks like
 const CompanyType = new GraphQLObjectType({
    name: "Company",
    fields:()=> ({
        id: {type: GraphQLString},
        name: {type: GraphQLString},
        description: {type: GraphQLString},
        users: {
            type: new GraphQLList(UserType),
            resolve(parentValue, args){
               
                return axios.get(`http://localhost:3000/companies/${parentValue.id}/users`)
                .then(res=>res.data)
            }

        }
    })
})
 const UserType = new GraphQLObjectType({
     name: 'User',
     fields:{
         id: {type: GraphQLString},
         firstName: {type:GraphQLString} ,
         age: {type: GraphQLInt},
         company: {
             type: CompanyType,
             resolve(parentValue,args){  //we jump further into our data to fetch the next level
                console.log(parentValue,"ARGS --",  args)
                //lets do another axios on parentValue.companyID
                return axios.get(`http://localhost:3000/companies/${parentValue.companyId}`)
                .then(res=>res.data)

             }
        }
     }
 });


 const RootQuery = new GraphQLObjectType({
     name: 'RootQueryType',
     fields: {
         user:{  //you can ask me, the root query, about users in the application, if you give me the id( args) i will return a user back to you 
             type: UserType,
             args: {id: { type: GraphQLString} },
             resolve(parentValue, args){  //the resolve function is where we actually go into the DB and find the actual data were looking for
                return axios.get(`http://localhost:3000/users/${args.id}`)
                .then(res=>res.data)
                .then(res=>console.log('HELLO'))
                .catch(console.error)
             }
         },
         company:{
             type: CompanyType,
             args: {id: {type: GraphQLString} },
             resolve(parentValue, args){
                 
                 return axios.get(`http://localhost:3000/companies/${args.id}`)
                 .then(res=>res.data)
             }
         }
     }
    
 });

 const mutation = new GraphQLObjectType({
      name: 'Mutation',
      fields: {
        addUser: {
            type: UserType, //refers to the type of data were eventually going to return fromthe resolve function 
            args: {
                firstName: {type: new GraphQLNonNull(GraphQLString)},
                age: {type: new GraphQLNonNull (GraphQLInt) }, 
                companyId: {type: GraphQLString}
            
            },
            resolve(parentValue, {firstName, age, companyId}){
                console.log('HEllo')
                return axios.post(`http://localhost:3000/users`,{firstName,age,companyId})
                .then(res=>res.data)
            }
        },
        deleteUser: {
            type:UserType,
            args: {
                id: {type: new GraphQLNonNull(GraphQLString)}
            },
            resolve(parentValue,args){
                console.log('Hello args', args)
                return axios.delete(`http://localhost:3000/users/${args.id}`)
                .then(res=>res.data)
            }
        },
        editUser:{
            type: UserType,
            args: {
                id: { type: new GraphQLNonNull(GraphQLString)},
                firstName: { type: GraphQLString},
                age: { type: GraphQLInt},
                companyId: { type: GraphQLString }
            },
            resolve(parentValue, args){
                return axios.patch(`http://localhost:3000/users/${args.id}`,args)
                .then(res=>res.data)
            }
        }
      }
 })
 module.exports = new GraphQLSchema({
     query: RootQuery,
     mutation
 }) 
