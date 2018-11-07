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

     // Get user uid from localStorage
     uid = localStorage.getItem('uid');

    // Get url
    url = window.location.href;
    url = url.split("?type=");
    type = url[1];
    type = type.split("?uid=");
    type = type[0];
    // console.log(type);

    if(type === "d"){
        url2 = window.location.href;
        url2 = url2.split("?uid=");
        id = url2[1];
        console.log(id);
    }

    // User image url
    imageURL;

    function init(){
        firebase.initializeApp(config);
        if(type === "d"){
            // console.log(type);
            $('#edit').addClass("follow");
            $('#edit').removeClass("modal-trigger");
            $('#edit').html("Follow");

            // Get Followers and Following
            var ref = firebase.database().ref("Users/" + id + "/Info");
            ref.on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data.Followers);
                let following = data.Following.Users.length - 1;
                let followers = data.Followers.length - 1;

                $("#followingSpan").text(following);
                $("#followersSpan").text(followers);
            });

            // Get user photo and put in respective div
            var storageRef = firebase.storage().ref("Users/" + id + "/info/profilePhoto");
            storageRef.getDownloadURL().then((url) => {
                imageURL = url;
                // Set image
                $('.photo').attr("src", url);
            });

            // Get user name and put in respective div
            var nameRef = firebase.database().ref('Users/' + id + "/Info");
            nameRef.on('value', (snapshot) => {
                var data = snapshot.val();
                $('#bodyName').text(data.FirstName + " " + data.LastName);
            });

            // Get Bio
            var bioRef = firebase.database().ref("Users/" + id + "/Info");
            bioRef.on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data.Bio);

                // Append to bio p
                $(".bio").text(data.Bio);
            });

            // Get Ideas
            var ref = firebase.database().ref("Ideas");
            ref.on("child_added", (snapshot) => {
                var data = snapshot.val();
                var key = snapshot.key;
                // console.log(data);
                
                if(data.Creator === id){
                    // console.log("working");

                    // Create Div 
                    var div = document.createElement("div");
                    div.classList.add("row");
                    div.classList.add("idea");

                    // Title and Channel div
                    var titleDiv = document.createElement("div");
                    titleDiv.classList.add("col");
                    titleDiv.classList.add("s12");
                    titleDiv.classList.add("m10");
                    titleDiv.classList.add("title");
                    div.appendChild(titleDiv);

                    // a 
                    var a = document.createElement("a");
                    a.href = "../html/working.html?key=" + key;

                    // Title h5
                    var h5 = document.createElement("h5");
                    h5.textContent = data.Title;
                    a.appendChild(h5);
                    titleDiv.appendChild(a);

                    // Channel p
                    var p = document.createElement("p");
                    p.textContent = data.Channel;
                    titleDiv.appendChild(p);

                    // Lights div
                    var lightDiv = document.createElement("div");
                    lightDiv.classList.add("col");
                    lightDiv.classList.add("s12");
                    lightDiv.classList.add("m2");
                    lightDiv.classList.add("lights");
                    div.appendChild(lightDiv);

                    // Lights p
                    var pLight = document.createElement("p");
                    pLight.textContent = data.Lights + " Lights";
                    lightDiv.appendChild(pLight);

                    $('.bottom').append(div);

                }
            });
        }else{
            // Set image
            $('#navAccountPhoto').attr("src", localStorage.getItem("url"));
            $('#mobileNavAccountPhoto').attr("src", localStorage.getItem("url"));
            $(".photo").attr("src", localStorage.getItem("url"));

            // Set Name
            $('#name').text(localStorage.getItem("name"));
            $('#mobileNavAccountName').text(localStorage.getItem("name"));
            $('#bodyName').text(localStorage.getItem("name"));

            // Get Followers and Following
            var ref = firebase.database().ref("Users/" + uid + "/Info");
            ref.on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data.Followers);
                let following = data.Following.Users.length - 1;
                let followers = data.Followers.length - 1;

                $("#followingSpan").text(following);
                $("#followersSpan").text(followers);
            });

            // Get Bio
            var bioRef = firebase.database().ref("Users/" + uid + "/Info");
            bioRef.on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data.Bio);

                // Append to bio p
                $(".bio").text(data.Bio);
            });

            // Get Ideas
            var ref = firebase.database().ref("Users/" + uid + "/Ideas");
            ref.on("child_added", (snapshot) => {
                var data = snapshot.val();
                var key = snapshot.key;
                // console.log(data);

                // Create Div 
                var div = document.createElement("div");
                div.classList.add("row");
                div.classList.add("idea");

                // Title and Channel div
                var titleDiv = document.createElement("div");
                titleDiv.classList.add("col");
                titleDiv.classList.add("m10");
                titleDiv.classList.add("title");
                div.appendChild(titleDiv);

                // a 
                var a = document.createElement("a");
                a.href = "../html/working.html?key=" + key;

                // Title h5
                var h5 = document.createElement("h5");
                h5.textContent = data.Title;
                a.appendChild(h5);
                titleDiv.appendChild(a);

                // Description p
                var p = document.createElement("p");
                p.textContent = data.Description;
                titleDiv.appendChild(p);

                // Lights div
                var lightDiv = document.createElement("div");
                lightDiv.classList.add("col");
                lightDiv.classList.add("m2");
                lightDiv.classList.add("lights");
                div.appendChild(lightDiv);

                // Lights p
                var pLight = document.createElement("p");
                pLight.textContent = data.Lights + " Lights";
                lightDiv.appendChild(pLight);

                $('.bottom').append(div);
            });
        }

        // Set image
        $('#navAccountPhoto').attr("src", localStorage.getItem("url"));
        $('#mobileNavAccountPhoto').attr("src", localStorage.getItem("url"));

        // Set Name
        $('#name').text(localStorage.getItem("name"));
        $('#mobileNavAccountName').text(localStorage.getItem("name"));

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
        $('.sidenav').sidenav();
        $('#update').on("click", update);
        $('.modal-trigger').on("click", updateModal);
        $('.follow').on('click', follow);
        $('#idea').on('click', ideaModal);
        $('#createIdea').on('click', createIdea);
        $('#logout').on("click", logout);
    }

    function follow(){
        $(this).css("background-color", "#FFD43C");
        $(this).css("color", "#FFFFFF");

        firebase.database().ref("Users/" + uid + "/Info/Following/Users").on("value", (snapshot) => {
            var data = snapshot.val();
            data.push(id);
            // console.log(data);
        });

        firebase.database().ref("Users/" + id + "/Info/Following").child("Users").transaction((Users) => {
            console.log(Users);

            firebase.database().ref("Users/" + uid + "/Info").child("Followers").transaction((Followers) => {
                console.log(Followers);
            });
        });

        // firebase.database().ref("Users/" + uid + "/Info").child("Followers").transaction((Followers) => {
        //     console.log(Followers);
        // });
    }

    function update(){
        var fname = $("#fname").val();
        var lname = $("#lname").val();
        var email = $("#email").val();
        var pass = $("#pass").val();
        var bio = $("#bio").val();

        // Update first name
        firebase.database().ref("Users/" + uid + "/Info").child("FirstName").transaction((FirstName) => {
            if(fname.length > 0){
                FirstName = fname;
            }

            // Update last name
            firebase.database().ref("Users/" + uid + "/Info").child("LastName").transaction((LastName) => {
                if(lname.length > 0){
                    LastName = lname;
                }

                // Update email
                firebase.database().ref("Users/" + uid + "/Info").child("Email").transaction((Email) => {
                    if(email.length > 0){
                        Email = email;
                        firebase.auth().currentUser.updateEmail(email);
                    }

                    // Update bio and password
                    firebase.database().ref("Users/" + uid + "/Info").child("Bio").transaction((Bio) => {
                        if(bio.length > 0){
                            Bio = bio;
                        }

                        if(pass.length > 0){
                            firebase.auth().currentUser.updatePassword(pass);
                        }

                        return Bio;
                    });
                    
                    return Email;
                });

                return LastName;
            });

            return FirstName;
        });
    }

    function updateModal(){
        $('#updateModal').modal();
        $("#updateModal").modal("open");
    }

    function logout(){
        firebase.auth().signOut().then(() => {
            localStorage.removeItem("uid");
            location.replace("../html/landing.html");
        });
    }

    function ideaModal(){
        $('#ideaModal').modal();
        $('#ideaModal').modal('open');''
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
        var ref = firebase.database().ref("Users/" + uid + "/Ideas");
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
            $('#ideaModal').modal();
            $('#ideaModal').modal("close");
        });
    }
})();