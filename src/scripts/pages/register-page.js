const alreadyRegistered = localStorage.getItem('userSetting');

if (alreadyRegistered) {
    window.location.href = 'index.html';
}

const saveUserName = document.querySelector('.main__userRegisterForm');

saveUserName.addEventListener('submit', (e) => {
    e.preventDefault();

    let userName = document.querySelector('#user-name').value.trim();

    if (!userName) {
        return console.log('user name error');
    }

    const userSetting = {
        'user': userName,
        'avatar': 'default.png',
        'win': '0',
        'loses': 'O',
        'logs': [],
    }

    setUserSetting(userSetting);

    window.location.href = 'index.html';
})