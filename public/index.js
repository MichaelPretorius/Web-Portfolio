// Particles load for homepage
particlesJS.load('home', 'particles.json');

// =============================
// RECAPTCHA CALLBACK functions
// =============================

var button = document.getElementById("button");

function recaptcha_callback(captcha) {

    fetch("https://us-central1-michaelpwebsite.cloudfunctions.net/checkRecaptcha", {
        method: "POST",
        headers: {
            "Accept": "application/json, text/plain, */*",
            "Content-type": "application/json"
        },
        body: JSON.stringify({ captcha: captcha })
    }).then((res) => res.json()).then((data) => {
        if (data.success) {
            button.removeAttribute("disabled");
            button.style.cursor = "pointer";
        } else {
            console.log(data.msg + " Please try again!");
        }
    });

}

function recaptcha_expire() {
    button.setAttribute("disabled", true);
    button.style.cursor = "not-allowed";
    console.log("Captcha Expired! Please do it again.");
}

function recaptcha_error() {
    console.log("An error occured with Captcha! Please try again.");
}


$(document).ready(function () {

    // ======================================
    // PROJECTS
    // ======================================

    // Open and Close projects
    $(".project a").on("click", function () {
        $(this).parent().next().addClass("open");

        //Show next&prev buttons if more than 1 pic
        var nextImg = $(this).parent().next().find("img").next("img");
        if (nextImg.length) {
            $(this).parent().next().find(".prev").addClass("open");
            $(this).parent().next().find(".next").addClass("open");
        }
    });

    $(".close").on("click", function () {
        $(".popup").removeClass("open");
    });


    //Project Popup Images Slider
    $(".next").on("click", function () {
        var currentImg = $(this).parent().find(".active");
        var nextImg = currentImg.next();

        if (nextImg.length) {
            currentImg.removeClass("active");
            nextImg.addClass("active");
        } else {
            currentImg.removeClass("active");
            $(".slider_inner img:first-child").addClass("active");
        }
    });

    $(".prev").on("click", function () {
        var currentImg = $(this).parent().find(".active");
        var prevImg = currentImg.prev();

        if (prevImg.length) {
            currentImg.removeClass("active");
            prevImg.addClass("active");
        } else {
            currentImg.removeClass("active");
            $(".slider_inner img:last-child").addClass("active");
        }
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

    // Navbar burger
    $("#burger").on("click", function () {
        $("#navbar ul").toggleClass("open");
        $("#burger").toggleClass("open");
    });

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


