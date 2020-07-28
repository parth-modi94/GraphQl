const graphql = require("graphql");
const {GraphQLList,GraphQLNonNull,GraphQLInt,GraphQLObjectType,GraphQLString,GraphQLSchema,GraphQLID} = graphql;
const _ = require("underscore");
const Book = require("./model/bookModel");
const Author = require("./model/authorModel");

var books = [
{name:'The monk who sold his ferrari',genre:'fiction',id:"1",authorId:"1"},
{name:'The monk who sold his ferrari 1',genre:'fiction',id:"2",authorId:"2"},
{name:'The monk who sold his ferrari 2',genre:'fiction',id:"3",authorId:"3"},
{name:'good book',genre:'fiction',id:"4",authorId:"2"},
{name:'great book',genre:'fiction',id:"5",authorId:"3"}
]

var authors = [
{name:"parth modi",age:26,id:"1"},
{name:"jay shah",age:38,id:"2"},
{name:"dhawal shah",age:37,id:"3"}
]
const BookType= new GraphQLObjectType({
	name:'Book',
	fields:()=>({
		id:{type: GraphQLID},
		name:{type: GraphQLString},
		genre:{type: GraphQLString},
		author:{
			type:AuthorType,
			resolve(parent,args){
				console.log(parent);
				return Author.findById(parent.authorId)
				//return _.find(authors,{id:parent.authorId})
			}
		}
	})
});
const AuthorType= new GraphQLObjectType({
	name:'Author',
	fields:()=>({
		id:{type: GraphQLID},
		name:{type: GraphQLString},
		age:{type: GraphQLInt},
		books:{
			type: new GraphQLList(BookType),
			resolve(parent,args)
			{
				return Book.find({authorId:parent.id})
				//return _.filter(books,{authorId:parent.id});
			}
		}
	})
});
const RootQuery = new GraphQLObjectType({
	name:'RootQueryType',
	fields:{
		book:{
			type: BookType,
			args:{id :{ type : GraphQLID }},
			resolve(parent,args){
			//code to get data from db/other sources
			console.log(typeof(args.id));
				//return _.find(books,{id:args.id});
				return Book.findById(args.id);
			}
		},
		author:{
			type: AuthorType,
			args:{id:{type : GraphQLID}},
			resolve(parent,args){
				//return _.find(authors,{id:args.id});
				return Author.findById(args.id);
			}
		},
		
		books:{
			type: new GraphQLList(BookType),
			resolve(parent,args)
			{
				//return _.filter(books);
				return Book.find();
			}
		}
		,
		authors:{
			type: new GraphQLList(AuthorType),
			resolve(parent,args)
			{
				return Author.find();
				//return _.filter(authors);
			}
		}
	}
});
const Mutation = new GraphQLObjectType ({
	name:"Mutation",
	fields:{
		addAuthor:{
			type: AuthorType,
			args:{
				name: {type:new GraphQLNonNull(GraphQLString)},
				age: {type: new GraphQLNonNull(GraphQLInt)}
			},
			resolve(parent,args){
				let author = new Author({
					name:args.name,
					age:args.age
				});
				return author.save();
			}
		},
		addBook:{
			type: BookType,
			args:{
				name:{type:new GraphQLNonNull(GraphQLString)},
				genre:{type:new GraphQLNonNull(GraphQLString)},
				authorId:{type:new GraphQLNonNull(GraphQLID)}
			},
			resolve(parent,args){
				let book = new Book({
					name:args.name,
					genre:args.genre,
					authorId:args.authorId
				});
				return book.save();
			}
		}
	}
});

module.exports = new GraphQLSchema({ query:RootQuery,mutation:Mutation});