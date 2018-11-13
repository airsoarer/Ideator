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
    // console.log(uid);

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
        });

        // Get user name and put in respective div
        var nameRef = firebase.database().ref('Users/' + uid + "/Info");
        nameRef.on('value', (snapshot) => {
            var data = snapshot.val();
            localStorage.setItem("name", data.FirstName + " " + data.LastName);
            
            $('#name').text(data.FirstName + " " + data.LastName);
            $('#mobileNavAccountName').text(data.FirstName + " " + data.LastName);
        });

        // Pull ideas
        var ref = firebase.database().ref("Users/" + uid + "/WorkingSpaceKeys");
        ref.on("child_added", (snapshot) => {
            var data = snapshot.val();
            // var key = snapshot.key;
            // console.log(data);

            firebase.database().ref("WorkingSpace/" + data.Key).on("value", (snapshot) => {
                var dataTwo = snapshot.val();
                var key = snapshot.key;

                // Make containing div
                var div = document.createElement("div");
                div.classList.add("col");
                div.classList.add("m10");
                div.classList.add("offset-m1");
                div.classList.add("idea")

                // Make title and description div
                var titleDiv = document.createElement("div");
                titleDiv.classList.add("col");
                titleDiv.classList.add("m10");
                div.appendChild(titleDiv);

                // a
                var a = document.createElement("a");
                a.href = "../html/working.html?key=" + key;
                titleDiv.appendChild(a);

                // h5
                var h5 = document.createElement("h5");
                h5.textContent = dataTwo.Title;
                a.appendChild(h5);

                // Make description
                var description = document.createElement("p");
                description.textContent = dataTwo.Description;
                titleDiv.appendChild(description);

                // Make Lights div
                var lightsDiv = document.createElement("div");
                lightsDiv.classList.add("col");
                lightsDiv.classList.add("m2");
                div.appendChild(lightsDiv);

                // Make light h5
                var lights = document.createElement("h5");
                if(dataTwo.Lights === 1){
                    lights.textContent = dataTwo.Lights + " Light"
                }else{
                    lights.textContent = dataTwo.Lights + " Lights";
                }

                lightsDiv.appendChild(lights);

                $(".ideas").append(div);
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
        $('.modal-trigger').on('click', ideaModal);
        $('#createIdea').on('click', createIdea);
        $('#logout').on("click", logout);
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
        var ref = firebase.database().ref("Users/" + uid + "/Ideas");
        // var publicRef = firebase.database().ref("Ideas");

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