const express = require("express")
const graphqlHTTP = require("express-graphql").graphqlHTTP;
const schema = require("./schema")
const mongoose = require("mongoose");

mongoose.connect("mongodb+srv://partht:*****@cluster0.75jdx.mongodb.net/graphql-db?retryWrites=true&w=majority"); 
mongoose.connection.once("open",()=>{
	console.log("connected to db");
})

const app = express();

app.use("/myed",graphqlHTTP(
{
	schema,
	graphiql:true
	}));

	
app.listen(4000,()=>{
console.log("now listening port 4000");
})
