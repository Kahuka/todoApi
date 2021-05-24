var url = "http://demo2.z-bit.ee/";

var username;
var firstname;
var lastname;
var password;
var title_input;
var desc_input;
var loggedin = false;

var access_token = "";
function updatevalues() {
    username = document.getElementById("username").value;
    firstname = document.getElementById("firstname").value;
    lastname = document.getElementById("lastname").value;
    password = document.getElementById("password").value;
    title_input = document.getElementById("title").value;
    desc_input = document.getElementById("desc").value;

}

function createAccount() {
    updatevalues();
    let data = {
        username: username,
        newPassword: password
    };
    let json = JSON.stringify(data);

    console.log(json)

    var xhr = new XMLHttpRequest();
    var response;
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status == 201) {
            var response = JSON.parse(this.responseText);
            console.log(response);
            access_token = response.access_token;
            document.getElementById("logged").style.visibility = "visible";
            loggedin = true;
            // we get the returned data
        }

        // end of state change: it can be after some time (async)
    };
    xhr.open("POST", url + "users", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json)
}



function login() {
    updatevalues();
    let data = {
        username: username,
        password: password
    }
    let json = JSON.stringify(data);



    var xhr = new XMLHttpRequest();
    var response;
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;
        console.log(this.status);
        var response = JSON.parse(this.responseText);
        if (this.status == 200) {
            console.log(response);
            access_token = response.access_token;
            document.getElementById("logged").style.visibility = "visible";

            document.getElementById("firstname").value = response.firstname;
            document.getElementById("lastname").value = response.lastname;
            loggedin = true;
            // we get the returned data
        }
        if (this.status == 400) alert(this.responseText)


        // end of state change: it can be after some time (async)
    };
    xhr.open("POST", url + "users/get-token", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.send(json)
}
function appendHtml(el, str) {
    var div = document.createElement('div');
    div.innerHTML = str;
    while (div.children.length > 0) {
        el.appendChild(div.children[0]);
    }
}

function checkboxTrue(marked_as_done) {
    if (marked_as_done)
        return "checked"
}

function newTask(id, title, desc, marked_as_done, created_at) {

    var taskHtml =
        `
    <div class="card task">
    <table style="width:100%">
        <tr>
        <td>Title</td>
        <td>Description</td> 
        <td>Date</td>
        <td>Done</td>
        <td>ID</td>
        </tr>
        <tr>
        <td><p class="title" style="max-width: 25%">${title}</p></td>
        <td><p class="desc"style="max-width: 25%">${desc}</p></td>
        <td><p class="created_at"style="width: 25%">${created_at}</p></td>
        <td><input type="checkbox"style="width: 25%" class="marked_as_done" ${checkboxTrue(marked_as_done)} onchange="switchDoneTask('${id}','${title}','${desc}','${marked_as_done}')"></checkbox></td>
        <td><p class="id" style="width: 25%">${id}</p></td>
        </tr>
        </table>
        <button class="delete" onclick="deleteTask(${id})">Delete</button>
        </div>


   
    `
    appendHtml(document.getElementById("list"), taskHtml)

    /*
        <div class="card task">
        <h2 class="title">${title}</h2> <input type="checkbox" class="marked_as_done" value="${marked_as_done}"></checkbox> <p class="id">${id}</p> 
        <p class="desc">${desc}</p>
        <p class="created_at">${created_at}</p>
    </div>
        */


}

function addTask() {

    if (!loggedin) {
        alert("Log in")
        return;
    }
    updatevalues();
    let data = {
        title: title_input,
        desc: desc_input
    };
    let json = JSON.stringify(data);


    var xhr = new XMLHttpRequest();
    var response;
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        if (this.status == 201) {
            var response = JSON.parse(this.responseText);
            console.log(response);
            access_token = response.access_token;
            document.getElementById("logged").style.visibility = "visible";
            loggedin = true;
            document.getElementById("title").value = "";
            document.getElementById("desc").value = "";
            refreshTasks();
        }
        // if (this.status == 400) alert(this.responseText)


        // end of state change: it can be after some time (async)
    };
    xhr.open("POST", url + "tasks", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.send(json)
}


function refreshTasks() {
    if (!loggedin) {
        alert("Log in")
        return;
    }

    document.getElementById("list").innerHTML = '';

    var xhr = new XMLHttpRequest();
    var response;
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;
        console.log(this.status)
        if (this.status == 200) {
            var response = JSON.parse(this.responseText);
            console.log(this.responseText)
            response.forEach(element => {
                newTask(element.id, element.title, element.desc, element.marked_as_done, element.created_at);
            });
            // we get the returned data
        }
        //  if (this.status == 401) alert(this.responseText)


        // end of state change: it can be after some time (async)
    };
    xhr.open("GET", url + "tasks", true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.send()

    login();



}

function deleteTask(id) {
    var xhr = new XMLHttpRequest();
    var response;

    xhr.open("Delete", url + "tasks/" + id, true);
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.send()

    refreshTasks();

}

function switchDoneTask(id, title, desc, marked_as_done) {
    var realmark;
    if (marked_as_done == "true") {
        realmark = false
    }
    else realmark = true;

    let data = {
        title: title,
        desc: desc,
        marked_as_done: realmark
    };

    let json = JSON.stringify(data);


    var xhr = new XMLHttpRequest();
    var response;
    xhr.onreadystatechange = function () {
        if (this.readyState != 4) return;

        console.log(this.status)
        if (this.status == 200 || this.status == 204) {
            var response = JSON.parse(this.responseText);
            console.log(response);

            refreshTasks();
        }
        // if (this.status == 400) alert(this.responseText)


        // end of state change: it can be after some time (async)
    };
    xhr.open("put", url + "tasks/" + id, true);
    xhr.setRequestHeader('Content-Type', 'application/json');
    xhr.setRequestHeader('Authorization', `Bearer ${access_token}`);
    xhr.send(json)
}


