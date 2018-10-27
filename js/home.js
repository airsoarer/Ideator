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
    console.log(uid);

    // Get date
    var mm = new Date().getMonth();
    var dd = new Date().getDate();
    var yy = new Date().getFullYear();
    var date = mm + "/" + dd + "/" + yy;

    // User image url
    imageURL;

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

        // Get all public ideas and append to respective div
        var publicRef = firebase.database().ref("Ideas");
        publicRef.on("child_added", (snapshot) => {
            var data = snapshot.val();
            var key = snapshot.key;

            // Container div
            var div = document.createElement("div");
            div.classList.add("card");
            div.classList.add("topIdea");

            // Creator info div
            var creatorDiv = document.createElement("div");
            creatorDiv.classList.add("row");
            creatorDiv.classList.add("user");
            div.appendChild(creatorDiv);

            // Creator image div
            var imgDiv = document.createElement("div");
            imgDiv.classList.add("col");
            imgDiv.classList.add("s2");
            imgDiv.classList.add("m1");
            imgDiv.classList.add("imgDiv");
            creatorDiv.appendChild(imgDiv);

            var storage = firebase.storage().ref("Users/" + data.Creator + "/info/profilePhoto");
            storage.getDownloadURL().then((url) => {
                // console.log(url);
                // Creator image
                var img = document.createElement("img");
                img.classList.add("circle");
                img.classList.add("left-align");
                img.src = url;
                imgDiv.appendChild(img);
            });

            // Creator name div
            var nameDiv = document.createElement("div");
            nameDiv.classList.add("col");
            nameDiv.classList.add("s8");
            nameDiv.classList.add("m9");
            $(nameDiv).css('margin-left', '8px');
            creatorDiv.appendChild(nameDiv);

            // Creator name h5
            var nameH5 = document.createElement("h5");
            nameH5.classList.add("col");
            nameH5.classList.add("m10");
            nameH5.classList.add("truncate");
            nameDiv.appendChild(nameH5);

            var db = firebase.database().ref("Users/" + data.Creator + "/Info");
            db.on("value", (snapshot) => {
                var dataTwo = snapshot.val();
                // console.log(dataTwo);
                // console.log(dataTwo);

                // Creator name
                var name = document.createElement("a");
                name.src = "#";
                name.textContent = dataTwo.FirstName + " " + dataTwo.LastName;
                nameH5.appendChild(name);
            });
            
            // Data creation div
            var creationDiv = document.createElement("div");
            creationDiv.classList.add("date");
            div.appendChild(creationDiv);

            // Date
            var date = document.createElement("p");
            date.classList.add("col");
            date.classList.add("m12");
            date.textContent = "Idea Created: " + data.CreationDate;
            creationDiv.appendChild(date);

            // Title div
            var titleDiv = document.createElement("div");
            titleDiv.classList.add("title");
            div.appendChild(titleDiv);

            // Title h5
            var titleH5 = document.createElement("h5");
            titleH5.classList.add("col");
            titleH5.classList.add("s12");
            titleH5.classList.add("m12");
            titleH5.classList.add("truncate");
            titleDiv.appendChild(titleH5);

            // Title
            var title = document.createElement("a");
            title.src = "#";
            title.id = "ideaCardTitle"
            title.textContent = data.Title;
            titleH5.appendChild(title);

            // Channel h6
            var channelH6 = document.createElement("h6");
            channelH6.classList.add("col");
            channelH6.classList.add("s12");
            titleDiv.appendChild(channelH6);

            // Channel
            var channel = document.createElement("a");
            channel.src = "#";
            channel.textContent = data.Channel;
            channelH6.appendChild(channel);

            // Description div
            var descriptionDiv = document.createElement("div");
            descriptionDiv.classList.add("idea-content");
            $(descriptionDiv).css("margin-left", "10px");
            div.appendChild(descriptionDiv);

            // Description
            var description = document.createElement("p");
            description.textContent = data.Description;
            descriptionDiv.appendChild(description);

            // Buttons div
            var buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("follow");
            $(buttonsDiv).css("margin-left", "10px");
            div.appendChild(buttonsDiv);

            // light bulb
            var lightbulbButton = document.createElement("button");
            lightbulbButton.classList.add("like");
            lightbulbButton.id = key;
            buttonsDiv.appendChild(lightbulbButton);

            // img
            var bulb = document.createElement("img");
            bulb.src = "../photos/lightbulb_off.png";
            bulb.classList.add("bulb");
            lightbulbButton.appendChild(bulb);

            // Check if user liked this idea and make like on and disabled
            var dbCheck = firebase.database().ref("Users/" + uid + "/Info/Liked");
            dbCheck.on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data);

                if(data != null){
                    for(var i = 0; i < data.length; i++){
                        // console.log(data[i]);
                        if(key === data[i]){
                            // console.log(key, data[i])
                            $(lightbulbButton).attr('disabled', true);
                            bulb.src = "../photos/lightbulb_on.png";
                        }
                    }
                }
            });

            // Comment a
            var commentA = document.createElement("a");
            commentA.href = "../html/comment.html?key=" + key;
            commentA.classList.add("commentA");
            buttonsDiv.appendChild(commentA);

            // Comment i
            var commentI = document.createElement("i");
            commentI.classList.add("material-icons");
            commentI.classList.add("small");
            commentI.textContent = "chat_bubble_outline";
            commentA.appendChild(commentI);

            // Follow btn
            var followBtn = document.createElement("button");
            followBtn.classList.add("followBtn");
            followBtn.id = key;
            followBtn.textContent = "Follow this Project"
            buttonsDiv.appendChild(followBtn);

            firebase.database().ref("Users/" + uid + "/Info/Following/Ideas").on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data);
                if(data != null){
                    for(var i = 0; i < data.length; i++){
                        // console.log(key, data[i]);
                        if(key === data[i]){
                            $(followBtn).css("background-color", "#FFD43C");
                            $(followBtn).css("color", "#ffffff");
                        }
                    }
                }
            });

            $('.topIdeas').append(div);
        });

        // Get user ideas and append to user ideas
        var ref = firebase.database().ref('Users/' + uid + "/Ideas");
        ref.on('child_added', function(snapshot){
            var data = snapshot.val();

            if(!data){
                $('#noIdea').css('display', 'block');
            }

            // Container div
            var div = document.createElement("div");
            div.classList.add("col");
            div.classList.add("m12");
            div.classList.add("idea");

            // Title
            var h5 = document.createElement("h5");
            
            // Title link
            var a = document.createElement("a");
            a.textContent = data.Title;
            $(a).attr("href", "#");

            // Append a to h5
            h5.appendChild(a);

            // Description
            var p = document.createElement("p");
            p.textContent = data.Description;

            // Status div
            var statusDiv = document.createElement("div");
            statusDiv.classList.add("status");

            // Status
            var statusP = document.createElement("p");
            statusP.textContent = "Status: " +  data.Status;

            // Append to status div
            statusDiv.appendChild(statusP);

            // Append to container div
            div.appendChild(h5);
            div.appendChild(p);
            div.appendChild(statusDiv);

            // Get rid of h4
            $('#noIdea').css('display', 'none');

            // Append to hard coded HTML
            $('.publicIdeas').append(div);
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
        $(document.body).on("click", ".followBtn", follow);
        $(document.body).on("click", ".stickyChannelBtn", getData);
        $(document.body).on("click", ".channelBtn", changeChannel);
        $(document.body).on("click", ".like", like); 
    }

    function follow(){
        var id = $(this).attr("id");
        $(this).prop("disabled", true);
        $(this).css('background-color', '#FFD43C');
        $(this).css("color", "#ffffff");
        
        firebase.database().ref("Users/" + uid + "/Info/Following").child("Ideas").transaction((Ideas) => {
            Ideas.push(id);
            return Ideas;
        });
    }

    function like(){
        var id = $(this).attr("id");
        $(this).prop("disabled", true);
        $(this).children('.bulb').attr("src", "../photos/lightbulb_on.png");

        var ref2 = firebase.database().ref('Ideas/' + id).child('Lights');
        ref2.transaction((Lights) => {
            if(!Lights){
                Lights = Lights + 1;
            }

            var db = firebase.database().ref('Users/' + uid + '/Info').child('Liked');
            db.transaction((Likes) => {
                // console.log(Likes);
                Likes.push(id);
                return Likes;
            });

            return Lights;
        });
    }

    function getData(){
        console.log("working");
        $('.topIdeas').empty();

        // Get all public ideas and append to respective div
        var publicRef = firebase.database().ref("Ideas");
        publicRef.on("child_added", (snapshot) => {
            var data = snapshot.val();
            var key = snapshot.key;

            // Container div
            var div = document.createElement("div");
            div.classList.add("card");
            div.classList.add("topIdea");

            // Creator info div
            var creatorDiv = document.createElement("div");
            creatorDiv.classList.add("row");
            creatorDiv.classList.add("user");
            div.appendChild(creatorDiv);

            // Creator image div
            var imgDiv = document.createElement("div");
            imgDiv.classList.add("col");
            imgDiv.classList.add("s2");
            imgDiv.classList.add("m1");
            imgDiv.classList.add("imgDiv");
            creatorDiv.appendChild(imgDiv);

            var storage = firebase.storage().ref("Users/" + data.Creator + "/info/profilePhoto");
            storage.getDownloadURL().then((url) => {
                // console.log(url);
                // Creator image
                var img = document.createElement("img");
                img.classList.add("circle");
                img.classList.add("left-align");
                img.src = url;
                imgDiv.appendChild(img);
            });

            // Creator name div
            var nameDiv = document.createElement("div");
            nameDiv.classList.add("col");
            nameDiv.classList.add("s8");
            nameDiv.classList.add("m9");
            $(nameDiv).css('margin-left', '8px');
            creatorDiv.appendChild(nameDiv);

            // Creator name h5
            var nameH5 = document.createElement("h5");
            nameH5.classList.add("col");
            nameH5.classList.add("m10");
            nameH5.classList.add("truncate");
            nameDiv.appendChild(nameH5);

            var db = firebase.database().ref("Users/" + data.Creator + "/Info");
            db.on("value", (snapshot) => {
                var dataTwo = snapshot.val();
                // console.log(dataTwo);
                // console.log(dataTwo);

                // Creator name
                var name = document.createElement("a");
                name.src = "#";
                name.textContent = dataTwo.FirstName + " " + dataTwo.LastName;
                nameH5.appendChild(name);
            });
            
            // Data creation div
            var creationDiv = document.createElement("div");
            creationDiv.classList.add("date");
            div.appendChild(creationDiv);

            // Date
            var date = document.createElement("p");
            date.classList.add("col");
            date.classList.add("m12");
            date.textContent = "Idea Created: " + data.CreationDate;
            creationDiv.appendChild(date);

            // Title div
            var titleDiv = document.createElement("div");
            titleDiv.classList.add("title");
            div.appendChild(titleDiv);

            // Title h5
            var titleH5 = document.createElement("h5");
            titleH5.classList.add("col");
            titleH5.classList.add("s12");
            titleH5.classList.add("m12");
            titleH5.classList.add("truncate");
            titleDiv.appendChild(titleH5);

            // Title
            var title = document.createElement("a");
            title.src = "#";
            title.id = "ideaCardTitle"
            title.textContent = data.Title;
            titleH5.appendChild(title);

            // Channel h6
            var channelH6 = document.createElement("h6");
            channelH6.classList.add("col");
            channelH6.classList.add("s12");
            titleDiv.appendChild(channelH6);

            // Channel
            var channel = document.createElement("a");
            channel.src = "#";
            channel.textContent = data.Channel;
            channelH6.appendChild(channel);

            // Description div
            var descriptionDiv = document.createElement("div");
            descriptionDiv.classList.add("idea-content");
            $(descriptionDiv).css("margin-left", "10px");
            div.appendChild(descriptionDiv);

            // Description
            var description = document.createElement("p");
            description.textContent = data.Description;
            descriptionDiv.appendChild(description);

            // Buttons div
            var buttonsDiv = document.createElement("div");
            buttonsDiv.classList.add("follow");
            $(buttonsDiv).css("margin-left", "10px");
            div.appendChild(buttonsDiv);

            // light bulb
            var lightbulbButton = document.createElement("button");
            lightbulbButton.classList.add("like");
            lightbulbButton.id = key;
            buttonsDiv.appendChild(lightbulbButton);

            // img
            var bulb = document.createElement("img");
            bulb.src = "../photos/lightbulb_off.png";
            bulb.classList.add("bulb");
            lightbulbButton.appendChild(bulb);

            // Check if user liked this idea and make like on and disabled
            var dbCheck = firebase.database().ref("Users/" + uid + "/Info/Liked");
            dbCheck.on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data);

                for(var i = 0; i < data.length; i++){
                    // console.log(data[i]);
                    if(key === data[i]){
                        // console.log(key, data[i])
                        $(lightbulbButton).attr('disabled', true);
                        bulb.src = "../photos/lightbulb_on.png";
                    }
                }
            });

            // Comment a
            var commentA = document.createElement("a");
            commentA.src = "#";
            buttonsDiv.appendChild(commentA);

            // Comment i
            var commentI = document.createElement("i");
            commentI.classList.add("material-icons");
            commentI.classList.add("small");
            commentI.textContent = "chat_bubble_outline";
            commentA.appendChild(commentI);

            // Follow btn
            var followBtn = document.createElement("button");
            followBtn.classList.add("followBtn");
            followBtn.id = data.Creator;
            followBtn.textContent = "Follow this Project"
            buttonsDiv.appendChild(followBtn);

            firebase.database().ref("Users/" + uid + "/Info/Following/Ideas").on("value", (snapshot) => {
                var data = snapshot.val();
                // console.log(data);
                if(data != null){
                    for(var i = 0; i < data.length; i++){
                        // console.log(key, data[i]);
                        if(key === data[i]){
                            $(followBtn).css("background-color", "#FFD43C");
                            $(followBtn).css("color", "#ffffff");
                        }
                    }
                }
            });

            $('.topIdeas').append(div);
        });
    }

    function changeChannel(){
        // Get channel btn pressed
        var channelTemp = $(this).text();

        // Clear Ideas div
        $('.topIdeas').empty();  

        // Make ref to firebase
        var ref = firebase.database().ref("Ideas");
        ref.on("child_added", (snapshot) => {
            var data = snapshot.val();
            var key = snapshot.key;
            // console.log(data);   

            if(data.Channel === channelTemp){
                // console.log(channelTemp, data.Channel);

                // Container div
                var div = document.createElement("div");
                div.classList.add("card");
                div.classList.add("topIdea");

                // Creator info div
                var creatorDiv = document.createElement("div");
                creatorDiv.classList.add("row");
                creatorDiv.classList.add("user");
                div.appendChild(creatorDiv);

                // Creator image div
                var imgDiv = document.createElement("div");
                imgDiv.classList.add("col");
                imgDiv.classList.add("s2");
                imgDiv.classList.add("m1");
                imgDiv.classList.add("imgDiv");
                creatorDiv.appendChild(imgDiv);

                var storage = firebase.storage().ref("Users/" + data.Creator + "/info/profilePhoto");
                storage.getDownloadURL().then((url) => {
                    // console.log(url);
                    // Creator image
                    var img = document.createElement("img");
                    img.classList.add("circle");
                    img.classList.add("left-align");
                    img.src = url;
                    imgDiv.appendChild(img);
                });

                // Creator name div
                var nameDiv = document.createElement("div");
                nameDiv.classList.add("col");
                nameDiv.classList.add("s8");
                nameDiv.classList.add("m9");
                $(nameDiv).css('margin-left', '8px');
                creatorDiv.appendChild(nameDiv);

                // Creator name h5
                var nameH5 = document.createElement("h5");
                nameH5.classList.add("col");
                nameH5.classList.add("m10");
                nameH5.classList.add("truncate");
                nameDiv.appendChild(nameH5);

                var db = firebase.database().ref("Users/" + data.Creator + "/Info");
                db.on("value", (snapshot) => {
                    var dataTwo = snapshot.val();
                    // console.log(dataTwo);
                    // console.log(dataTwo);

                    // Creator name
                    var name = document.createElement("a");
                    name.src = "#";
                    name.textContent = dataTwo.FirstName + " " + dataTwo.LastName;
                    nameH5.appendChild(name);
                });
                
                // Data creation div
                var creationDiv = document.createElement("div");
                creationDiv.classList.add("date");
                div.appendChild(creationDiv);

                // Date
                var date = document.createElement("p");
                date.classList.add("col");
                date.classList.add("m12");
                date.textContent = "Idea Created: " + data.CreationDate;
                creationDiv.appendChild(date);

                // Title div
                var titleDiv = document.createElement("div");
                titleDiv.classList.add("title");
                div.appendChild(titleDiv);

                // Title h5
                var titleH5 = document.createElement("h5");
                titleH5.classList.add("col");
                titleH5.classList.add("s12");
                titleH5.classList.add("m12");
                titleH5.classList.add("truncate");
                titleDiv.appendChild(titleH5);

                // Title
                var title = document.createElement("a");
                title.src = "#";
                title.id = "ideaCardTitle"
                title.textContent = data.Title;
                titleH5.appendChild(title);

                // Channel h6
                var channelH6 = document.createElement("h6");
                channelH6.classList.add("col");
                channelH6.classList.add("s12");
                titleDiv.appendChild(channelH6);

                // Channel
                var channel = document.createElement("a");
                channel.src = "#";
                channel.textContent = data.Channel;
                channelH6.appendChild(channel);

                // Description div
                var descriptionDiv = document.createElement("div");
                descriptionDiv.classList.add("idea-content");
                $(descriptionDiv).css("margin-left", "10px");
                div.appendChild(descriptionDiv);

                // Description
                var description = document.createElement("p");
                description.textContent = data.Description;
                descriptionDiv.appendChild(description);

                // Buttons div
                var buttonsDiv = document.createElement("div");
                buttonsDiv.classList.add("follow");
                $(buttonsDiv).css("margin-left", "10px");
                div.appendChild(buttonsDiv);

                // light bulb
                var lightbulbButton = document.createElement("button");
                lightbulbButton.classList.add("like");
                lightbulbButton.id = key;
                buttonsDiv.appendChild(lightbulbButton);

                // img
                var bulb = document.createElement("img");
                bulb.src = "../photos/lightbulb_off.png";
                bulb.classList.add("bulb");
                lightbulbButton.appendChild(bulb);

                // Check if user liked this idea and make like on and disabled
                var dbCheck = firebase.database().ref("Users/" + uid + "/Info/Liked");
                dbCheck.on("value", (snapshot) => {
                    var data = snapshot.val();
                    // console.log(data);

                    for(var i = 0; i < data.length; i++){
                        // console.log(data[i]);
                        if(key === data[i]){
                            // console.log(key, data[i])
                            $(lightbulbButton).attr('disabled', true);
                            bulb.src = "../photos/lightbulb_on.png";
                        }
                    }
                });

                // Comment a
                var commentA = document.createElement("a");
                commentA.src = "#";
                buttonsDiv.appendChild(commentA);

                // Comment i
                var commentI = document.createElement("i");
                commentI.classList.add("material-icons");
                commentI.classList.add("small");
                commentI.textContent = "chat_bubble_outline";
                commentA.appendChild(commentI);

                // Follow btn
                var followBtn = document.createElement("button");
                followBtn.classList.add("followBtn");
                followBtn.id = data.Creator;
                followBtn.textContent = "Follow this Project"
                buttonsDiv.appendChild(followBtn);

                firebase.database().ref("Users/" + uid + "/Info/Following/Ideas").on("value", (snapshot) => {
                    var data = snapshot.val();
                    // console.log(data);
                    if(data != null){
                        for(var i = 0; i < data.length; i++){
                            // console.log(key, data[i]);
                            if(key === data[i]){
                                $(followBtn).css("background-color", "#FFD43C");
                                $(followBtn).css("color", "#ffffff");
                            }
                        }
                    }
                });

                $('.topIdeas').append(div);
            }
        });
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
        var publicRef = firebase.database().ref("Ideas");

        // Check if public idea
        if(status === "public"){
            publicRef.push({
                Title:title,
                Channel:channel,
                Description:description,
                CreationDate:date,
                Creator:uid,
                Lights:0,
            }).then(function(){
                ref.push({
                    Title:title,
                    Channel:channel,
                    Status:status,
                    Description:description,
                    CreationDate:date,
                }).then(function(){
                    $('#ideaModal').modal();
                    $('#ideaModal').modal("close");
                });                
            });
        }else{
            ref.push({
                Title:title,
                Channel:channel,
                Status:status,
                Description:description,
                CreationDate:date,
            }).then(function(){
                $('#ideaModal').modal();
                $('#ideaModal').modal("close");
            });
        }
    }
})();