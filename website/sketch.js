var name="done";
function toggleDisplay() {
  this.isDisplay = !this.isDisplay;
}
function setup() {
    //     console.log('running');
    //     loadedJson=loadJSON('/api/courses',gotData);
    //     console.log(loadedJson);
    fetch("/api/courses")
      .then((res) => res.json())
      .then((out) => {
        console.log("Output: ", out);
        buildTable(out);
      })
      .catch((err) => console.error(err));
  }
  function buildTable(data) {
    var table = document.getElementById("subject_table");
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
          <td>${data[i].subject}</td>
          <td>${data[i].className}</td>
          </tr>`;
      table.innerHTML += row;
    }
  }
  
  function buildCourseTable(data) {
    var table = document.getElementById("course_table");
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
          <td>${data[i]}</td>
          </tr>`;
      table.innerHTML += row;
    }
  }
  
  function buildSubjectOnlyTable(data) {
    var table = document.getElementById("time_table_by_subject");
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
          <td>${data[i].catalog_description}</td>
          <td>${data[i].catalog_nbr}</td>
          <td>${data[i].className}</td>
          <td>${data[i].course_info[0].days}</td>
          <td>${data[i].course_info[0].start_time}</td>
          <td>${data[i].course_info[0].end_time}</td>
          <td>${data[i].subject}</td>
          </tr>`;
      table.innerHTML += row;
    }
  }
  function buildSubjectAndCourseTable(data) {
    var table = document.getElementById("time_table_by_course");
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
          <td>${data[i].catalog_description}</td>
          <td>${data[i].catalog_nbr}</td>
          <td>${data[i].className}</td>
          <td>${data[i].course_info[0].days}</td>
          <td>${data[i].course_info[0].start_time}</td>
          <td>${data[i].course_info[0].end_time}</td>
          <td>${data[i].subject}</td>
          </tr>`;
      table.innerHTML += row;
    }
  }
  function buildSubjectCourseOptTable(data) {
    var table = document.getElementById("time_table_by_opt_course");
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
          <td>${data[i].catalog_description}</td>
          <td>${data[i].catalog_nbr}</td>
          <td>${data[i].className}</td>
          <td>${data[i].course_info[0].days}</td>
          <td>${data[i].course_info[0].start_time}</td>
          <td>${data[i].course_info[0].end_time}</td>
          <td>${data[i].subject}</td>
          </tr>`;
      table.innerHTML += row;
    }
  }
  function buildScheduleTable(data) {
    var table = document.getElementById("time_table_by_schedule");
    console.log("data respresented",data[1][0]);
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
          <td>${data[i][0].catalog_nbr}</td>
          <td>${data[i][0].className}</td>
          <td>${data[i][0].course_info[0].days}</td>
          <td>${data[i][0].course_info[0].start_time}</td>
          <td>${data[i][0].course_info[0].end_time}</td>
          <td>${data[i][0].subject}</td>
          <td>${data[i][1].course_number}</td>
          </tr>`;
      table.innerHTML += row;
    }
  }
  
  
  
  function sanitize(string) {

    const map = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#x27;",
      "/": "&#x2F;",
    };
    const reg = /[&<>"'/]/gi;
    return string.replace(reg, (match) => map[match]).toUpperCase().replace(/\s+/g, '');
  }
  async function getCourseBySubject() {
    let searchText = document.getElementById("subject_name").value;
    searchText = sanitize(searchText);
    if (searchText.length > 3 && /^[a-zA-Z]+$/.test(searchText)) {
      const response = await fetch(`/api/courses/${searchText}`)
        .then((res) => res.json())
        .then((out) => {
          console.log("Output: ", out);
          buildCourseTable(out);
        })
        .catch((err) => console.log(err));
    }
    else if(searchText.length<4){
      alert("Please enter more than 3 characters");
    } else {
      console.log("Format Error");
    }
    //console.log(searchText);
  
    // console.log(response.json());
  }
  function getTimeTableBySubject() {
    // let searchText = document.getElementById('exampleFormControlSelect1').value;
    let searchText = document.getElementById("subject_name").value;
    searchText = sanitize(searchText);
    if (searchText.length > 3 && /^[a-zA-Z]+$/.test(searchText)) {
      fetch(`/api/courseSchedules/${searchText}`)
        .then((res) => res.json())
        .then((out) => {
          console.log("Output: ", out);
          buildSubjectOnlyTable(out);
        })
        .catch((err) => console.error(err));
    }else if(searchText.length<4){
      alert("Please enter more than 3 characters");
    } else {
      console.log("Format Error");
    }
    //console.log(searchText);
  }
  function getTimeTableByCourse() {
    //let searchText = document.getElementById('exampleFormControlSelect1').value;
    //let searchCourse=document.getElementById('exampleFormControlTextarea1').value;
    //console.log(searchText);
    let searchText = document.getElementById("subject_name").value;
    searchText = sanitize(searchText);
    let searchCourse = document.getElementById("course_name").value;
    searchCourse = sanitize(searchCourse);
    if (
      searchText.length > 3 &&
      /^[a-zA-Z]+$/.test(searchText) &&
      searchCourse.length > 3 &&
      /^[a-zA-Z0-9]+$/.test(searchCourse)
    ) {
      fetch(`/api/courseSchedules/${searchText}/${searchCourse}`)
        .then((res) => res.json())
        .then((out) => {
          buildSubjectAndCourseTable(out);
          console.log("Output: ", out);
        })
        .catch((err) => console.error(err));
    }
    else if(searchText.length<4||searchCourse<4){
      alert("Please enter more than 3 characters");
    }
    else {
      console.log("Format Error");
    }
  }
  function getTimeTableByCourseComponent() {
    let searchText = document.getElementById("subject_name").value;
    let searchCourse = document.getElementById("course_name").value;
    let searchCourseComponent = document.getElementById("course_component_name")
      .value;
    //console.log(searchText);
    searchText = sanitize(searchText);
    searchCourse = sanitize(searchCourse);
    searchCourseComponent = sanitize(searchCourseComponent);
    if (
      searchText.length > 3 &&
      /^[a-zA-Z]+$/.test(searchText) &&
      searchCourse.length > 3 &&
      /^[a-zA-Z0-9]+$/.test(searchCourse) &&
      searchCourseComponent.length > 0 &&
      /^[a-zA-Z]+$/.test(searchCourseComponent)
    ) {
      fetch(
        `/api/courseSchedules/${searchText}/${searchCourse}/${searchCourseComponent}`
      )
        .then((res) => res.json())
        .then((out) => {
          buildSubjectCourseOptTable(out);
          console.log("Output: ", out);
        })
        .catch((err) => console.error("error found", err));
    }
    else if(searchText.length<4||searchCourse<4){
      alert("Please enter more than 3 characters");
    }
     else {
      console.log("format error");
    }
  }
  
  function getTimeTable() {
    let searchText = document.getElementById("exampleFormControlSelect1").value;
    let searchCourse = document.getElementById("exampleFormControlTextarea1")
      .value;
    let searchCourseComponent = document.getElementById("course_component_name")
      .value;
    //if(searchText.length!=0&&searchCourse.length!==0&&searchCourseComponent.length!==0){
    //getTimeTableByCourseComponent(searchText,searchCourse,searchCourseComponent);
    getCourseBySubject();
    //
  }
  function getMyTimeTable() {
    toggleDisplay();
    let searchSchedule = document.getElementById("schedule_name").value;
    searchSchedule = sanitize(searchSchedule);
    //print(searchSchedule);
    if (searchSchedule.length > 3 && /^[a-zA-Z0-9]+$/.test(searchSchedule)) {
      fetch(`/api/schedulesTimeTable/${searchSchedule}`)
        .then((res) => res.json())
        .then((out) => {
          buildScheduleTable(out);
          //console.log("Output: ", out);
        })
        .catch((err) => console.error("error found", err));
    }
    else if(searchSchedule.length<4){
      alert("Please enter more than 3 characters");
    } else {
      console.log("Format Error");
    }
  }
  function getMyCreatedSchedule(e) {
    //let searchSchedule = document.getElementById("schedule_name_create").value;
    //searchSchedule = sanitize(searchSchedule);
    //print(searchSchedule);
    if (e.target.id.length > 0 && /^[a-zA-Z0-9]+$/.test(e.target.id)) {
      fetch(`/api/schedulesTimeTable/${e.target.id}`)
        .then((res) => res.json())
        .then((out) => {
          buildScheduleTable(out);
          console.log("Output: ", out);
        })
        .catch((err) => console.error("error found", err));
    } 
    else if(name.length<4){
      alert("Please enter more than 3 characters");
    }
    else {
      console.log("Format Error");
    }
  }
  async function deleteAllSchedules(url) {
    return fetch(url, {
      method: 'delete'
    })
      .then(response => response.json());
  }
  async function deleteASchedules() {
    let id=document.getElementById("Delete_Schedule").value;
    if(id.length>3){
    fetch('/api/schedules/' + id, {
    method: 'DELETE',
  })
  .then(res => res.json()) // or res.json()
  .then(res => console.log(res))
  }
  else
    alert("Please enter more than 3 characters");
  
}

function getMyCourseLists() {
  let searchUsername=document.getElementById("user_courseList").value;
  searchUsername=sanitize(searchUsername);
  if (searchUsername.length > 3 && /^[a-zA-Z0-9]+$/.test(searchUsername)) {
    fetch(`/api/user/schedules/${searchUsername}`)
      .then((res) => res.json())
      .then((out) => {
        buildCourseLists(out);
        console.log("Output: ", out);
      })
      .catch((err) => console.error("error found", err));
  } 
  else if(searchUsername.length<4){
    alert("Please enter more than 3 characters");
  }
  else {
    console.log("Format Error");
  }
}
function buildCourseLists(data) {
  var table = document.getElementById("user_courseLists");
  for (var i = 0; i < data.length; i++) {
    var row = `<tr>
        <td>${data[i][0].catalog_nbr}</td>
        <td>${data[i][0].subject}</td>
        <td><input id="${data[i][0].catalog_nbr}" type="submit" value="${data[i][0].subject}" onclick="getMyTimeTable(event)"></td>
        </tr>`;
    table.innerHTML += row;
  }
}
function getMyTimeTable(event) {
    fetch(`/api/courseSchedules/${event.target.value}/${event.target.id}`)
      .then((res) => res.json())
      .then((out) => {
        displayCourseListTimeTable(out);
        console.log("Output: ", out);
      })
      .catch((err) => console.error(err));
  }

  function displayCourseListTimeTable(data) {
    var table = document.getElementById("courseLists_timetable");
    for (var i = 0; i < data.length; i++) {
      var row = `<tr>
          <td>${data[i].catalog_description}</td>
          <td>${data[i].catalog_nbr}</td>
          <td>${data[i].className}</td>
          <td>${data[i].course_info[0].days}</td>
          <td>${data[i].course_info[0].start_time}</td>
          <td>${data[i].course_info[0].end_time}</td>
          <td>${data[i].subject}</td>
          </tr>`;
      table.innerHTML += row;
    }
  }
 

  
  function displayScheduleTable(data) {
    var table = document.getElementById("view_schedule");
    for (var i = 0; i < data.length; i++) {
    name=`${data[i].schedule}`;
      var row = `<tr>
          <td>${data[i].schedule}</td>
          <td>${data[i].user}</td>
          <td>${data[i].numberOfCourses}</td>
          <td><input id="${data[i].schedule}" type="submit" value="Expand" onclick="getMyCreatedSchedule(event)"></td>
          <td><input id="${data[i].user}/${data[i].schedule}" type="submit" value="Delete" onclick="deleteMyCreatedSchedule(event)"></td>
          </tr>`;
      table.innerHTML += row;
    }
    //console.log(data[i].schedule);
  }

  async function deleteMyCreatedSchedule(event){
    var r=confirm("Are you sure you want to delete");
    if(r==true){
      let schedule_id=event.target.id.split("/")[1];
      let user_name=event.target.id.split("/")[0];
    
    await fetch(`/api/schedules/${schedule_id}/${user_name}`, {
    method: 'DELETE',
  })
  .then(res => res.json()) // or res.json()
  .then(res => console.log(res))
}
 

  }
  
  async function viewallschedules() {
    const response = await fetch('/api/scheduleslist')
        .then((res) => res.json())
        .then((out) => {
          displayScheduleTable(out);
          console.log("Output: ", out);
        })
        .catch((err) => console.error("error found", err));
    }

    async function addCoursesList(){
      let Schedule_name = document.getElementById("Name_Add").value;
      let course_code = document.getElementById("Add_Course_Code").value;
      let subject = document.getElementById("Add_Subject").value;
      let optional_descirption = document.getElementById("add_Optional_description").value;
      let course_number=document.getElementById("add_course_number").value;
      if(course_number<1||course_number>6)
      alert("PLEASE ENTER VALID COURSE NUMBER")
      else{
      if (document. getElementById('visibility'). checked) {
      let visibility="Y";
        }
        else{
        visibility="N";
        }
        Schedule_name = sanitize(Schedule_name);
        course_code = sanitize(course_code);
        subject = sanitize(subject);
        optional_descirption = sanitize(optional_descirption);
        course_number=sanitize(course_number);
      if (Schedule_name.length > 0 && /^[a-zA-Z0-9]+$/.test(Schedule_name)) {
        fetch(`/api/schedules/`,
        {method:'PUT',
        body: JSON.stringify({
          "schedule_name": Schedule_name,
          "courses_list": [
             { 
                 "catalog_nbr": course_code,
                 "subject": subject,
                 "optional_desc":optional_descirption,
                 "Visibility":visibility,
                 "course_number":course_number.length>0?course_number:""
                 
       }
          ]
        }),
        headers: { "Content-Type": "application/json" }
      })
          .then((res) => res.json())
          .then((out) => {
            const loginResponse = document.getElementById("auth_id");
            loginResponse.innerHTML += out;
            console.log("Output: ", out);
          })
          .catch((err) => console.error("error found", err));
      } else {
        console.log("Format Error");
      }
    }
  }

  async function saveReview(){
    let userName=document.getElementById("user_courseList").value;
    let courseId=document.getElementById("user_courseId").value;
    let review=document.getElementById("user_review").value;
    userName=sanitize(userName);
    courseId=sanitize(courseId);
    review=sanitize(review);
    if(userName.length==0||courseId.length==0||review.length==0){
      alert("please enter mandatory field values");
    }
    if (userName.length > 0 && /^[a-zA-Z0-9]+$/.test(userName)) {
      fetch(`/api/reviews/`,
      {method:'POST',
      body: JSON.stringify({"user_name": userName, "catalog_nbr": courseId,"review":review}),
      headers: { "Content-Type": "application/json" }
    })
        .then((res) => res.json())
        .then((out) => {
          console.log("Output: ", out);
        })
        .catch((err) => console.error("error found", err));
    } else {
      console.log("Format Error");
    }
  }
    
    async function getLoggedIn() {
      let userName = document.getElementById("user_name").value;
      let password = document.getElementById("password").value;
      userName = sanitize(userName);
      password = sanitize(password);
      //print(searchSchedule);
      console.log("usern",userName);
      if (userName.length > 0 && /^[a-zA-Z0-9]+$/.test(userName)) {
        // const response= fetch(`/api/users/${userName}/${password}`,{
        // headers : { 
        //   'Content-Type': 'application/json',
        //   'Accept': 'application/json'
        // }
        //  })
        //   .then((res) => res.json())
        //   // .then((out) => {
        //   //   const loginResponse = document.getElementById("auth_id");
        //   //   loginResponse.innerHTML += out;
        //   //   console.log("Output: ", out);
        //   // })
        //   .catch((err) => console.error("error found", err));
        // var config = {
        //   method: 'get',
        //   url: 'http://localhost:3000//api/users/${userName}/${password}'
        // };
        
        axios.get('http://localhost:3000//api/users/${userName}/${password}')
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error);
        });
      } else {
        console.log("Format Error");
      }
      
    }

    async function getSignedUp() {
      let userName = document.getElementById("user_name").value;
      let password = document.getElementById("password").value;
      userName = sanitize(userName);
      password = sanitize(password);
      //print(searchSchedule);
      //console.log("usern",userName);
      if (userName.length > 0 && /^[a-zA-Z0-9]+$/.test(userName)) {
        fetch(`/api/users/`,
        {method:'POST',
        body: JSON.stringify({"user_name": userName, "password": password}),
        headers: { "Content-Type": "application/json" }
      })
          .then((res) => res.json())
          .then((out) => {
            const loginResponse = document.getElementById("auth_id");
            loginResponse.innerHTML += out;
            console.log("Output: ", out);
          })
          .catch((err) => console.error("error found", err));
      } else {
        console.log("Format Error");
      }
    }
    th = document.getElementsByTagName('th');

for(let c=0; c < th.length; c++){

    th[c].addEventListener('click',item(c))
}


function item(c){

    return function(){
      console.log(c)
      sortTable(c)
    }
}
    function sortTable(c) {
      var table, rows, switching, i, x, y, shouldSwitch;
      table = document.getElementById("time_table_by_schedule");
      switching = true;
      /* Make a loop that will continue until
      no switching has been done: */
      while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        rows = table.rows;
        /* Loop through all table rows (except the
        first, which contains table headers): */
        for (i = 1; i < (rows.length - 1); i++) {
          // Start by saying there should be no switching:
          shouldSwitch = false;
          /* Get the two elements you want to compare,
          one from current row and one from the next: */
          x = rows[i].getElementsByTagName("TD")[c];
          y = rows[i + 1].getElementsByTagName("TD")[c];
          // Check if the two rows should switch place:
          if (x.innerHTML.toLowerCase() > y.innerHTML.toLowerCase()) {
            // If so, mark as a switch and break the loop:
            shouldSwitch = true;
            break;
          }
        }
        if (shouldSwitch) {
          /* If a switch has been marked, make the switch
          and mark that a switch has been done: */
          rows[i].parentNode.insertBefore(rows[i + 1], rows[i]);
          switching = true;
        }
      }
    }
    
