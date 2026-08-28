/* =====================================================
   MOBILE MENU
===================================================== */

const menuButton =
    document.getElementById("menuButton");

const navigation =
    document.getElementById("navigation");


menuButton.addEventListener("click", () => {

    navigation.classList.toggle("open");

});


/* =====================================================
   CLOSE MOBILE MENU AFTER CLICK
===================================================== */

const navigationLinks =
    document.querySelectorAll(
        "#navigation a"
    );


navigationLinks.forEach(link => {

    link.addEventListener("click", () => {

        navigation.classList.remove("open");

    });

});


/* =====================================================
   CURRENT YEAR
===================================================== */

document.getElementById("year").textContent =
    new Date().getFullYear();


/* =====================================================
   SCROLL ANIMATIONS
===================================================== */

const observer =
    new IntersectionObserver(

        entries => {

            entries.forEach(entry => {

                if (!entry.isIntersecting) {
                    return;
                }


                entry.target.animate(

                    [
                        {
                            opacity: 0,
                            transform:
                                "translateY(25px)"
                        },

                        {
                            opacity: 1,
                            transform:
                                "translateY(0)"
                        }
                    ],

                    {
                        duration: 650,
                        easing:
                            "cubic-bezier(.2,.8,.2,1)",
                        fill: "forwards"
                    }

                );


                observer.unobserve(
                    entry.target
                );

            });

        },

        {
            threshold: 0.08
        }

    );


/* =====================================================
   ELEMENTS TO ANIMATE
===================================================== */

document
    .querySelectorAll(
        ".project, .facts, .skill, .contact-box"
    )
    .forEach(element => {

        element.style.opacity = "0";

        observer.observe(element);

    });
