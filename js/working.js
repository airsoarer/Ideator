(function(){
    $(document).ready(init);
    var config = {
        apiKey: "AIzaSyDnPtJgYW6LNv5PSUo-lnOG3v-F3WOKLQo",
        authDomain: "ideator-d87d1.firebaseapp.com",
        databaseURL: "https://ideator-d87d1.firebaseio.com",
        projectId: "ideator-d87d1",
        storageBucket: "ideator-d87d1.appspot.com",
        messagingSenderId: "1028735046652"
    };

    // Set variable to check if they entered a valid user when adding a user to the project
    realUser = undefined;
    realUID = undefined;

    // Get user uid from localStorage
    uid = localStorage.getItem('uid');
    // console.log(uid);

    // Get idea url
    url = window.location.href;
    url = url.split("?key=");
    ideaKey = url[1];
    // console.log(ideaKey);

    // Get date
    var mm = new Date().getMonth();
    var dd = new Date().getDate();
    var yy = new Date().getFullYear();
    var date = mm + "/" + dd + "/" + yy;

    // User image url
    imageURL = undefined;

    function init(){
        firebase.initializeApp(config);
        // Get user photo and put in respective div
        var storageRef = firebase.storage().ref("Users/" + uid + "/info/profilePhoto");
        storageRef.getDownloadURL().then((url) => {
            imageURL = url;
            localStorage.setItem("url", url);
            // Set image
            $('#navAccountPhoto').attr("src", url);
            $('#mobileNavAccountPhoto').attr("src", url);
            $('#three').attr("src", url);
        });

        // Get user name and put in respective div
        var nameRef = firebase.database().ref('Users/' + uid + "/Info");
        nameRef.on('value', (snapshot) => {
            var data = snapshot.val();
            localStorage.setItem("name", data.FirstName + " " + data.LastName);
            
            $('#name').text(data.FirstName + " " + data.LastName);
            $('#mobileNavAccountName').text(data.FirstName + " " + data.LastName);
        });

        // Get data
        var ref = firebase.database().ref("WorkingSpace/" + ideaKey);
        ref.on("value", (snapshot) => {
            var data = snapshot.val();
            $(".titleInput").attr("placeholder", data.Title);
            $(".textarea").attr("placeholder", data.Description);
            // console.log($("#title").attr("placeholder", data.Title));
        });

        // Get Notes
        var ref = firebase.database().ref("WorkingSpace/" + ideaKey + "/Notes");
        ref.on("child_added", (snapshot) => {
            var data = snapshot.val();
            // console.log(data.Note);

            // Create div
            var div = document.createElement("div");
            div.classList.add("col");
            div.classList.add("m12");
            div.classList.add("note");

            // Create note p
            var p = document.createElement("p");
            p.textContent = data.Note;
            div.appendChild(p);

            $(".notes").append(div);;           
        });

        // Get checklist items
        var ref = firebase.database().ref("WorkingSpace/" + ideaKey + "/Checklist");
        ref.on("child_added", (snapshot) => {
            var data = snapshot.val();
            var key = snapshot.key;

            // Create div
            var div = document.createElement("div");
            div.classList.add("col");
            div.classList.add("m12");
            div.classList.add("checklistDiv");

            // Create surrounding p
            var p = document.createElement("p");
            div.appendChild(p);

            // Create label
            var label = document.createElement("label");
            p.appendChild(label);

            // Create input
            var input = document.createElement("input");
            input.type = "checkbox";
            input.id = key;
            input.classList.add("check");
            if(data.Checked === true){
                $(input).attr("checked", "checked");
            }
            label.appendChild(input);

            // Create span
            var span = document.createElement("span");
            span.textContent = data.ItemName;
            label.appendChild(span);
            
            $(".checklist").append(div);
        });

        // Get Group Messages
        var ref = firebase.database().ref("WorkingSpace/" + ideaKey + "/GroupMessages");
        ref.on("child_added", (snapshot) => {
            var data = snapshot.val();
            // console.log(data.User);

            var ref = firebase.database().ref("Users/" + data.User + "/Info");
            ref.on("value", (snapshot) => {
                var userData = snapshot.val();
                
                // Create Div
                var div = document.createElement("div");
                div.classList.add("col");
                div.classList.add("m12");
                div.classList.add("comment");

                // Text Div
                var txtDiv = document.createElement("div");
                txtDiv.classList.add("txtDiv");
                txtDiv.classList.add("m10");
                // txtDiv.classList.add("offset-m1");
                div.appendChild(txtDiv);
        
                // Name
                var name = document.createElement("h5");
                name.textContent = userData.FirstName + " " + userData.LastName;
                txtDiv.appendChild(name);

                // Comment
                var comment = document.createElement("p");
                comment.textContent = data.Message;
                txtDiv.appendChild(comment);

                $(".messages").append(div);
            });
        });

        // Get Files
        var ref = firebase.database().ref("WorkingSpace/" + ideaKey + "/FilePaths");
        ref.on("child_added", (snapshot) => {
            var data = snapshot.val();
            // console.log(data);

            var storageRef = firebase.storage().ref(data.FilePath);
            storageRef.getDownloadURL().then((url) => {
                // Create Div
                var div = document.createElement("div");
                div.classList.add("col");
                div.classList.add("s12");
                div.classList.add("m3");
                // div.classList.add("offset-m1");
                // div.classList.add("file");

                let temp = document.createElement("div");
                temp.classList.add("col");
                temp.classList.add("s12");
                temp.classList.add("m12");
                temp.classList.add("offset-m1");
                temp.classList.add("file");
                div.appendChild(temp);

                // file icon
                var i = document.createElement("i");
                i.classList.add("col");
                i.classList.add("m3");
                i.classList.add("material-icons");
                i.classList.add("small");
                i.textContent = "insert_drive_file";
                temp.appendChild(i);

                // a
                var a = document.createElement("a");
                a.textContent = data.FileName;
                a.href = url;
                a.target = "_blank";
                a.classList.add("col");
                a.classList.add("m9");
                a.classList.add("truncate");
                temp.appendChild(a);

                $(".files").append(div);
            });
        });

        // Get Users
        var ref = firebase.database().ref("WorkingSpace/" + ideaKey + "/Users");
        ref.on("child_added", (snapshot) => {
            var data = snapshot.val();
            firebase.database().ref("Users/" + data + "/Info").on("value", (snapshot) => {
                var dataTwo = snapshot.val();
                console.log(dataTwo.FirstName);

                // make div
                var div = document.createElement("div");
                div.classList.add("col");
                div.classList.add("m4");
                div.classList.add("user");

                firebase.storage().ref("Users/" + data + "/info/profilePhoto").getDownloadURL().then((url) => {
                    // Make img
                    var img = document.createElement("img");
                    img.src = url;
                    img.classList.add("circle");
                    div.appendChild(img)

                    // Make p
                    var p = document.createElement("p");
                    p.textContent = dataTwo.FirstName + " " + dataTwo.LastName;
                    div.appendChild(p);
                });

                $("#users").append(div);
            });
        });

        // Get Catagories
        var cataRef = firebase.database().ref("Channels");
        cataRef.on("value", (snapshot) => {
            var data = snapshot.val();
            // console.log(data);

            for(var i = 0; i < data.length; i++){
                // Create Div
                var div = document.createElement("div");
                div.classList.add("cata");

                // Create btn
                var btn = document.createElement("button");
                btn.textContent = data[i];
                // btn.href = "../html/catagory.html?type=" + data[i];
                btn.classList.add("truncate");
                btn.classList.add("channelBtn");
                div.appendChild(btn);

                // Create btn
                var btn2 = document.createElement("button");
                btn2.textContent = data[i];
                // btn.href = "../html/catagory.html?type=" + data[i];
                btn2.classList.add("truncate");
                btn2.classList.add("channelBtn");
                // div.appendChild(btn);

                // Create li drop downs for mobile
                // li
                var li = document.createElement("li");
                li.appendChild(btn2);

                // Append
                $("#dropdown").append(li);
                $('.catagories').append(div);

                // Create options
                // Option
                var option = document.createElement("option");
                option.textContent = data[i];

                // Append
                $("select").append(option);
                $('select').formSelect();
            }
        });

        // Event Triggers
        $(".dropdown-trigger").dropdown();
        $('.sidenav').sidenav();
        $('select').formSelect();
        $('.titleInput').on("keyup", (e) => {
            // console.log("working");
            if(e.keyCode === 13){
                updateTitle();
            }
        });
        $('.textarea').on("keyup", (e) => {
            if(e.keyCode === 13){
                updateDescription();
            }
        });
        $("#userTrigger").on("click", userTrigger);
        $("#user").on("keyup", userCheck);
        $("#addUser").on("click", addUser);
        $("#send").on('click', groupMessage);
        $('#checklist').on("click", checklist);
        $("#check").on("click", createChecklistItem);
        $(document.body).on('click', '.check', check);
        $('.idea').on('click', ideaModal);
        $("#notes").on('click', notes);
        $('#note').on("click", createNote);
        $("#files").on("click", files);
        $("#file").on("click", uploadFile);
        $('#createIdea').on('click', createIdea);
        $('#logout').on("click", logout);
    }

    function updateTitle(){
        // Get new title value
        var title = $('.titleInput').val();
        
        // Firebase ref
        firebase.database().ref("WorkingSpace/" + ideaKey).child("Title").transaction((Title) => {
            Title = title;
            $(".titleInput").attr("placeholder", title);
            $(".titleInput").blur();
            return Title;
        });
    }

    function updateDescription(){
        // Get new description value;
        var description = $(".textarea").val();

        // Firebase ref 
        firebase.database().ref("WorkingSpace/" + ideaKey).child("Description").transaction((Description) => {
            Description = description;
            $(".textarea").attr("placeholder", description);
            $(".textarea").blur();
            return Description;
        });
    }

    function addUser(){
        $("#checkIcon").css("color", "#000000");
        $("#user").html("");
        console.log(realUser);
        if(realUser === true){
            firebase.database().ref("Users/" + realUID + "/WorkingSpaceKeys").push({
                Key:ideaKey,
            });

            firebase.database().ref("WorkingSpace/" + ideaKey).child("Users").transaction((Users) => {
                Users.push(realUID);
                return Users;
            })
        }

        $("#usersModal").modal("close");
    }

    function userCheck(){
        // console.log("working");
        var user = $("#user").val();
        firebase.database().ref("Users").on("value", (snapshot) => {
            var data = snapshot.val();
            var key = snapshot.key;

            var x = 0;
            for(var i in data){
                var name = data[i].Info.FirstName + " " + data[i].Info.LastName;
                if(name === user){
                    $("#checkIcon").css("color", "#FFD43C");
                    realUser = true;
                    realUID = Object.keys(data)[x];
                    console.log(realUser);
                    return;
                }else if(name != user){
                    realUser = false;
                }else{
                    return;
                }
                x++;
            }
        });
    }

    function check(){
        var key = $(this).attr("id");
        var checked = $(this).prop("checked");
        
        firebase.database().ref("WorkingSpace/" + ideaKey + "/Checklist/" + key).child("Checked").transaction((Checked) => {
            Checked = checked;
            return Checked;
        });
    }

    function groupMessage(){
        var message = $("#message").val();
        var ref = firebase.database().ref("WorkingSpace/" + ideaKey + "/GroupMessages");
        ref.push({
            User:uid,
            Message:message,
        });
        $("#message").val("");
    }

    function uploadFile(){
        var fileTemp = $("#newFile")[0];
        var file = fileTemp.files[0];

        firebase.storage().ref("Ideas/" + ideaKey + "/Files/" + file.name).put(file, {contentType:file.type}).then((snapshot) => {
            // console.log(snapshot.metadata.name);
            firebase.database().ref("WorkingSpace/" + ideaKey + "/FilePaths").push({
                FilePath:snapshot.metadata.fullPath,
                FileName:snapshot.metadata.name,
            });
        });
        $("#filesModal").modal("close");
    }

    function createChecklistItem(){
        var item = $("#newChecklistItem").val();
        firebase.database().ref("WorkingSpace/" + ideaKey + "/Checklist").push({
            ItemName:item,
            Checked:false
        });
        $("#newChecklistItem").val("");
        $("#checklistModal").modal("close");
    }

    function createNote(){
        var note = $("#newNote").val();
        firebase.database().ref("WorkingSpace/" + ideaKey + "/Notes").push({Note:note});
        $("#newNote").val("");
        $("#notesModal").modal("close");
    }

    function userTrigger(){
        // console.log("working");
        $("#usersModal").modal();
        $("#usersModal").modal("open");
    }

    function files(){
        $('#filesModal').modal();
        $("#filesModal").modal("open");
    }

    function notes(){
        $("#notesModal").modal();
        $("#notesModal").modal("open");
    }

    function checklist(){
        $("#checklistModal").modal();
        $("#checklistModal").modal("open");
    }

    function logout(){
        firebase.auth().signOut().then(() => {
            localStorage.removeItem("uid");
            localStorage.removeItem("url");
            localStorage.removeItem("name");
            location.replace("../html/landing.html");
        });
    }

    function ideaModal(){
        $('#ideaModal').modal();
        $('#ideaModal').modal('open');
    }

    function createIdea(){
        // Get idea data
        var title = $('#title').val();
        var channel = $('select').val();
        var status = $('input[name=status]:checked').val();
        var description = $('#description').val();

        if(title.length === 0){
            $('#title').css('border-color: red');
            return;
        }else if(channel.length === 0){
            $('#channel').css('border-color', 'red');
            return;
        }else if(description.length === 0){
            $('#description').css('border-color', 'red');
            return;
        }else{
            // continue;
        }

        // Get database ref
        var ref = firebase.database().ref("WorkingSpace");
        ref.push({
            Title:title,
            Channel:channel,
            Status:status,
            Description:description,
            CreationDate:date,
            Creator:uid,
            Lights:0,
            Users:[
                uid,
            ]
        }).then(function(){
            ref.once("child_added", (snapshot) => {
                var key = snapshot.key;
                firebase.database().ref("Users/" + uid + "/WorkingSpaceKeys").push({
                    Key:key,
                });
            });
            $('#ideaModal').modal();
            $('#ideaModal').modal("close");
        });
    }
})();