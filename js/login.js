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
        $('#submit').on('click', login);
    }

    function login(){
        // Get email and password
        var email = $('#email').val();
        var pass = $("#pass").val();

        // login
        var auth = firebase.auth().signInWithEmailAndPassword(email, pass);
        auth.catch((err) => {
            var errCode = err.code;
            if(errCode === 'auth/wrong-password'){
                $('#pass').css('border-color', 'red');
                return;
            }

            if(errCode === 'auth/invalid-email'){
                $('#email').css('border-color', 'red');
                return;
            }
        })

        // On auth state change 
        firebase.auth().onAuthStateChanged(user => {
            if(user){
                // Set uid
                var uid = user.uid;
                localStorage.setItem("uid", uid);

                // Change to homepage
                location.replace("../html/home.html");
            }else{
                console.log("no user");
            }
        });
    }
})();