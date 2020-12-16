
const port=process.env.PORT||3000;
const cors = require('cors')


const low = require('lowdb')
const FileSync = require('lowdb/adapters/FileSync')
 
const adapter = new FileSync('./data.json')
const data_db = low(adapter)

const schedule_adapter = new FileSync('./schedule.json')
const schedule_db = low(schedule_adapter)

const users_adapter=new FileSync('./Users.json')
const users_db = low(users_adapter)
const data = require('./data.json');
const fs = require('fs');
var schedule_data=require('./schedule.json');
const express=require('express');
const bodyParser = require("body-parser");
const router = express.Router();
const app=express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(express.static('website'));



router.get('/',(req,res)=>{
    res.sendFile(__dirname+'/website/index.html');
});
var schedules=[];
var keys = Object.keys(data);

var author=[];
console.log(keys.length);
console.log(schedule_data.length);
router.get('/api/courses',(req,res)=>{
    var subject_lists=[];

for (var i = 0; i < data[keys[0]].length; i++) {
    if(subject_lists.includes(data[keys[0]][i].subject))
    continue;
    let course={
        subject:`${data[keys[0]][i].subject}`,
        className:`${data[keys[0]][i].className}`
       
    }
    //console.log("check",data[keys[0]][1].subject);
    //console.log("check",data[keys[0]].length);
    author.push(course);
    subject_lists.push(course.subject);
    
}
res.send(author);
});



  

router.get('/api/courses/:id',(req,res)=>{
    
    let c2=data_db.get('data').chain().filter({subject:req.params.id}).value();
    let courseCodes=[];
    if(c2.length===0) res.status(200).send('The course wasnt found');
    for (var i = 0; i < c2.length; i++) {
        courseCodes.push(c2[i].catalog_nbr);
    }
    res.send(courseCodes);
});

//TIME TABLE ENTRY BY SUBJECT
router.get('/api/courseSchedules/:subject',(req,res)=>{
    let c2=data_db.get('data').chain().filter({subject:req.params.subject}).value();
    if(c2.length===0)
    res.status(200).send("Please Enter proper Subject Code")
    res.send(c2);
});
//TIME TABLE ENTRY BY SUBJECT AND COURSE
router.get('/api/courseSchedules/:subject/:course',(req,res)=>{
    let c2=data_db.get('data').chain().filter({catalog_nbr:req.params.course,subject:req.params.subject}).value();
    if(c2.length===0)
    res.send("Please Enter proper Subject and course Code")
    res.send(c2);
});

//TIME TABLE ENTRY BY SUBJECT AND COURSE AND OPTIONAL COMPONENT
router.get('/api/courseSchedules/:subject/:course/:opt_course',(req,res)=>{
    let c2=data_db.get('data').chain().filter({catalog_nbr:req.params.course,subject:req.params.subject,course_info:[{ssr_component:req.params.opt_course}]}).value();
    if(c2.length===0)
    res.send("Please Enter proper Subject and course Code")
    res.send(c2);
});

//create a new schedule to save list of courses
router.post('/api/schedules',(req,res)=>{
    const schedule=req.body;
    let c2=schedule_db.get('schedule').chain().filter({schedule_name:schedule.schedule_name}).value();
    if(c2.length!==0)
    res.send("Please Enter New Schedule name")
    schedule_db.get('schedule')
  .push(schedule)
  .write()
  res.send(schedule);
  

});

//Save a list of subject code ,course code pairs under a given schedule name.
router.put('/api/schedules',(req,res)=>{
    const schedule=req.body;
    let c2=schedule_db.get('schedule').chain().filter({schedule_name:schedule.schedule_name}).value();
    if(c2.length===0)
    res.send("Please Enter valid Schedule name")
    schedule_db.get('schedule').find({schedule_name:schedule.schedule_name}).get('courses_list').push(schedule.courses_list).write();
    schedule_db.write();
    res.send(schedule);
        });
  //GET THE LIST OF SUBJECT_CODE AND COURSE_CODE PAIRS FOR A GIVEN SCHEDULE  
  router.get('/api/schedules/:schedule_name',(req,res)=>{
    let c2=schedule_db.get('schedule').find({schedule_name:req.params.schedule_name}).value();
    if(c2===null)
    res.send("please enter valid schedule name")
    res.send(c2)
  });
  //GET THE LIST OF SUBJECT_CODE AND COURSE_CODE PAIRS FOR A GIVEN USER  
  router.get('/api/user/schedules/:user_name',(req,res)=>{
    let c2=schedule_db.get('schedule').find({user_name:req.params.user_name}).value();
    if(c2===null)
    res.send("please enter valid user name")
    res.send(c2.courses_list)
  });

  //DELETE A SCHEDULE
  router.delete('/api/schedules/:schedule_name',(req,res)=>{
    let c2=schedule_db.get('schedule').find({schedule_name:req.params.schedule_name}).value();
    if(c2===null)
    res.send("Please enter valid schedule name")
    schedule_db.get('schedule').remove(c2).write()
      res.send("Deleted");
  });

  //GET LIST OF SCHEDULE NAMES AND NUMBER OF COURSES
  router.get('/api/scheduleslist',(req,res)=>{
    let c2=schedule_db.get('schedule').chain().value();
      var list=[];
    for (var i=0 ; i < c2.length ; i++){

        let subject_course={
            user:`${c2[i].user_name}`,
            schedule:`${c2[i].schedule_name}`,
            numberOfCourses:`${c2[i].courses_list.length}`
        }
        list.push(subject_course);
    }
    res.send(list);
  });

  //DELETE ALL SCHEDULES
  router.delete('/api/schedules',(req,res)=>{
    schedule_db.get('schedule').remove().write()
    res.send('deleted');
});

//GET TIMETABLE ENTRY FOR A GIVEN SCHEDULE NAME
router.get('/api/schedulesTimeTable/:schedule_name',(req,res)=>{
    let c2=schedule_db.get('schedule').find({schedule_name:req.params.schedule_name}).value();
    if(c2===null)
    res.send("please enter valid schedule name")
    let c3=c2.courses_list;
   //console.log(c3);
    var timetable=[];
    //console.log(c3[0][0].catalog_nbr);
    for(var i=0;i<c3.length;i++){
    let c4=data_db.get('data').filter({catalog_nbr:c3[i][0].catalog_nbr,subject:c3[i][0].subject}).value();
    c4.push(typeof(c3[i][0].course_number)!="undefined"?{"course_number":c3[i][0].course_number}:{"course_number":""});
    timetable.push(c4);
console.log(typeof(c3[i][0].course_number)!="undefined"?c3[i][0].course_number:"");
    }
    
    res.send(timetable);
    //let c2=data_db.get('data').chain().filter({catalog_nbr:req.params.course,subject:req.params.subject}).value();
  });

  //delete a course_list
   router.delete('/api/schedules/:schedule_name/:user_name',(req,res)=>{
    let c2=schedule_db.get('schedule').find({user_name:req.params.user_name,schedule_name:req.params.schedule_name}).value();
    if(c2===null)
    res.send("Please enter valid schedule name")
    schedule_db.get('schedule').remove(c2).write()
      res.send("Deleted");
  });

  //add a review to course list
  router.post('/api/reviews',(req, res) => {
    let index=0;
    const userBody=req.body;
    let c2=schedule_db.get('schedule').find({user_name:userBody.user_name}).get('courses_list').value();
    //let c4=data_db.get('data').filter({catalog_nbr:c3[i][0].catalog_nbr,subject:c3[i][0].subject}).value();
    //let c3=c2.filter({catalog_nbr:"4842A"}).value();
    const review=userBody.review;
    //users_db.get('users').push(user).write()
    //res.status(200).json(user)
    //users_db.get('users')
  //.push(user)
  //.write()
  //let c3=c2
  for(var i=0;i< c2.length;i++){
    if(c2[i][0].catalog_nbr===userBody.catalog_nbr){
     console.log(c2[i][0]);
     index=i;
    break;
    }
  }
  let c3=schedule_db.get('schedule').find({user_name:userBody.user_name}).get('courses_list').get(index).push({review:userBody.review}).write();
  schedule_db.write();
res.send(c3);
   });

  // add the users to Users.json-signup API
  router.post('/api/users', (cors),(req, res) => {
    const userBody=req.body;
    const user = {
     user_name: userBody.user_name,
     password: userBody.password
    }
    //users_db.get('users').push(user).write()
    //res.status(200).json(user)
    users_db.get('users')
  .push(user)
  .write()
  res.send(user);
   });


//GET user authentication
router.get('/api/users/:user_name/:password',(req,res)=>{
    let c2=users_db.get('users').find({user_name:req.params.user_name}).value();
    if(c2===null)
    res.send("please enter valid User Name")
    else if(c2.password===req.params.password)
    res.send("successful login")
    else
    res.send("Login failure!!!")
  });

  app.listen(port,()=>console.log(`Listening on port ${port}`));
app.use(express.static('public'));
app.use("/", router);
app.use(express.json({
  type: ['application/json', 'text/plain']
}));
app.use(cors());
