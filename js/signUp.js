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
        $(".sidenav").sidenav();
        $('#submit').on('click', signUp);
    }

    // TODO: Run checks for if input fields are empty
    // TODO: Depending on poll, remove entering profile photo in beginning
    function signUp(){
        // Get user data
        var fname = $('#fname').val();
        var lname = $('#lname').val();
        // var username = $('#username').val();
        var email = $('#email').val();
        var pass = $('#pass').val();
        var bio = $('#bio').val();
        var profilePhotoTemp = $('#photo')[0];
        var profilePhoto = profilePhotoTemp.files[0];

        if(!profilePhoto){
            $('#photo').css('color', "red");
            return;
        }

        // Check length of password
        if(pass.length < 8){
            $('#pass').css('border-color', 'red');
            return;
        }

        firebase.auth().createUserWithEmailAndPassword(email, pass);
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                var uid = user.uid;
                var ref = firebase.database().ref("Users/" + uid + "/Info");
                ref.set({
                    FirstName:fname,
                    LastName:lname,
                    // Username:username,
                    Email:email,
                    Bio:bio,
                    Following: {
                        Ideas:{
                            0:"",
                        },

                        Users:{
                            0:"",
                        }
                    },
                    Followers: {
                        0:"",
                    },
                    Liked: {
                        0:"",
                    }
                }).then(function(){
                    // Get storage ref
                    var storageRef = firebase.storage().ref('Users/' + uid + "/info/profilePhoto");
                    storageRef.put(profilePhoto, {contentType:profilePhoto.type}).then(function(){
                        localStorage.removeItem("uid");
                        localStorage.setItem("uid", uid);
                        location.replace("../html/home.html");
                    });
                });
            }else{
                console.log("No user");
            }
        })
    }
})();