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
            // Set image
            $('#navAccountPhoto').attr("src", url);
        });

        // Get user name and put in respective div
        var nameRef = firebase.database().ref('Users/' + uid + "/Info");
        nameRef.on('value', (snapshot) => {
            var data = snapshot.val();
            
            $('#name').text(data.FirstName + " " + data.LastName);
        });

        // Get all public ideas and append to respective div
        var publicRef = firebase.database().ref("Ideas");
        publicRef.on("child_added", (snapshot) => {
            var data = snapshot.val();

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
                console.log(url);
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
            nameDiv.classList.add("s10");
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

        // Event Triggers
        $(".dropdown-trigger").dropdown();
        $('.sidenav').sidenav();
        $('.modal-trigger').on('click', ideaModal);
        $('#createIdea').on('click', createIdea);
        $('#logout').on("click", logout);
    }

    function logout(){
        firebase.auth().signOut();
        localStorage.removeItem("uid");
        location.replace("../html/landing.html");
    }

    function ideaModal(){
        $('#ideaModal').modal();
        $('#ideaModal').modal('open');
    }

    function createIdea(){
        // Get idea data
        var title = $('#title').val();
        var channel = $('#channel').val();
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