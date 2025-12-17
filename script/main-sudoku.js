const TARGET_YEAR = 2025;
const QUIZ_START_STR = `Dec 20, ${TARGET_YEAR} 00:00:00`; // Cible le 20 décembre
const QUIZ_START_MS = new Date(QUIZ_START_STR).getTime();

(function checkRedirection() {
    const now = new Date().getTime();
    if (now >= QUIZ_START_MS) {
        window.location.href = 'index-quiz.html';
    }
})();

// --- CONFIGURATION DU JEU ---
// La grille de Sudoku ENIGME (0 pour les cases vides)
const PUZZLE = [
    [5, 3, 0, 0, 7, 0, 0, 0, 0],
    [6, 0, 0, 1, 9, 5, 0, 0, 0],
    [0, 9, 8, 0, 0, 0, 0, 6, 0],
    [8, 0, 0, 0, 6, 0, 0, 0, 3],
    [4, 0, 0, 8, 0, 3, 0, 0, 1],
    [7, 0, 0, 0, 2, 0, 0, 0, 6],
    [0, 6, 0, 0, 0, 0, 2, 8, 0],
    [0, 0, 0, 4, 1, 9, 0, 0, 5],
    [0, 0, 0, 0, 8, 0, 0, 7, 9]
];

// La SOLUTION de cette grille (pour la vérification)
const SOLUTION = [
    [5, 3, 4, 6, 7, 8, 9, 1, 2],
    [6, 7, 2, 1, 9, 5, 3, 4, 8],
    [1, 9, 8, 3, 4, 2, 5, 6, 7],
    [8, 5, 9, 7, 6, 1, 4, 2, 3],
    [4, 2, 6, 8, 5, 3, 7, 9, 1],
    [7, 1, 3, 9, 2, 4, 8, 5, 6],
    [9, 6, 1, 5, 3, 7, 2, 8, 4],
    [2, 8, 7, 4, 1, 9, 6, 3, 5],
    [3, 4, 5, 2, 8, 6, 1, 7, 9]
];

let currentGrid = PUZZLE.map(row => [...row]); // Copie modifiable de l'énigme
let selectedCell = null;
const messageArea = document.getElementById('message-area');

// --- FONCTIONS DE BASE ---

// Génère le HTML de la grille dans le DOM
const renderGrid = (grid) => {
    const gridEl = document.getElementById('sudoku-grid');
    gridEl.innerHTML = '';
    
    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            const cell = document.createElement('div');
            cell.classList.add('cell');
            cell.dataset.row = r;
            cell.dataset.col = c;
            cell.id = `cell-${r}-${c}`;
            cell.textContent = grid[r][c] !== 0 ? grid[r][c] : '';
            
            const isFixed = PUZZLE[r][c] !== 0;

            if (isFixed) {
                cell.classList.add('fixed');
            } else {
                cell.addEventListener('click', () => selectCell(cell));
                if (grid[r][c] !== 0) {
                    cell.classList.add('user-input');
                }
            }

            // Ajout des bordures horizontales 3x3 (lignes 3 et 6)
            if (r === 2 || r === 5) {
                cell.classList.add('row-bottom-border');
            }

            gridEl.appendChild(cell);
        }
    }
};

// Gère la sélection des cellules par l'utilisateur
const selectCell = (cell) => {
    // Désélectionner l'ancienne cellule
    if (selectedCell) {
        selectedCell.classList.remove('selected');
        // Optionnel : Désactiver le clavier virtuel si l'ancienne cellule était sélectionnée
        // document.getElementById('sudoku-keypad').classList.add('hidden');
    }
    
    // Sélectionner la nouvelle cellule
    selectedCell = cell;
    selectedCell.classList.add('selected');

    // Assurer l'affichage du clavier virtuel sur mobile
    // Cette partie est facultative si vous gérez l'affichage via Media Queries CSS
    // document.getElementById('sudoku-keypad').classList.remove('hidden');
};

// Gère la saisie utilisateur au clavier physique (Desktop)
const handleInput = (event) => {
    if (!selectedCell || selectedCell.classList.contains('fixed')) return;

    const key = event.key;
    const r = parseInt(selectedCell.dataset.row);
    const c = parseInt(selectedCell.dataset.col);
    
    // Si la touche est un chiffre de 1 à 9
    if (key >= '1' && key <= '9') {
        const value = parseInt(key);
        currentGrid[r][c] = value;
        selectedCell.textContent = value;
        selectedCell.classList.add('user-input');
    } 
    // Si c'est 'Backspace' ou 'Delete'
    else if (key === 'Backspace' || key === 'Delete') {
        currentGrid[r][c] = 0;
        selectedCell.textContent = '';
        selectedCell.classList.remove('user-input');
    }
    
    // Vider le message d'erreur/succès à chaque saisie
    messageArea.innerHTML = '';
    messageArea.classList.add('hidden');
};

// Gère les clics sur le clavier virtuel (Mobile)
const handleKeypadClick = (event) => {
    if (!selectedCell || selectedCell.classList.contains('fixed')) return;

    const btn = event.target.closest('button');
    if (!btn) return;
    
    const value = btn.dataset.value;
    const r = parseInt(selectedCell.dataset.row);
    const c = parseInt(selectedCell.dataset.col);

    // Saisie du chiffre
    if (value >= '1' && value <= '9') {
        currentGrid[r][c] = parseInt(value);
        selectedCell.textContent = value;
        selectedCell.classList.add('user-input');
    } 
    // Effacement (valeur 0 pour le bouton Effacer)
    else if (value === '0') {
        currentGrid[r][c] = 0;
        selectedCell.textContent = '';
        selectedCell.classList.remove('user-input');
    }
    
    // Vider le message d'erreur/succès
    messageArea.innerHTML = '';
    messageArea.classList.add('hidden');
};

// Vérifie si la grille actuelle correspond à la solution
const checkSolution = () => {
    let isCorrect = true;
    
    // Supprimer toutes les classes d'erreur avant de vérifier
    document.querySelectorAll('.cell').forEach(cell => cell.classList.remove('error-cell'));

    for (let r = 0; r < 9; r++) {
        for (let c = 0; c < 9; c++) {
            // Si la case n'est pas remplie, le puzzle n'est pas terminé
            if (currentGrid[r][c] === 0) {
                isCorrect = false;
                break;
            }
            // Si la valeur est différente de la solution
            if (currentGrid[r][c] !== SOLUTION[r][c]) {
                isCorrect = false;
                // Mettre en évidence les erreurs
                document.getElementById(`cell-${r}-${c}`).classList.add('error-cell');
            }
        }
        if (!isCorrect) break;
    }

    messageArea.classList.remove('hidden', 'success', 'error');

    if (isCorrect) {
        messageArea.classList.add('success');
        messageArea.innerHTML = `
            🥳 BRAVOOOO MMA VIIIE T'ES TROP FORTE !!🥳
            <br>
            <p>Je t'aime d'amour !</p>
        `;
        document.removeEventListener('keydown', handleInput);
        document.getElementById('sudoku-keypad').removeEventListener('click', handleKeypadClick);
    } else {
        messageArea.classList.add('error');
        messageArea.textContent = "Oops ! Il y a une erreur quelque part. Vérifie tes lignes, colonnes et blocs 3x3.";
    }
};

// Réinitialise la grille
const resetGrid = () => {
    currentGrid = PUZZLE.map(row => [...row]); // Recharger la copie propre
    renderGrid(currentGrid);
    messageArea.innerHTML = '';
    messageArea.classList.add('hidden');
    
    // S'assurer que les événements sont actifs après le reset
    document.getElementById('check-btn').addEventListener('click', checkSolution);
    document.addEventListener('keydown', handleInput);
    document.getElementById('sudoku-keypad').addEventListener('click', handleKeypadClick);
};


// --- INITIALISATION ---
const initSudoku = () => {
    renderGrid(currentGrid);

    // Écouteurs d'événements
    document.getElementById('check-btn').addEventListener('click', checkSolution);
    document.getElementById('reset-btn').addEventListener('click', resetGrid);
    
    // Écouteur pour le clavier physique (Desktop)
    document.addEventListener('keydown', handleInput); 
    
    // Écouteur pour le clavier virtuel (Mobile)
    document.getElementById('sudoku-keypad').addEventListener('click', handleKeypadClick);
};

const updateNextDayTimer = () => {
    const timerEl = document.getElementById('next-day-timer');
    if (!timerEl) return;

    setInterval(() => {
        const now = new Date().getTime();
        const distance = new Date(`Dec 20, ${TARGET_YEAR} 00:00:00`).getTime() - now;

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

// Lancement du jeu au chargement de la page
window.addEventListener('load', initSudoku);



