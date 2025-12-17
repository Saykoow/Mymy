const card = document.getElementById('card');
const typingTextElement = document.getElementById('typing-text');
const signatureElement = document.getElementById('signature');

// --- TON TEXTE ICI --- 
// \n fait un saut de ligne. N'hésite pas à faire long !
const fullText = `Ma chère Mymoune,

Si tu lis ce message, c'est que tu as ouvert notre carte de golden day virtuelle ! On est le 21 décembre et j'ai 23 ans (Je me fais vieux :( ), mais au moins je suis à tes cotés et je suis énormément heureux d'avoir 23 ans avec toi !

Je voulais prendre un moment, pour te dire à quel point je t'apprécie, je suis heureux de passer mes journées avec toi, de discuter avec toi, d'apprendre avec toi mais surtout de grandir avec toi ! 

J'ai du mal avec les anniversaires mais cette fois je suis content parce que c'est une année de plus où j'ai la chance de t'avoir dans ma vie.

Merci d'être celle que tu es : drôle, belle, intelligente, adorable, mignonne, sympa, gentille, trop gentille, agréable, cultivée, honnête, apaisante et incroyablement douce.

J'ai hâte de tout ce qui nous attend. Les voyages, les pizzas, les soirées Switch, et même les moments où on fait rien.

Je t'aime d'amour ++++++ .`;
// ---------------------

let isOpened = false;

card.addEventListener('click', () => {
    if (!isOpened) {
        // 1. Ouvrir la carte
        card.classList.add('open');
        isOpened = true;

        // 2. Attendre que la carte soit ouverte (1 seconde) avant d'écrire
        setTimeout(() => {
            typeWriter(fullText, 0);
        }, 1000);
    }
});

// Fonction effet machine à écrire
function typeWriter(text, i) {
    if (i < text.length) {
        // Si c'est un saut de ligne \n, on met un <br>, sinon la lettre
        if (text.charAt(i) === '\n') {
            typingTextElement.innerHTML += '<br>';
        } else {
            typingTextElement.innerHTML += text.charAt(i);
        }
        
        // Vitesse de frappe (50ms = assez rapide, 100ms = lent)
        // On ajoute un peu d'aléatoire pour faire "humain"
        const speed = Math.random() * 50 + 30; 
        
        setTimeout(() => {
            typeWriter(text, i + 1);
        }, speed);
    } else {
        // Une fois fini, on affiche la signature
        signatureElement.classList.remove('hidden');
        signatureElement.classList.add('visible');
    }
}
