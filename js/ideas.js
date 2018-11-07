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
        var publicRef = firebase.database().ref("Users");
        publicRef.on("child_added", (snapshot) => {
            var data = snapshot.val();
            var imgUid = snapshot.key;

            for(var i in data.Ideas){
                var key = Object.keys(data.Ideas)[0];
                // console.log(Object.keys(data.Ideas)[0])
                if(data.Ideas[i].Status === "public"){
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

                    var storage = firebase.storage().ref("Users/" + data.Ideas[i].Creator + "/info/profilePhoto");
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

                    // Creator name
                    var name = document.createElement("a");
                    name.href = "../html/account.html?type=d?uid=" + data;
                    name.textContent = data.Info.FirstName + " " + data.Info.LastName;
                    nameH5.appendChild(name);
                    
                    // Data creation div
                    var creationDiv = document.createElement("div");
                    creationDiv.classList.add("date");
                    div.appendChild(creationDiv);

                    // Date
                    var date = document.createElement("p");
                    date.classList.add("col");
                    date.classList.add("m12");
                    date.textContent = "Idea Created: " + data.Ideas[i].CreationDate;
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
                    var channel = document.createElement("p");
                    // channel.src = "#";
                    channel.textContent = data.Ideas[i].Channel;
                    channelH6.appendChild(channel);

                    // Description div
                    var descriptionDiv = document.createElement("div");
                    descriptionDiv.classList.add("idea-content");
                    $(descriptionDiv).css("margin-left", "10px");
                    div.appendChild(descriptionDiv);

                    // Description
                    var description = document.createElement("p");
                    description.textContent = data.Ideas[i].Description;
                    descriptionDiv.appendChild(description);

                    $('.ideas').append(div);
                }
            }
        });

        // Get Catagories
        var cataRef = firebase.database().ref("Channels");
        cataRef.on("value", (snapshot) => {
            var data = snapshot.val();
            // console.log(data);

            for(var i = 0; i < data.length; i++){
                // Create surrounding li
                var li = document.createElement("li");
                li.classList.add("s12");

                // Create Button
                var btn = document.createElement("button");
                btn.textContent = data[i];
                btn.classList.add("cata");
                li.appendChild(btn);
                // console.log(li);

                // Append
                $('.catas').append(btn);
            }
        });

        $(".sidenav").sidenav();
        $('.modal').modal();
        $('.stickyChannelBtn').on('click', allChannels);
        $(document.body).on('click', '.cata', changeChannel);
    }

    function allChannels(){
        $('.ideas').empty();

        // Get all public ideas and append to respective div
        var publicRef = firebase.database().ref("Users");
        publicRef.on("child_added", (snapshot) => {
            var data = snapshot.val();
            var imgUid = snapshot.key;

            for(var i in data.Ideas){
                var key = Object.keys(data.Ideas)[0];
                // console.log(Object.keys(data.Ideas)[0])
                if(data.Ideas[i].Status === "public"){
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

                    var storage = firebase.storage().ref("Users/" + data.Ideas[i].Creator + "/info/profilePhoto");
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

                    // Creator name
                    var name = document.createElement("a");
                    name.href = "../html/account.html?type=d?uid=" + data;
                    name.textContent = data.Info.FirstName + " " + data.Info.LastName;
                    nameH5.appendChild(name);
                    
                    // Data creation div
                    var creationDiv = document.createElement("div");
                    creationDiv.classList.add("date");
                    div.appendChild(creationDiv);

                    // Date
                    var date = document.createElement("p");
                    date.classList.add("col");
                    date.classList.add("m12");
                    date.textContent = "Idea Created: " + data.Ideas[i].CreationDate;
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
                    var channel = document.createElement("p");
                    // channel.src = "#";
                    channel.textContent = data.Ideas[i].Channel;
                    channelH6.appendChild(channel);

                    // Description div
                    var descriptionDiv = document.createElement("div");
                    descriptionDiv.classList.add("idea-content");
                    $(descriptionDiv).css("margin-left", "10px");
                    div.appendChild(descriptionDiv);

                    // Description
                    var description = document.createElement("p");
                    description.textContent = data.Ideas[i].Description;
                    descriptionDiv.appendChild(description);

                    $('.ideas').append(div);
                }
            }
        });
    }

    function changeChannel(){
        console.log("working");
        // Get channel btn pressed
        var channelTemp = $(this).text();

        // Clear Ideas div
        $('.ideas').empty();  

        var publicRef = firebase.database().ref("Users");
        publicRef.on("child_added", (snapshot) => {
            var data = snapshot.val();
            var imgUid = snapshot.key;

            for(var i in data.Ideas){
                var key = Object.keys(data.Ideas)[0];
                // console.log(Object.keys(data.Ideas)[0])
                if(data.Ideas[i].Status === "public"){
                    if(data.Ideas[i].Channel === channelTemp){
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

                        var storage = firebase.storage().ref("Users/" + data.Ideas[i].Creator + "/info/profilePhoto");
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

                        // Creator name
                        var name = document.createElement("a");
                        name.href = "../html/account.html?type=d?uid=" + data;
                        name.textContent = data.Info.FirstName + " " + data.Info.LastName;
                        nameH5.appendChild(name);
                        
                        // Data creation div
                        var creationDiv = document.createElement("div");
                        creationDiv.classList.add("date");
                        div.appendChild(creationDiv);

                        // Date
                        var date = document.createElement("p");
                        date.classList.add("col");
                        date.classList.add("m12");
                        date.textContent = "Idea Created: " + data.Ideas[i].CreationDate;
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
                        var channel = document.createElement("p");
                        // channel.src = "#";
                        channel.textContent = data.Ideas[i].Channel;
                        channelH6.appendChild(channel);

                        // Description div
                        var descriptionDiv = document.createElement("div");
                        descriptionDiv.classList.add("idea-content");
                        $(descriptionDiv).css("margin-left", "10px");
                        div.appendChild(descriptionDiv);

                        // Description
                        var description = document.createElement("p");
                        description.textContent = data.Ideas[i].Description;
                        descriptionDiv.appendChild(description);

                        $('.ideas').append(div);
                    }
                }
            }
        });
    }
})();