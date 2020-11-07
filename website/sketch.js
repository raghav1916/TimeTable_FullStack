

function setup(){
//     console.log('running');
//     loadedJson=loadJSON('/api/courses',gotData);
//     console.log(loadedJson);
fetch('/api/courses')
    .then(res => res.json())
    .then((out) => {
        console.log('Output: ', out);
        buildTable(out);
}).catch(err => console.error(err));
}
function buildTable(data){
    var table=document.getElementById('subject_table');
    for(var i=0;i<data.length;i++){
        var row=`<tr>
        <td>${data[i].subject}</td>
        <td>${data[i].className}</td>
        </tr>`
        table.innerHTML+=row;
    }
}

function buildCourseTable(data){
    var table=document.getElementById('course_table');
    for(var i=0;i<data.length;i++){
        var row=`<tr>
        <td>${data[i]}</td>
        </tr>`
        table.innerHTML+=row;
    }
}

function buildSubjectOnlyTable(data){
    var table=document.getElementById('time_table_by_subject');
    for(var i=0;i<data.length;i++){
        var row=`<tr>
        <td>${data[i].catalog_description}</td>
        <td>${data[i].catalog_nbr}</td>
        <td>${data[i].className}</td>
        <td>${data[i].course_info[0].days}</td>
        <td>${data[i].course_info[0].start_time}</td>
        <td>${data[i].course_info[0].end_time}</td>
        <td>${data[i].subject}</td>
        </tr>`
        table.innerHTML+=row;
    }
}
function buildSubjectAndCourseTable(data){
    var table=document.getElementById('time_table_by_course');
    for(var i=0;i<data.length;i++){
        var row=`<tr>
        <td>${data[i].catalog_description}</td>
        <td>${data[i].catalog_nbr}</td>
        <td>${data[i].className}</td>
        <td>${data[i].course_info[0].days}</td>
        <td>${data[i].course_info[0].start_time}</td>
        <td>${data[i].course_info[0].end_time}</td>
        <td>${data[i].subject}</td>
        </tr>`
        table.innerHTML+=row;
    }
}
function buildSubjectCourseOptTable(data){
    var table=document.getElementById('time_table_by_opt_course');
    for(var i=0;i<data.length;i++){
        var row=`<tr>
        <td>${data[i].catalog_description}</td>
        <td>${data[i].catalog_nbr}</td>
        <td>${data[i].className}</td>
        <td>${data[i].course_info[0].days}</td>
        <td>${data[i].course_info[0].start_time}</td>
        <td>${data[i].course_info[0].end_time}</td>
        <td>${data[i].subject}</td>
        </tr>`
        table.innerHTML+=row;
    }
}
function buildScheduleTable(data){
    var table=document.getElementById('time_table_by_schedule');
    for(var i=0;i<data.length;i++){
        var row=`<tr>
        <td>${data[i].catalog_description}</td>
        <td>${data[i].catalog_nbr}</td>
        <td>${data[i].className}</td>
        <td>${data[i].course_info[0].days}</td>
        <td>${data[i].course_info[0].start_time}</td>
        <td>${data[i].course_info[0].end_time}</td>
        <td>${data[i].subject}</td>
        </tr>`
        table.innerHTML+=row;
    }
}
async function getCourseBySubject(){
    let searchText = document.getElementById('subject_name').value;
    //console.log(searchText);
    const response=await fetch(`/api/courses/${searchText}`)
    .then(res => res.json())
    .then((out) => {
        console.log('Output: ', out);
        buildCourseTable(out);
}).catch(err => console.error(err));

// console.log(response.json());
}
function getTimeTableBySubject(){
   // let searchText = document.getElementById('exampleFormControlSelect1').value;
   let searchText = document.getElementById('subject_name').value;
    //console.log(searchText);
    fetch(`/api/courseSchedules/${searchText}`)
    .then(res => res.json())
    .then((out) => {
        console.log('Output: ', out);
        buildSubjectOnlyTable(out);
}).catch(err => console.error(err));
}
function getTimeTableByCourse(){
    //let searchText = document.getElementById('exampleFormControlSelect1').value;
    //let searchCourse=document.getElementById('exampleFormControlTextarea1').value;
    //console.log(searchText);
    let searchText = document.getElementById('subject_name').value;
let searchCourse=document.getElementById('course_name').value;
    fetch(`/api/courseSchedules/${searchText}/${searchCourse}`)
    .then(res => res.json())
    .then((out) => {
        buildSubjectAndCourseTable(out);
        console.log('Output: ', out);
}).catch(err => console.error(err));
}
function getTimeTableByCourseComponent(){
    let searchText = document.getElementById('subject_name').value;
let searchCourse=document.getElementById('course_name').value;
    let searchCourseComponent = document.getElementById('course_component_name').value;
    //console.log(searchText);
    fetch(`/api/courseSchedules/${searchText}/${searchCourse}/${searchCourseComponent}`)
    .then(res => res.json())
    .then((out) => {
        buildSubjectCourseOptTable(out);
        console.log('Output: ', out);
}).catch(err => console.error('error found',err));
}

function getTimeTable(){
let searchText = document.getElementById('exampleFormControlSelect1').value;
let searchCourse=document.getElementById('exampleFormControlTextarea1').value;
let searchCourseComponent = document.getElementById('course_component_name').value;
//if(searchText.length!=0&&searchCourse.length!==0&&searchCourseComponent.length!==0){
    //getTimeTableByCourseComponent(searchText,searchCourse,searchCourseComponent);
    getCourseBySubject();
//
}
function getMyTimeTable(){
    let searchSchedule=document.getElementById('schedule_name').value;
    fetch(`/api/schedulesTimeTable/${searchSchedule}`)
    .then(res => res.json())
    .then((out) => {
        buildScheduleTable(out);
        console.log('Output: ', out);
}).catch(err => console.error('error found',err));
}