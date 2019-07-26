particlesJS.load('home', 'particles.json');

$(document).ready(function () {

    // Navbar burger
    $("#burger").on("click", function () {
        $("#navbar ul").toggleClass("open");
        $("#burger").toggleClass("open");
    });

    // ======================================
    // PROJECTS
    // ======================================

    // Open and Close projects
    $(".project a").on("click", function () {
        $(this).parent().next().addClass("open");
    });

    $(".close").on("click", function () {
        $(".popup").removeClass("open");
    });

    // Project Selectors
    $(".project_selector").on("click", function () {
        var lang = $(this).attr("id");

        $(".project_selector").removeClass("selected");
        $(this).addClass("selected");

        if (lang === "all") {
            $(".project").addClass("open");
        } else {
            $(".project").removeClass("open");
            $(".project." + lang).addClass("open");
        }
    });

    // ====================================
    // NAVBAR 
    // ====================================

    var move = function () {

        var ctop = $(window).scrollTop();
        var nheight = $("nav").outerHeight();
        var hbottom = $("header").outerHeight();

        // Navbar Top Scroll
        if (ctop > hbottom) {
            $("#navbar").addClass("fixed");
        } else {
            $("#navbar").removeClass("fixed");
        }

        // Navbar Section Highlight
        $("section").each(function () {
            var top = $(this).offset().top - nheight;

            if (ctop < hbottom) {
                $("nav").find("a").removeClass("active");
                $('a[href="#home"]').addClass("active");
            } else if (ctop >= top) {
                $("nav").find("a").removeClass("active");
                $("nav").find('a[href="#' + $(this).attr("id") + '"]').addClass("active");
            }
        });

    };
    $(window).on("scroll", move);
    move();


    // ===============================
    // CONTACT FORM
    // ===============================

    var config = {
        apiKey: "AIzaSyDz758EA2bAfRR_Zvj3pvk4YfHp3O_7P7s",
        authDomain: "michaelpwebsite.firebaseapp.com",
        databaseURL: "https://michaelpwebsite.firebaseio.com",
        projectId: "michaelpwebsite",
        storageBucket: "michaelpwebsite.appspot.com",
        messagingSenderId: "617913223209",
        appId: "1:617913223209:web:a721304539c649bf"
    };

    firebase.initializeApp(config);

    // Reference messages collection
    var database = firebase.database();
    var messagesRef = database.ref("messages");

    // Listen to form submit
    document.getElementById("contact_form").addEventListener("submit", submitForm);

    // Submit form
    function submitForm(e) {
        e.preventDefault();

        // Get values
        var name = getInputVal("fname");
        var email = getInputVal("femail");
        var message = getInputVal("fmessage");

        // Save message
        saveMessage(name, email, message);

        // Show alert
        document.querySelector(".alert").style.display = "block";

        setTimeout(function () {
            document.querySelector(".alert").style.display = "none";
        }, 4000);

        // Clear form
        document.getElementById("contact_form").reset();
    }

    function getInputVal(id) {
        return document.getElementById(id).value;
    }

    // Save message to firebase
    function saveMessage(name, email, message) {
        var newMessageRef = messagesRef.push();
        newMessageRef.set({
            name: name,
            email: email,
            message: message
        });
    }

});


