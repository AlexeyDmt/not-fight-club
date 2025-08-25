// Начальный вывод игрока и случайный выбор противника
const currentUser = JSON.parse(localStorage.getItem('userSetting'));
console.log(currentUser);

const userName = document.querySelector('.battle__playerPage_name');
const profilePicture = document.querySelector('.battle__playerPage_avatar img');

userName.textContent = currentUser.user;
profilePicture.src = currentUser.avatar;

// Список противников
const enemy = {
    zombi: {
        name: 'Zombi',
        avatar: './src/assets/avatars/enemy_1.jpg',
        attack: 1,
        defense: 1,
        health: 100,
        damage: 5
    },
    lord: {
        name: 'Lord',
        avatar: './src/assets/avatars/enemy_2.jpg',
        attack: 1,
        defense: 2,
        health: 150,
        damage: 10
    },
    greatValuar: {
        name: 'Great Valuar',
        avatar: './src/assets/avatars/enemy_3.jpg',
        attack: 1,
        defense: 2,
        health: 200,
        damage: 20
    }
};

const enemyList = [enemy.zombi, enemy.lord, enemy.greatValuar];

// Случайный выбор противника и сохранение его в localStorage если нет текущего
let savedEnemy = JSON.parse(localStorage.getItem('currentEnemy'));
if (!savedEnemy) {
    savedEnemy = enemyList[Math.floor(Math.random() * enemyList.length)];
    localStorage.setItem('currentEnemy', JSON.stringify(savedEnemy));
}

// Подстановка текущего противника на страницу
const enemyName = document.querySelector('.battle__enemyPage_name');
const enemyPicture = document.querySelector('.battle__enemyPage_avatar img');

enemyName.textContent = savedEnemy.name;
enemyPicture.src = savedEnemy.avatar;

// fight logic
const fightButtonStart = document.querySelector('.battlePage__fightBtn'); // Кнопка, для запуска боя
const pageForLogs = document.querySelector('.battle__asideWindow'); // Место записи логов

// Начальлное состояние жизни игрока и противника на странице
const userLifeText = document.querySelector('.battle__playerPage_lifeTextCurrent');
const userBarHealth = document.querySelector('.battle__playerPage_life');

const enemyLifeText = document.querySelector('.battle__enemyPage_lifeTextCurrent');
const enemyBarHealth = document.querySelector('.battle__enemyPage_life');
const enemyLifeMax = document.querySelector('.battle__enemyPage_lifeTextMax');

// Загружаем или инициализируем состояние боя
let battleState = JSON.parse(localStorage.getItem('battleState')) || {
    userHealth: currentUser.health,
    enemyHealth: savedEnemy.health,
    enemyMaxHealth: savedEnemy.health
};

// Устанавливаем значения состояние жизни игрока и противника на странице
userLifeText.textContent = battleState.userHealth;
userBarHealth.style.width = (battleState.userHealth / currentUser.health) * 100 + '%';

enemyLifeText.textContent = battleState.enemyHealth;
enemyLifeMax.textContent = battleState.enemyMaxHealth;
enemyBarHealth.style.width = (battleState.enemyHealth / battleState.enemyMaxHealth) * 100 + '%';

// ----

const zones = ['head', 'neck', 'body', 'belly', 'legs']; // Зоны удара для enemy

// Миксуем точки удара или блока
function mixZone(item) {
    for (let i = item.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [item[i], item[j]] = [item[j], item[i]];
    }
    return item;
}

// Режем лишние точки удара или блока
function getRandomZone(item, count) {
    return item.slice(0, count);
}

fightButtonStart.addEventListener('click', () => {
    const attackArea = document.querySelectorAll('.battlePage__attackListItem input:checked');
    const defenseArea = document.querySelectorAll('.battlePage__defenseListItem input:checked');

    // Проверка на ошибку количества ударов и блоков
    if (attackArea.length !== 1) {
        alert('Выберите 1 зону атаки');
        console.log('Выберите 1 зону атаки');
        return false;
    }
    if (defenseArea.length === 0 || defenseArea.length === 1 || defenseArea.length > 2) {
        alert('Выберите 2 зоны защиты');
        console.log('Выберите 2 зоны защиты');
        return false;
    }

    // Определяем зону атаки и блока в текущем раунде для enemy 
    const enemyCurrentAttack = getRandomZone(mixZone([...zones]), savedEnemy.attack);
    const enemyCurrentDefense = getRandomZone(mixZone([...zones]), savedEnemy.defense);

    let userDamage = 0;
    let enemyDamage = 0;

    const ignoreBlockChance = 0.3; // шанс пробить блок
    const critChance = 0.2;        // шанс критического удара
    const critMultiplier = 2;      // модификатор урона

    // Логика атаки игрока
    const userAttackZone = attackArea[0].value;
    let isUserCrit = false;

    if (!enemyCurrentDefense.includes(userAttackZone) || Math.random() < ignoreBlockChance) {
        userDamage = currentUser.damage;

        // Проверяем крит
        if (Math.random() < critChance) {
            isUserCrit = true;
            userDamage *= critMultiplier;
        }

        battleState.enemyHealth -= userDamage;
        if (battleState.enemyHealth < 0) battleState.enemyHealth = 0;

        enemyLifeText.textContent = battleState.enemyHealth;
        enemyBarHealth.style.width = (battleState.enemyHealth / battleState.enemyMaxHealth) * 100 + '%';

        pageForLogs.insertAdjacentHTML(
            'afterbegin',
            `<div class="logBattle">
            <span class="logBattle__name">${currentUser.user}</span> ${isUserCrit ? '<b>CRIT!</b> ' : ''}hits 
            <span class="logBattle__name">${savedEnemy.name}</span> in 
            <span class="logBattle__zone">${userAttackZone}</span>, dealing 
            <span class="logBattleDamage">${userDamage}</span> damage! 
            <span class="logBattle__name">${savedEnemy.name}</span>'s health: 
            <span class="logBattle__currentHealth">${enemyLifeText.textContent}</span>
        </div><div><br></div>`
        );
    } else {
        pageForLogs.insertAdjacentHTML(
            'afterbegin',
            `<div class="logBattle"><span class="logBattle__name">${currentUser.user}</span>'s strike to 
            <span class="logBattle__zone">${userAttackZone}</span> was blocked! 
            <span class="logBattle__name">${savedEnemy.name}</span>'s health: 
            <span class="logBattle__currentHealth">${enemyLifeText.textContent}</span>
        </div><div><br></div>`
        );
    }


    // Логика атаки противника
    const currentDefenseZone = [...defenseArea].map(el => el.value);
    let isEnemyCrit = false;

    enemyCurrentAttack.forEach(zone => {
        if (!currentDefenseZone.includes(zone) || Math.random() < ignoreBlockChance) {
            let hitDamage = savedEnemy.damage;

            // Проверяем крит для удара врага
            if (Math.random() < critChance) {
                isEnemyCrit = true;
                hitDamage *= critMultiplier;
            }

            enemyDamage += hitDamage;
        }
    });

    if (enemyDamage > 0) {
        battleState.userHealth -= enemyDamage;
        if (battleState.userHealth < 0) battleState.userHealth = 0;

        userLifeText.textContent = battleState.userHealth;
        userBarHealth.style.width = (battleState.userHealth / currentUser.health) * 100 + '%';

        pageForLogs.insertAdjacentHTML(
            'afterbegin',
            `<div class="logBattle">
            <span class="logBattle__name">${savedEnemy.name}</span> ${isEnemyCrit ? '<b>CRIT!</b> ' : ''}strikes with 
            <span class="logBattleDamage">${enemyDamage}</span> damage at 
            <span class="logBattle__zone">${enemyCurrentAttack.join(', ')}</span>! 
            <span class="logBattle__name">${currentUser.user}</span>'s health: 
            <span class="logBattle__currentHealth">${userLifeText.textContent}</span>
        </div>`
        );
    } else {
        pageForLogs.insertAdjacentHTML(
            'afterbegin',
            `<div class="logBattle"><span class="logBattle__name">${savedEnemy.name}</span>'s attack aimed at 
            <span class="logBattle__zone">${enemyCurrentAttack.join(', ')}</span> was completely deflected! 
            <span class="logBattle__name">${currentUser.user}</span>'s health: 
            <span class="logBattle__currentHealth">${userLifeText.textContent}</span>
        </div>`
        );
    }



    // Завершение боя
    if (battleState.enemyHealth <= 0 || battleState.userHealth <= 0) {
        const playerWon = battleState.enemyHealth <= 0;
        alert(`Бой окончен, победа за: ${playerWon ? currentUser.user : savedEnemy.name}`);

        if (playerWon) {
            currentUser.win += 1;
        } else {
            currentUser.loses += 1;
        }

        // Сохраняем профиль игрока с результатом битвы
        localStorage.setItem('userSetting', JSON.stringify(currentUser));

        // Сбрасываем здоровье игрока и подбираем нового противника
        battleState.userHealth = currentUser.health;

        const newEnemy = enemyList[Math.floor(Math.random() * enemyList.length)];
        battleState.enemyHealth = newEnemy.health;
        battleState.enemyMaxHealth = newEnemy.health;
        localStorage.setItem('currentEnemy', JSON.stringify(newEnemy));

        // Перезагрузка страницы
        localStorage.setItem('battleState', JSON.stringify(battleState));
        window.location.href = 'battle.html';
        return;
    }

    // Сохраняем состояние боя в localStorage(для восстановления состояния боя) 
    localStorage.setItem('battleState', JSON.stringify(battleState));
});
