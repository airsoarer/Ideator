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

    // User image url
    imageURL;

    function init(){
        firebase.initializeApp(config);
        // Set image
        $('#navAccountPhoto').attr("src", localStorage.getItem("url"));
        $('#mobileNavAccountPhoto').attr("src", localStorage.getItem("url"));
        $(".photo").attr("src", localStorage.getItem("url"));

        // Set Name
        $('#name').text(localStorage.getItem("name"));
        $('#mobileNavAccountName').text(localStorage.getItem("name"));
        $('#bodyName').text(localStorage.getItem("name"));

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
        $('.modal-trigger').on('click', ideaModal);
        $('#createIdea').on('click', createIdea);
        $('#logout').on("click", logout);
    }

    function logout(){
        firebase.auth().signOut().then(() => {
            localStorage.removeItem("uid");
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