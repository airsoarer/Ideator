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

    // Get comment UID
    url = window.location.href;
    url = url.split("?key=");
    temp = url[1];
    temp = temp.split("?cc=");
    commentUID = temp[0];
    cc = temp[1];
    // console.log(commentUID, cc);

    // Get date
    var mm = new Date().getMonth();
    var dd = new Date().getDate();
    var yy = new Date().getFullYear();
    var date = mm + "/" + dd + "/" + yy;

    // User image url
    imageURL = undefined;
    username = undefined;

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
            username = data.FirstName + " " + data.LastName;
        });

        // Get existing comments from firebase
        var db = firebase.database().ref("Users/" + cc + "/Ideas/" + commentUID + "/Comments");
        db.on("child_added", (snapshot) => {
            var data = snapshot.val();
            console.log(data);
            
            // Make elements for comment
            // Container div
            var div = document.createElement("div");
            div.classList.add("col");
            div.classList.add("s12");
            div.classList.add("m10");
            div.classList.add("offset-m1");
            div.classList.add("comment");

            // Image Div
            var imgDiv = document.createElement("div");
            imgDiv.classList.add("col");
            imgDiv.classList.add("s4");
            imgDiv.classList.add("m2");
            imgDiv.classList.add("image");
            div.appendChild(imgDiv);

            // Image 
            var img = document.createElement("img");
            img.src = data.ProfilePhoto;
            imgDiv.appendChild(img);

            // Text Div
            var txtDiv = document.createElement("div");
            txtDiv.classList.add("col");
            txtDiv.classList.add("s8");
            txtDiv.classList.add("m9");
            txtDiv.classList.add("offset-m1");
            txtDiv.classList.add("txtDiv");
            div.appendChild(txtDiv);
    
            // Name
            var name = document.createElement("h4");
            name.textContent = data.Creator
            txtDiv.appendChild(name);

            // Date
            var date = document.createElement("h6");
            date.textContent = data.Date;
            txtDiv.appendChild(date);

            // Comment
            var comment = document.createElement("p");
            comment.textContent = data.Comment;
            txtDiv.appendChild(comment);

            $(".commentWindow").append(div);
        })



        // Event Triggers
        $(".dropdown-trigger").dropdown();
        $('.sidenav').sidenav();
        $('select').formSelect();
        // $('.modal-trigger').on('click', ideaModal);
        // $('#createIdea').on('click', createIdea);
        $('#post').on('click', makeComment);
        $('#logout').on("click", logout);
    }

    function logout(){
        firebase.auth().signOut().then(() => {
            localStorage.removeItem("uid");
            location.replace("../html/landing.html");
        });
    }

    function makeComment(){
        // Get Comment
        var comment = $("#comment").val();
        // $('.commentWindow').empty();

        // Create db reference
        var db = firebase.database().ref("Users/" + cc + "/Ideas/" + commentUID + "/Comments");
        db.push({
            Creator:username,
            ProfilePhoto:imageURL,
            Date:date,
            Comment:comment,
        });
    }
})();