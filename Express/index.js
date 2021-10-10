const express= require("express")
const app =express()
app.use(express.json())
const Joi =require('joi')
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
    const schema={
        name:Joi.string().min(3).required()
    }
    const result=Joi.ValidationError(req.body,schema)
    console.log(result)
    if(!req.body.name || req.body.name.length<3)
    {
        res.status(400).send("Name is require and should be minimum 3 caracter")
        return
    }
    const course={
        id:courses.length+1,
        name:req.body.name
    }
    courses.push(course)
    res.send(course)
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