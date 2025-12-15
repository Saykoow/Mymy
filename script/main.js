// --- CONFIGURATION DE LA DATE ---
const targetYear = 2025; 
const targetDateStr = `Dec 18, ${targetYear} 00:00:00`;

// Fonction principale qui lance ton animation d'anniversaire
const startParty = () => {
    // On cache le compte à rebours
    const countdownContainer = document.getElementById('countdown-container');
    if(countdownContainer) {
        countdownContainer.style.opacity = '0';
        setTimeout(() => {
            countdownContainer.style.display = 'none';
        }, 1000);
    }

    Swal.fire({
        title: 'Do you want to play music in the background?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes',
        cancelButtonText: 'No',
    }).then((result) => {
        if (result.isConfirmed) {
            document.querySelector('.song').play();
            animationTimeline();
        } else {
            animationTimeline();
        }
    });
};

// Logique du Compte à rebours
const checkTime = () => {
    const countDownDate = new Date(targetDateStr).getTime();
    
    const x = setInterval(function() {
        const now = new Date().getTime();
        const distance = countDownDate - now;

        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Vérification que les éléments existent avant de les modifier (évite les erreurs)
        if(document.getElementById("days")) {
            document.getElementById("days").innerText = days < 10 ? "0" + days : days;
            document.getElementById("hours").innerText = hours < 10 ? "0" + hours : hours;
            document.getElementById("minutes").innerText = minutes < 10 ? "0" + minutes : minutes;
            document.getElementById("seconds").innerText = seconds < 10 ? "0" + seconds : seconds;
        }

        if (distance < 0) {
            clearInterval(x);
            startParty();
        }
    }, 1000);
};

window.addEventListener('load', () => {
    const now = new Date().getTime();
    const target = new Date(targetDateStr).getTime();

    if (now > target) {
        const container = document.getElementById('countdown-container');
        if(container) container.style.display = 'none';
        startParty();
    } else {
        checkTime();
    }
});


// --- ANIMATION TIMELINE (SANS LA PARTIE TCHAT) ---
const animationTimeline = () => {

    const containerEight = document.querySelector(".eight");
    const colors = ["particle-pink", "particle-gold", "particle-blue", "particle-red", "particle-purple"];
    
    if(containerEight) {
        containerEight.innerHTML = "";
        for (let i = 0; i < 10; i++) {
            const div = document.createElement("div");
            div.classList.add("magic-particle");
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            div.classList.add(randomColor);
            const randomLeft = Math.floor(Math.random() * 90) + 5;
            const randomTop = Math.floor(Math.random() * 90) + 5;
            div.style.left = `${randomLeft}vw`;
            div.style.top = `${randomTop}vh`;
            containerEight.appendChild(div);
        }
    }
    
    // On ne splitte plus hbd-chatbox car elle n'existe plus
    const hbd = document.getElementsByClassName("wish-hbd")[0];
    if(hbd) {
        hbd.innerHTML = `<span>${hbd.innerHTML
            .split("")
            .join("</span><span>")}</span>`;
    }

    const ideaTextTrans = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
    }

    const ideaTextTransLeave = {
        opacity: 0,
        y: 20,
        rotationY: 5,
        skewX: "-15deg"
    }

    // timeline
    const tl = new TimelineMax();

    tl.to(".container", 0.6, {
        visibility: "visible"
    })
    .from(".one", 0.7, {
        opacity: 0,
        y: 10
    })
    .from(".two", 0.4, {
        opacity: 0,
        y: 10
    })
    .to(".one",
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "+=3.5")
    .to(".two",
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "-=1")
    .from(".three", 0.7, {
        opacity: 0,
        y: 10
    })
    .to(".three",
        0.7,
        {
            opacity: 0,
            y: 10
        },
    "+=3")
    // --- ICI : J'ai supprimé toute la partie ".four" (le chat) ---
    // On passe directement à l'idée suivante
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, {
        scale: 1.2,
        x: 10,
        backgroundColor: "rgb(21, 161, 237)",
        color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=2.5")
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=2.5")
    .from(
        ".idea-5",
        0.7, {
            rotationX: 15,
            rotationZ: -10,
            skewY: "-5deg",
            y: 50,
            z: 10,
            opacity: 0,
        },
        "+=1.5"
    )
    .to(
        ".idea-5 span",
        0.7, {
            rotation: 90,
            x: 8,
        },
        "+=1.4"
    )
    .to(
        ".idea-5",
        0.7, {
            scale: 0.2,
            opacity: 0,
        },
        "+=2"
    )
    .staggerFrom(
        ".idea-6 span",
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: 15,
            ease: Expo.easeOut,
        },
        0.2
    )
    .staggerTo(
        ".idea-6 span",
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: -15,
            ease: Expo.easeOut,
        },
        0.2,
        "+=1.5"
    )
    .staggerFromTo(
        ".baloons img",
        2.5, {
            opacity: 0.9,
            y: 1400,
        }, {
            opacity: 1,
            y: -1000,
        },
        0.2
    )
    .from(
        ".profile-picture",
        0.5, {
            scale: 3.5,
            opacity: 0,
            x: 25,
            y: -25,
            rotationZ: -45,
        },
        "-=2"
    )
    .from(".hat", 0.5, {
        x: -100,
        y: 350,
        rotation: -180,
        opacity: 0,
    })
    .staggerFrom(
        ".wish-hbd span",
        0.7, {
            opacity: 0,
            y: -50,
            // scale: 0.3,
            rotation: 150,
            skewX: "30deg",
            ease: Elastic.easeOut.config(1, 0.5),
        },
        0.1
    )
    .staggerFromTo(
        ".wish-hbd span",
        0.7, {
            scale: 1.4,
            rotationY: 150,
        }, {
            scale: 1,
            rotationY: 0,
            color: "#ff69b4",
            ease: Expo.easeOut,
        },
        0.1,
        "party"
    )
    .from(
        ".wish h5",
        0.5, {
            opacity: 0,
            y: 10,
            skewX: "-15deg",
        },
        "party"
    )
    .staggerTo(
        ".eight .magic-particle",
        1.5, {
            visibility: "visible",
            opacity: 0,
            scale: 80,
            repeat: 3,
            repeatDelay: 1.4,
        },
        0.3
    )
    .to(".six", 0.5, {
        opacity: 0,
        y: 30,
        zIndex: "-1",
    })
    .staggerFrom(".nine p", 1, ideaTextTrans, 1.2)
    .to(
        ".last-smile",
        0.5, {
            rotation: 90,
        },
        "+=1"
    );

    // Restart Animation on click
    const replyBtn = document.getElementById("replay");
    if(replyBtn) {
        replyBtn.addEventListener("click", () => {
            tl.restart();
        });
    }
}

// Poussière de fée
document.addEventListener('mousemove', function(e) {
    let body = document.querySelector('body');
    let particle = document.createElement('span');
    particle.classList.add('fairy-dust');
    let x = e.pageX;
    let y = e.pageY;
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    let size = Math.random() * 8;
    particle.style.width = 2 + size + 'px';
    particle.style.height = 2 + size + 'px';
    body.appendChild(particle);
    setTimeout(function() {
      particle.remove();
    }, 2000);
});