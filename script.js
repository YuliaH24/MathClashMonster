let p1Score = 0;
let p2Score = 0;
let currentRound = 1;
const maxRounds = 11;
const scorePerQuestion = 10;

let correctAnswer = 0;
let currentOptions = [];
let isRoundActive = false;

// Mapping tombol fisik keyboard
const p1Keys = ['KeyA', 'KeyS', 'KeyD', 'KeyF'];
const p2Keys = ['KeyH', 'KeyJ', 'KeyK', 'KeyL'];

function initRound() {
    if (currentRound > maxRounds) {
        endGame();
        return;
    }
    
    isRoundActive = true;
    document.getElementById('round-num').innerText = currentRound;
    
    // Atur Jenis Soal: 30% Penjumlahan 8 (Pengecoh), 70% Perkalian 3-9
    let isTrick = Math.random() < 0.3;
    let num1 = Math.floor(Math.random() * 7) + 3; // Angka 3 sampai 9
    let num2 = Math.floor(Math.random() * 7) + 3; // Angka 3 sampai 9
    
    let questionText = "";
    if (isTrick) {
        questionText = `${num1} + 8`;
        correctAnswer = num1 + 8;
    } else {
        questionText = `${num1} × ${num2}`;
        correctAnswer = num1 * num2;
    }
    
    document.getElementById('question-box').innerText = questionText;
    
    // Racik Jawaban Pilihan
    currentOptions = [correctAnswer];
    while (currentOptions.length < 4) {
        let wrong = correctAnswer + Math.floor(Math.random() * 12) - 6;
        if (wrong > 0 && !currentOptions.includes(wrong)) {
            currentOptions.push(wrong);
        }
    }
    // Acak Pilihan Jawaban
    currentOptions.sort(() => Math.random() - 0.5);
    
    // Tampilkan teks jawaban di tombol P1 dan P2
    // Skema penulisan: "Tombol [Nilai Jawaban]"
    const p1Labels = ['A: ', 'S: ', 'D: ', 'F: '];
    const p2Labels = ['H: ', 'J: ', 'K: ', 'L: '];
    for (let i = 0; i < 4; i++) {
        document.getElementById(`p1-opt${i}`).innerText = p1Labels[i] + currentOptions[i];
        document.getElementById(`p2-opt${i}`).innerText = p2Labels[i] + currentOptions[i];
    }
}

// Deteksi Pencetan Keyboard Komputer
window.addEventListener('keydown', function(event) {
    if (!isRoundActive) return;
    
    // Cek pemain 1
    if (p1Keys.includes(event.code)) {
        let idx = p1Keys.indexOf(event.code);
        processAnswer(1, currentOptions[idx]);
    }
    // Cek pemain 2
    else if (p2Keys.includes(event.code)) {
        let idx = p2Keys.indexOf(event.code);
        processAnswer(2, currentOptions[idx]);
    }
});

function processAnswer(player, chosenAnswer) {
    isRoundActive = false; // Kunci ronde agar tidak bisa berebut lagi di ronde yang sama
    
    if (chosenAnswer === correctAnswer) {
        // Tepat & Tercepat! Picu Animasi Serangan
        triggerAttackAnimation(player);
        
        if (player === 1) {
            p1Score += scorePerQuestion;
            document.getElementById('p1-score').innerText = p1Score;
        } else {
            p2Score += scorePerQuestion;
            document.getElementById('p2-score').innerText = p2Score;
        }
    } else {
        // Jika jawaban salah, musuh otomatis mendapatkan poin kejutan karena kecerobohan lawan
        if (player === 1) {
            p2Score += scorePerQuestion;
            document.getElementById('p2-score').innerText = p2Score;
            triggerAttackAnimation(2);
        } else {
            p1Score += scorePerQuestion;
            document.getElementById('p1-score').innerText = p1Score;
            triggerAttackAnimation(1);
        }
    }
    
    // Lanjut ke ronde berikutnya setelah animasi selesai
    currentRound++;
    setTimeout(initRound, 1500);
}

function triggerAttackAnimation(winner) {
    const m1 = document.getElementById('monster1');
    const m2 = document.getElementById('monster2');
    const hit = document.getElementById('hit-effect');
    
    if (winner === 1) {
        m1.classList.add('attack-p1');
        setTimeout(() => {
            hit.classList.remove('hidden');
            m1.classList.remove('attack-p1');
        }, 200);
    } else {
        m2.classList.add('attack-p2');
        setTimeout(() => {
            hit.classList.remove('hidden');
            m2.classList.remove('attack-p2');
        }, 200);
    }
    
    setTimeout(() => {
        hit.classList.add('hidden');
    }, 800);
}

function endGame() {
    document.getElementById('final-p1').innerText = p1Score;
    document.getElementById('final-p2').innerText = p2Score;
    
    let winnerText = "";
    if (p1Score > p2Score) {
        winnerText = "🎉 MONSTER BIRU (P1) MENANG!";
    } else if (p2Score > p1Score) {
        winnerText = "🎉 MONSTER MERAH (P2) MENANG!";
    } else {
        winnerText = "🤝 HASIL SEIMBANG / SERI!";
    }
    
    document.getElementById('winner-text').innerText = winnerText;
    document.getElementById('game-over-screen').classList.remove('hidden');
}

function resetGame() {
    p1Score = 0;
    p2Score = 0;
    currentRound = 1;
    document.getElementById('p1-score').innerText = 0;
    document.getElementById('p2-score').innerText = 0;
    document.getElementById('game-over-screen').classList.add('hidden');
    initRound();
}

// Jalankan game pertama kali
initRound();
