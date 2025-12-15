// --- CONFIGURATION GLOBALE ---
const TARGET_YEAR = 2025;
const TARGET_DATE_STR = `Dec 14, ${TARGET_YEAR} 00:00:00`;
const TARGET_DATE_MS = new Date(TARGET_DATE_STR).getTime();

// Référence à l'élément audio (supposée exister dans le HTML avec la classe 'song')
const songElement = document.querySelector('.song');

// --- FONCTION PRINCIPALE : Lancement de l'animation ---
const startParty = () => {
    // 1. Cacher le compte à rebours avec une transition douce
    const countdownContainer = document.getElementById('countdown-container');
    if (countdownContainer) {
        countdownContainer.style.opacity = '0';
        setTimeout(() => {
            countdownContainer.style.display = 'none';
        }, 1000); // 1 seconde pour la transition d'opacité
    }

    // 2. Demander à l'utilisateur s'il veut jouer de la musique (Utilise SweetAlert2 - Swal)
    Swal.fire({
        title: 'Voulez-vous jouer de la musique en fond ?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Oui',
        cancelButtonText: 'Non',
    }).then((result) => {
        if (result.isConfirmed && songElement) {
            songElement.play();
        }
        // Démarrer la séquence d'animation GSAP dans tous les cas
        animationTimeline();
    });
};

// --- LOGIQUE DU COMPTE À REBOURS ---
const checkTime = () => {
    // Si la date cible est déjà passée, lancer directement la fête
    const now = new Date().getTime();
    if (now > TARGET_DATE_MS) {
        startParty();
        return;
    }

    // Mettre à jour le compte à rebours toutes les secondes
    const intervalId = setInterval(function() {
        const now = new Date().getTime();
        const distance = TARGET_DATE_MS - now;

        // Calcul des jours, heures, minutes et secondes
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        // Fonction d'aide pour formater avec un zéro devant si < 10
        const formatTime = (value) => (value < 10 ? "0" + value : value);

        // Mettre à jour les éléments du DOM
        document.getElementById("days").innerText = formatTime(days);
        document.getElementById("hours").innerText = formatTime(hours);
        document.getElementById("minutes").innerText = formatTime(minutes);
        document.getElementById("seconds").innerText = formatTime(seconds);

        // Si le compte à rebours est terminé (distance < 0)
        if (distance < 0) {
            clearInterval(intervalId); // Arrêter l'intervalle
            startParty(); // Lancer l'animation
        }
    }, 1000);
};

// --- LOGIQUE D'INITIALISATION : Poussière de fée (Fairy Dust) ---
document.addEventListener('mousemove', function(e) {
    let body = document.querySelector('body');
    let particle = document.createElement('span');
    particle.classList.add('fairy-dust');
    let x = e.pageX;
    let y = e.pageY;
    
    // Positionner la particule
    particle.style.left = x + 'px';
    particle.style.top = y + 'px';
    
    // Taille aléatoire pour l'effet
    let size = Math.random() * 8;
    particle.style.width = 2 + size + 'px';
    particle.style.height = 2 + size + 'px';
    
    body.appendChild(particle);
    
    // Supprimer la particule après 2 secondes (pour éviter la saturation du DOM)
    setTimeout(function() {
      particle.remove();
    }, 2000);
});

// --- TIMELINE D'ANIMATION GSAP ---
const animationTimeline = () => {
    // --- ÉTAPE 1: Préparation des éléments ---

    // Créer les particules magiques aléatoires (pour la section .eight)
    const containerEight = document.querySelector(".eight");
    const colors = ["particle-pink", "particle-gold", "particle-blue", "particle-red", "particle-purple"];
    
    if (containerEight) {
        containerEight.innerHTML = ""; // Nettoyer avant d'ajouter
        for (let i = 0; i < 5; i++) {
            const div = document.createElement("div");
            div.classList.add("magic-particle");
            
            // Ajouter une couleur aléatoire
            const randomColor = colors[Math.floor(Math.random() * colors.length)];
            div.classList.add(randomColor);
            
            // Positionner aléatoirement
            const randomLeft = Math.floor(Math.random() * 90) + 5;
            const randomTop = Math.floor(Math.random() * 90) + 5;
            div.style.left = `${randomLeft}vw`;
            div.style.top = `${randomTop}vh`;
            
            containerEight.appendChild(div);
        }
    }
    
    // Diviser les lettres du message 'wish-hbd' en spans individuels pour l'animation
    const hbd = document.getElementsByClassName("wish-hbd")[0];
    if (hbd) {
        hbd.innerHTML = `<span>${hbd.innerHTML
            .split("")
            .join("</span><span>")}</span>`;
    }

    // Propriétés de transition standard pour l'apparition des idées de texte
    const ideaTextTrans = {
        opacity: 0,
        y: -20,
        rotationX: 5,
        skewX: "15deg"
    };

    // Propriétés de transition standard pour la disparition des idées de texte
    const ideaTextTransLeave = {
        opacity: 0,
        y: 20,
        rotationY: 5,
        skewX: "-15deg"
    };

    // --- ÉTAPE 2: La Timeline GSAP ---
    // Utilisation de gsap.timeline() à la place de new TimelineMax()
    const tl = gsap.timeline({ defaults: { ease: "power2.out" } });

    tl.to(".container", 0.6, {
        visibility: "visible",
        filter: "blur(0px) grayscale(0%)"

    })
    
    // Séquence 1: Premiers messages (one, two, three)
    .from(".one", 0.7, {
        opacity: 0,
        y: 10
    })
    .from(".two", 0.4, {
        opacity: 0,
        y: 10
    })
    .to(".one", 0.7, {
        opacity: 0,
        y: 10
    }, "+=3.5") // Disparition après 3.5s
    .to(".two", 0.7, {
        opacity: 0,
        y: 10
    }, "<1") // Disparition 1s avant la fin du 'one'
    .from(".three", 0.7, {
        opacity: 0,
        y: 10
    })
    .to(".three", 0.7, {
        opacity: 0,
        y: 10
    }, "+=4.5") // Disparition après 4.5s
    
    // Séquence 2: Idées de texte (idea-1 à idea-5)
    .from(".idea-1", 0.7, ideaTextTrans)
    .to(".idea-1", 0.7, ideaTextTransLeave, "+=4.5")
    
    .from(".idea-2", 0.7, ideaTextTrans)
    .to(".idea-2", 0.7, ideaTextTransLeave, "+=2.5")
    
    .from(".idea-3", 0.7, ideaTextTrans)
    .to(".idea-3 strong", 0.5, { // Effet d'accentuation sur le texte fort
        scale: 1.2,
        x: 10,
        backgroundColor: "rgb(21, 161, 237)",
        color: "#fff",
    })
    .to(".idea-3", 0.7, ideaTextTransLeave, "+=2.5")
    
    .from(".idea-4", 0.7, ideaTextTrans)
    .to(".idea-4", 0.7, ideaTextTransLeave, "+=2.5")
    
    // Animation d'entrée complexe pour idea-5
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
        ".idea-5 span", // Animation du span à l'intérieur de idea-5 (probablement un cœur ou un caractère spécial)
        0.7, {
            rotation: 90,
            x: 8,
        },
        "<1.4" // Commence 1.4s après le début de l'animation idea-5
    )
    .to(
        ".idea-5",
        0.7, {
            scale: 0.2,
            opacity: 0,
        },
        "+=2"
    )
    
    // Séquence 3: Souhaits et ballons
    // Staggered From (apparition échelonnée) pour les lettres de idea-6
    .staggerFrom(
        ".idea-6 span",
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: 15,
            ease: "Expo.easeOut",
        },
        0.2 // Délai de 0.2s entre chaque lettre
    )
    // Staggered To (disparition échelonnée)
    .staggerTo(
        ".idea-6 span",
        0.8, {
            scale: 3,
            opacity: 0,
            rotation: -15,
            ease: "Expo.easeOut",
        },
        0.2,
        "+=1.5"
    )
    
    // Animation des ballons (montée rapide)
    // Staggered FromTo (mouvement du bas vers le haut)
    .staggerFromTo(
        ".baloons img",
        2.5, {
            opacity: 0.9,
            y: 1400, // Commence bien en dessous
        }, {
            opacity: 1,
            y: -1000, // Finit bien au-dessus
        },
        0.2
    )
    
    // Affichage de la photo de profil
    .from(
        ".profile-picture",
        0.5, {
            scale: 3.5,
            opacity: 0,
            x: 25,
            y: -25,
            rotationZ: -45,
            filter: "blur(10px) brightness(80%)",
        },
        "<2" // Commence 2s avant la fin du mouvement des ballons (se chevauche)
    )
    .to(
        ".profile-picture", // Ajout de l'étape pour annuler le flou
        1.0, {
            filter: "blur(0px) brightness(100%)", // La photo devient nette
        },
        "<0.2" // Commence peu après l'apparition
    )
    
    // Animation finale: "Joyeux Anniversaire"
    // Staggered From (apparition échelonnée des lettres)
    .staggerFrom(
        ".wish-hbd span",
        0.7, {
            opacity: 0,
            y: -50,
            rotation: 150,
            skewX: "30deg",
            ease: "Elastic.easeOut.config(1, 0.5)", // Effet élastique
        },
        0.1
    )
    // Staggered To (effet de couleur final)
    .staggerTo(
        ".wish-hbd span",
        0.7, {
            scale: 1,
            rotationY: 0,
            color: "#ff69b4", // La couleur finale "Joyeux Anniversaire"
            ease: "Expo.easeOut",
        },
        0.1,
        "party" // Label pour synchroniser avec le message h5
    )
    .from(
        ".wish h5", // Le message personnel sous le titre principal
        0.5, {
            opacity: 0,
            y: 10,
            skewX: "-15deg",
        },
        "party" // Commence en même temps que l'effet de couleur des lettres
    )
    
    // Explosion finale des particules magiques
    .staggerTo(
        ".eight .magic-particle",
        1.5, {
            visibility: "visible",
            opacity: 0,
            scale: 80, // Explosion énorme
            repeat: 3,
            repeatDelay: 1.4,
        },
        0.3
    );
};

// --- INITIALISATION AU CHARGEMENT DE LA PAGE ---
window.addEventListener('load', () => {
    // La logique de 'checkTime' inclut déjà la vérification si la date est passée.
    checkTime();
});
