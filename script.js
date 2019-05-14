let coins = 0;
let maxCoins = 0;
let totalClicks = 0;

let buySound = new Audio('sounds/buy.mp3');
let coinSound = new Audio('sounds/coin.mp3');

let miner = createResource('Miner', 0, 1, 50, 'imgs/miner.jpeg');
let computer = createResource('Computer', 0, 10, 500, 'imgs/computer.png');
let dataCenter = createResource('Data center', 0, 100, 2000, 'imgs/datacenter.png');
let superComputer = createResource('Super computer', 0, 1000, 50000, 'imgs/supercomputer.jpg');
let quantumComputer = createResource('Quantum computer', 0, 10000, 200000, 'imgs/quantumcomputer.jpg');
let ai = createResource('AI', 0, 100000, 5000000, 'imgs/AI.png');
let matrioshkaBrain = createResource ('Matrioshka brain', 0, 1000000, 20000000, 'imgs/matrioshka.jpg');
let simulation = createResource('Simulation', 0, 0, 1000000000, 'imgs/simulation.jpg');
let resources = [miner, computer, dataCenter, superComputer, quantumComputer, ai, matrioshkaBrain, simulation];

let achievements = [
    {
        message: 'Entrepreneur',
        isComplete: function() {
            return miner.owned >= 5;
        },
        seen: false,
    },
    {
        message: 'From rags to riches',
        isComplete: function() {
            return maxCoins >= 1000;
        },
        seen: false,
    },
    {
        message: 'Click madness',
        isComplete: function() {
            return totalClicks >= 100;
        },
        seen: false,
    },
    {
        message: 'Money rocket',
        isComplete: function() {
            return getTotalCps() >= 10000;
        },
        seen: false,
    },
    {
        message: 'Singularity',
        isComplete: function() {
            return ai.owned >= 1;
        },
        seen: false,
    },
    {
        message: 'Ready for simulation',
        isComplete: function() {
            return maxCoins >= simulation.cost;
        },
        seen: false,
    },
];

function showAchievement(achievement) { 
    let game = document.getElementById('game');
    let goldBox = document.createElement('div');
    goldBox.className = 'goldBox';
    let width = 200;
    let height = 50;
    let top = game.offsetHeight - (height + 4);
    let left = game.offsetLeft + game.offsetWidth / 2 - (width + 4) / 2;
    goldBox.style.width = width + 'px';
    goldBox.style.height = height + 'px';
    goldBox.style.top = top + 'px';
    goldBox.style.left = left + 'px';
    goldBox.innerText = achievement.message;
    goldBox.addEventListener('click', function() {
        goldBox.remove();
    });
    game.appendChild(goldBox);
}

function coinClick(event) {
    let coinsGained = Math.max(1, getTotalCps());
    coins += coinsGained;
    maxCoins = Math.max(coins, maxCoins);
    totalClicks++;
    updateTotalCoins();
    updateResourceButtons();
    popupCoinMsg(coinsGained, event.clientX, event.clientY);
}

function popupCoinMsg(coinsGained, clientX, clientY) {
    let popup = document.createElement('div');
    popup.className = 'popupCoinMsg';
    popup.innerText = '+ ' + coinsGained;
    popup.style.top = clientY + 'px';
    popup.style.left = clientX + 'px';
    document.querySelector('body').appendChild(popup);
    coinSound.currentTime = 0;
    coinSound.play(); 
    setTimeout(function() {
        popup.remove();
    }, 1000);
}

function createResource(name, owned, cps, cost, img) {
    return {
        name: name,
        owned: owned,
        cps: cps,
        cost: cost,
        img: img
    };
}

function getTotalCps() {
    let cps = 0;
    for (let i = 0; i < resources.length; i++) {
        let resource = resources[i];
        cps += resource.owned * resource.cps;
    }
    return cps;
}

function buyResource(resourceIndex) {
    let resource = resources[resourceIndex];
    coins -= resource.cost;
    updateTotalCoins();
    updateResourceButtons();
    resource.owned += 1;
    let left = document.getElementById('left');
    let cps = getTotalCps();
    if (cps > 1000000) {
        left.className = 'left2';
    }
    else if (cps > 100000) {
        left.className = 'left1';
    }
    else if (cps > 1000) {
        left.className = 'left0';
    }
    let goldCircle = document.querySelectorAll('.goldCircle')[resourceIndex];
    goldCircle.innerText = resource.owned;
    if (resource.owned <= 20) {
        let newImg = document.createElement('img');
        newImg.src = resource.img;
        newImg.className = 'resourceImg';
        let borderL = document.querySelectorAll('.borderL')[resourceIndex];
        borderL.appendChild(newImg);
        borderL.style.visibility = 'visible';
    }
    buySound.currentTime = 0;
    buySound.play();
}

function updateTotalCoins() {
    let totalCoins = document.getElementById('totalCoins');
    if (coins > 1000000000) {
        let bilCoins = coins / 1000000000;
        totalCoins.innerText = bilCoins.toFixed(2) + ' billion';
    }
    else if (coins > 1000000) {
        let milCoins = coins / 1000000;
        totalCoins.innerText = milCoins.toFixed(2) + ' million';
    }
    else {
        totalCoins.innerText = coins.toFixed();
    }
}

function updateResourceButtons() {
    for (let i = 0; i < resources.length; i++) {
        let resource = resources[i];
        let borderR = document.querySelectorAll('.borderR')[i];
        if (coins >= resource.cost / 2) {
            borderR.style.visibility = 'visible';
        }
        if (coins >= resource.cost) {
            borderR.classList.remove('disabledR');
        }
        else {
            borderR.classList.add('disabledR');
        }
    }
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomBonusCoin() {
    let removed = false;
    let body = document.querySelector('body');
    let randomCoinImg = document.createElement('img');
    randomCoinImg.className = 'coinButton';
    let top = getRandomInt(0, body.offsetHeight - 175);
    let left = getRandomInt(0, body.offsetWidth - 175);
    randomCoinImg.style.position = 'absolute';
    randomCoinImg.style.top = top + 'px';
    randomCoinImg.style.left = left + 'px';
    randomCoinImg.src = 'imgs/coin.png';
    randomCoinImg.addEventListener('click', function(event) {
        let randomMult = getRandomInt(2, 10);
        let coinsGained = randomMult * Math.max(1, getTotalCps());
        coins += coinsGained;
        maxCoins = Math.max(coins, maxCoins);
        updateTotalCoins();
        updateResourceButtons();
        popupCoinMsg(coinsGained, event.clientX, event.clientY);
        if (!removed) {
            randomCoinImg.remove();
            removed = true; 
        }
    });
    body.appendChild(randomCoinImg);
    setTimeout(function() {
        if (!removed) {
            randomCoinImg.remove();
            removed = true; 
        }
    }, 10000);
}

setInterval(function() {
    setTimeout(randomBonusCoin, getRandomInt(0, 60000));
}, 40000);

setInterval(function() {
    let coinsGained = getTotalCps() / 100;
    coins += coinsGained;
    maxCoins = Math.max(coins, maxCoins);
    for (let i = 0; i < achievements.length; i++) {
        let achievement = achievements[i];
        if (achievement.isComplete() && !achievement.seen) {
            showAchievement(achievement); 
            achievement.seen = true;
        }
    }
    updateTotalCoins();
    updateResourceButtons();
}, 10);

function reset() {
    location.reload();
}

