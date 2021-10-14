const debug=require('debug')('app:startup')
//for databse
const db_dbugger=require('debug')('app:db')
const config=require('config')
const Joi =require('joi')
const log=require('./logger')
const morgan =require('morgan')
const auth=require('./authntication')
const express= require("express")

const app =express()
app.use(express.json()) //build in middleware
//configration
console.log("Application name:" + config.get('name'))
console.log("mail server name:"  + config.get('mail.host'))
console.log("mail server password:"  + config.get('mail.password'))
if(app.get('env')==='development')
{
  app.use(morgan('tiny'))
  debug("margan is enalbe")

}
app.use(log) //custom middleware
app.use(auth) //custom middleware

app.use(express.urlencoded({extended:true})) //build in middleware
app.use(express.static('public'))
const courses=[
    {id:1,name:'courese1'},
    {id:2,name:'courese2'},
    {id:2,name:'courese3'}
]
app.get("/",(req,res)=>{
    res.send("Hello world")
})

app.get("/api/courses",(req,res)=>{
   // res.send([1,2,3,4,5,6])
   res.send(courses)
})

app.post("/api/courses",(req,res)=>{
    //const schema = Joi.object({ name: Joi.string() .min(3) .required() });
        
        //const result = schema.validate(req.body);
   // const result =validation(req.body)
   // if(result.error)
   const {error}=validation(req.body) //result.error
   if(error)
    {
        res.status(400).send(error.details[0].message)
        return
    }
    const course={
        id:courses.length+1,
        name:req.body.name
    }
    courses.push(course)
    res.send(course)
})

app.put('/api/courses/:id',(req,res)=>{
    //look up the course
    const cours=courses.find(c=> c.id===parseInt(req.params.id))
    // if not existing ,return 404
  
    if(!cours) res.status(404).send("The course for the given id was not found") //404 object not found
   
    //validate
    //const schema = Joi.object({ name: Joi.string() .min(3) .required()});
    //const result = schema.validate(req.body);
     // const result =validation(req.body)
   // if(result.error)
   const {error}=validation(req.body) //result.error {error} called object destrutring
   //status 400 bad requst
   if(error)
    {
        res.status(400).send(error.details[0].message)
        return
    }
    // update course
    cours.name=req.body.name;
    //return the updated courses
    res.send(cours)
})


app.delete('/api/courses/:id',(req,res)=>{
    //look up the course
    const cours=courses.find(c=> c.id===parseInt(req.params.id))
    // if not existing ,return 404
  
    if(!cours) res.status(404).send("The course for the given id was not found") //404 object not found
     
    //Delete
     const index =courses.indexOf(cours)
     courses.splice(index,1) //remove the index
    //Return
    res.send(cours)

})


app.get("/api/courses/:id",(req,res)=>{
   // res.send(req.params.id)
  //res.send(req.params)
  //res.send(req.query)
  const cours=courses.find(c=> c.id===parseInt(req.params.id))
  if(!cours) res.status(404).send("The course for the given id was not found") //404 object not found
   res.send(cours)
})

const port =process.env.PORT || 3002
app.listen(port,()=>console.log(`listing to port  ${port}`))


function validation(course){
    const schema = Joi.object({ name: Joi.string() .min(3) .required()
    });
    
   return schema.validate(course);
}