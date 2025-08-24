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
    },

        lord: {
        name: 'Lord',
        avatar: './src/assets/avatars/enemy_2.jpg',
        attack: 1,
        defense: 2,
        health: 150,
    },

    greatValuar: {
        name: 'Great Valuar',
        avatar: './src/assets/avatars/enemy_3.jpg',
        attack: 2,
        defense: 2,
        health: 200,
    },
}

const enemyList = [enemy.zombi, enemy.lord, enemy['Great Valuar']];
console.log(enemyList);

const enemyCurrent = enemyList[Math.floor(Math.random() * enemyList.length)];

console.log (enemyCurrent);

const enemyName = document.querySelector('.battle__enemyPage_name');
const enemyPicture = document.querySelector('.battle__enemyPage_avatar img');

enemyName.textContent = enemyCurrent.name;
enemyPicture.src = enemyCurrent.avatar;