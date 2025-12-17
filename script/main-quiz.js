const TARGET_YEAR = 2025;
const FINAL_START_STR = `Dec 21, ${TARGET_YEAR} 00:00:00`; // Cible le 20 décembre
const now = new Date().getTime();
if (now >= new Date(FINAL_START_STR).getTime()) {
    window.location.href = 'index-final.html';
}
// --- CONFIGURATION DES QUESTIONS CORRIGÉES ---
const QUIZ_QUESTIONS = [
    {
        question: "Quelle est ta confiserie préférée ?",
        correctAnswer: "chocolat",
        encouragement: "Ma vie, tu déconnes ! C'est un truc marron, que tu kiffes à la folie !"
    },
    {
        question: "Où est-ce que tu aimerais qu'on parte en vacances ensemble ?",
        correctAnswer: "brésil",
        encouragement: "Presque Mymoune ! Imagine-toi au chaud, sur la plage, avec les cocotiers et le plein soleil !"
    },
    {
        question: "Quel est ton groupe de K-pop préféré ?",
        correctAnswer: "red velvet",
        encouragement: "Là, je n'ai même pas besoin de faire un indice, c'est évident !"
    },
    {
        question: "Qu'est-ce que tu dis quand il se passe une dinguerie jamais vue ?",
        correctAnswer: "c'est du jamais vu dans le monde de la musique",
        encouragement: "Ma vie, c'est ta référence que tu spammes le plus ! C'est une référence de téléréalité : 'le monde de la musique' !"
    },
    {
        question: "Qu'est-ce qu'on mangera la première fois qu'on sera ensemble ?",
        correctAnswer: "pizza",
        encouragement: "C'est minimum une margherita avec plein de fromage fondu pour nous !"
    },
    {
        question: "À quel jeu on jouera ensemble sur la Switch ?",
        correctAnswer: "animal crossing",
        encouragement: "En mode, on se fait une petite île à deux et on vit notre meilleure vie avec Tonton Tom Nook !"
    },
    {
        question: "Quel est l'établissement que tu détestes le plus sur Terre ?",
        correctAnswer: "catho",
        encouragement: "C'est un établissement scolaire, le mec à tout le boulevard. Il est naze et il est chelou ! Toi, tu es la meilleure !"
    },
    {
        question: "Quelle est ton activité du moment ?",
        correctAnswer: "crochet",
        encouragement: "Pense au fil, aux aiguilles, et aux petits gants que tu es en train de créer ma petite mamie !"
    },
    {
        question: "Qu'est-ce que tu trouves BG chez moi ?",
        correctAnswer: "grains de beauté",
        encouragement: "Ma vie, tu m'as dit 10 000 fois que tu aimais bien ! Ce sont des petites taches noires sur la peau !"
    },
    {
        question: "Qu'est-ce que je rêve de te dire H24 ?",
        correctAnswer: "je t'aime",
        encouragement: "Un mot simple mais qui veut tout dire, c'est ce que je ressens pour toi chaque jour !"
    }
];

// --- VARIABLES GLOBALES ---
const MAX_ATTEMPTS = 10; // Nombre maximum de tentatives avant révélation
let currentQuestionIndex = 0;
let score = 0;
let incorrectAttempts = 0; // Compteur d'erreurs pour la question actuelle
const totalQuestions = QUIZ_QUESTIONS.length;

// Éléments du DOM
const questionTextEl = document.getElementById('question-text');
const answerInput = document.getElementById('answer-input');
const submitButton = document.getElementById('submit-button');
const feedbackMessageEl = document.getElementById('feedback-message');
const nextButton = document.getElementById('next-button');
const scoreCounterEl = document.getElementById('score-counter');
const progressBarFill = document.getElementById('progress-bar-fill');
const questionAreaEl = document.getElementById('question-area');
const resultAreaEl = document.getElementById('result-area');
const finalMessageEl = document.getElementById('final-message');
const restartButton = document.getElementById('restart-button');

const ENCOURAGEMENT_MESSAGES = [
    "Oups ! Ce n'est pas ça. Pense à un synonyme ou à la façon dont on le dit en privé !",
    "Non, non, non ! Réfléchis bien à la bonne orthographe ou à la formulation exacte. Tu es proche !",
    "Attention ! C'est souvent la réponse la plus évidente qui nous échappe. Un petit effort !",
    "Faux ! Mais ne t'inquiète pas, concentre-toi. Je crois en ta mémoire d'éléphant !",
    "Ah, dommage ! Essaie de reformuler. Un petit effort, et tu passes à la question suivante. On ne lâche rien !",
];


// --- FONCTIONS UTILITAIRES POUR LA TOLÉRANCE ---

// Retire les accents, cédilles, etc.
const normalizeString = (str) => {
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "");
};

// Retire les articles courants et nettoie la ponctuation pour une comparaison souple
const cleanAnswer = (str) => {
    let clean = normalizeString(str)
        .toLowerCase()
        .trim();
        
    // Retirer les articles courants et prépositions au début (avec un espace après)
    clean = clean.replace(/^(le|la|les|tes|mes|un|une|des|du|de|d'|a|aux|mon|ma|mes|notre|nos)\s+/, '');
    
    // Retirer la ponctuation (sauf tirets si vous en avez besoin) et les espaces multiples
    clean = clean.replace(/[^\w\s]/g, '') 
                 .replace(/\s+/g, ' '); 
                 
    return clean.trim();
};


// --- FONCTIONS PRINCIPALES ---

// Affiche la question
const showQuestion = () => {
    if (currentQuestionIndex >= totalQuestions) {
        showResults();
        return;
    }

    // NOUVEAU : Réinitialisation du compteur de tentatives pour la nouvelle question
    incorrectAttempts = 0; 

    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    questionTextEl.textContent = `${currentQuestionIndex + 1}. ${q.question}`;
    
    // Réinitialisation de la zone de saisie
    answerInput.value = '';
    answerInput.disabled = false;
    submitButton.disabled = false;
    answerInput.focus();
    
    feedbackMessageEl.classList.add('hidden');
    nextButton.classList.add('hidden');
    feedbackMessageEl.classList.remove('feedback-error', 'feedback-success');
    
    updateProgress();
};

// Vérifie la réponse (appelée par le bouton Valider)
const checkAnswer = () => {
    const rawAnswer = answerInput.value;
    const q = QUIZ_QUESTIONS[currentQuestionIndex];
    
    // Vérification stricte : si l'utilisateur ne tape rien
    if(rawAnswer.trim() === '') {
        feedbackMessageEl.classList.remove('hidden');
        feedbackMessageEl.classList.add('feedback-error');
        feedbackMessageEl.textContent = "Faut que tu ecris un truc mymoune";
        return;
    }
    
    const userCleanedAnswer = cleanAnswer(rawAnswer);
    const correctCleanedAnswer = cleanAnswer(q.correctAnswer);

    if (userCleanedAnswer === correctCleanedAnswer) {
        // --- LOGIQUE DE SUCCÈS ---
        score++;
        
        answerInput.disabled = true;
        submitButton.disabled = true;
        
        feedbackMessageEl.classList.remove('hidden');
        feedbackMessageEl.classList.add('feedback-success');
        feedbackMessageEl.classList.remove('feedback-error');
        feedbackMessageEl.textContent = "Bravo mmyouunnee t'as trouvé vite ! go to next ! 🎉";
        
        nextButton.classList.remove('hidden');
        nextButton.onclick = goToNextQuestion;
    } else {
        // --- LOGIQUE D'ÉCHEC / TOLÉRANCE ---
        incorrectAttempts++; // Incrémenter le compteur d'erreur

        if (incorrectAttempts >= MAX_ATTEMPTS) {
            // L'utilisateur a atteint la limite de 5 essais (ou plus)
            
            // 1. On compte la réponse comme correcte (selon la demande de l'utilisateur)
            score++; 
            
            // 2. On désactive les inputs
            answerInput.disabled = true;
            submitButton.disabled = true;

            // 3. Affichage du message de révélation
            feedbackMessageEl.classList.remove('hidden');
            feedbackMessageEl.classList.add('feedback-success');
            feedbackMessageEl.classList.remove('feedback-error');
            
            // 4. Message de révélation
            feedbackMessageEl.innerHTML = `
                Nooonn ma vie t'es arrivé à ${MAX_ATTEMPTS} erreurs, la bonne réponse était : 
                <span style="font-style: italic; font-weight: bold; color: #795548;">
                    ${q.correctAnswer.toUpperCase()}
                </span>. Mais c'est pas grave, on passe à la suivante t'inquiète pas mymoune !
                <br>
                Clique sur SUIVANTE.
            `;
            
            nextButton.classList.remove('hidden');
            nextButton.onclick = goToNextQuestion;
            
        } else {
            // Tentative échouée normale (moins de 5 essais)
            
            feedbackMessageEl.classList.remove('hidden');
            feedbackMessageEl.classList.add('feedback-error');
            feedbackMessageEl.classList.remove('feedback-success');
            
            // Message d'encouragement avec le nombre de tentatives restantes
            const attemptsLeft = MAX_ATTEMPTS - incorrectAttempts;
            const randomEncouragement = ENCOURAGEMENT_MESSAGES[Math.floor(Math.random() * ENCOURAGEMENT_MESSAGES.length)];
            
            feedbackMessageEl.textContent = `${q.encouragement || randomEncouragement} (Tentatives restantes : ${attemptsLeft})`;
            
            // Effacer la réponse pour inciter à retaper
            answerInput.value = '';
            answerInput.focus();
        }
    }
};

// Passe à la question suivante
const goToNextQuestion = () => {
    currentQuestionIndex++;
    showQuestion();
};

// Met à jour la barre de progression
const updateProgress = () => {
    // La barre se remplit en fonction des questions TERMINÉES
    const progress = (currentQuestionIndex / totalQuestions) * 100; 
    progressBarFill.style.width = `${progress}%`;
    scoreCounterEl.textContent = `${score} / ${totalQuestions}`;
};

// Affiche les résultats finaux
const showResults = () => {
    questionAreaEl.classList.add('hidden');
    resultAreaEl.classList.remove('hidden');
    
    // Mettre à jour la barre à 100% à la fin
    progressBarFill.style.width = `100%`;
    scoreCounterEl.textContent = `${score} / ${totalQuestions}`; 
    
    let message = '';
    if (score === totalQuestions) {
        message = `Bien joué ma viiiiee ${score}/${totalQuestions} ! T'es forte ma vie d'amour !! J'espere que ça t'a plu et que tu as passé un bon moment à répondre à toutes ces questions sur nous deux !!`;
    } else if (score >= totalQuestions * 0.7) {
        message = `Bien joué ma viiiiee, ${score}/${totalQuestions} ! T'es forte ma vie d'amour !! J'espere que ça t'a plu et que tu as passé un bon moment à répondre à toutes ces questions sur nous deux !!`;
    } else {
        message = `💖 **Score de ${score}/${totalQuestions}.** Ce n'est pas grave si tu n'as pas tout trouvé ! L'amour est là, et c'est le plus important. Ton cadeau t'attend ici : [LIEN VERS LA SURPRISE FINALE]`;
    }
    
    finalMessageEl.innerHTML = message;
};

// Initialisation au chargement de la page
const initQuiz = () => {
    // Événement pour le bouton Valider
    submitButton.addEventListener('click', checkAnswer);
    
    // Permet de valider avec la touche Entrée dans le champ
    answerInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !submitButton.disabled) {
            checkAnswer();
            e.preventDefault(); 
        }
    });

    // Événement pour recommencer
    restartButton.addEventListener('click', () => {
        currentQuestionIndex = 0;
        score = 0;
        resultAreaEl.classList.add('hidden');
        questionAreaEl.classList.remove('hidden');
        showQuestion();
    });
    
    showQuestion();
};

const updateNextDayTimer = () => {
    const timerEl = document.getElementById('next-day-timer');
    if (!timerEl) return;

    setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(`Dec 21, ${TARGET_YEAR} 00:00:00`).getTime() - now;

        if (distance < 0) {
            timerEl.innerText = "C'est prêt ! Actualise !";
            return;
        }

        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);

        timerEl.innerText = `${hours}h ${minutes}m ${seconds}s`;
    }, 1000);
};
updateNextDayTimer();


window.addEventListener('load', initQuiz);

