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

    function init(){
        firebase.initializeApp(config);
        // Get all public ideas and append to respective div
        var publicRef = firebase.database().ref("Ideas");
        publicRef.on("child_added", (snapshot) => {
            var data = snapshot.val();

            // Container div
            var div = document.createElement("div");
            div.classList.add("col");
            div.classList.add("m12");
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

            // // Buttons div
            // var buttonsDiv = document.createElement("div");
            // buttonsDiv.classList.add("follow");
            // $(buttonsDiv).css("margin-left", "10px");
            // div.appendChild(buttonsDiv);

            // // Comment a
            // var commentA = document.createElement("a");
            // commentA.src = "#";
            // buttonsDiv.appendChild(commentA);

            // // Comment i
            // var commentI = document.createElement("i");
            // commentI.classList.add("material-icons");
            // commentI.classList.add("small");
            // commentI.textContent = "chat_bubble_outline";
            // commentA.appendChild(commentI);

            // // Follow btn
            // var followBtn = document.createElement("button");
            // followBtn.classList.add("followBtn");
            // followBtn.id = data.Creator;
            // followBtn.textContent = "Follow this Project"
            // buttonsDiv.appendChild(followBtn);

            $('.ideas').append(div);
        });

        // Get Catagories
        var cataRef = firebase.database().ref("Channels");
        cataRef.on("value", (snapshot) => {
            var data = snapshot.val();
            // console.log(data);

            for(var i = 0; i < data.length; i++){
                // Create Button
                var btn = document.createElement("button");
                btn.textContent = data[i];
                btn.classList.add("cata");

                // Append
                $('.catas').append(btn);
            }
        });
    }
})();