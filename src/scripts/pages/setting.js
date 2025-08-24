// Берём данные с localStorage
const currentUser = JSON.parse(localStorage.getItem('userSetting'));

// Динамически меняем значение имени на текущее из localStorage
const userName = document.querySelector('.setting__userName');
userName.textContent = currentUser.user;

// Работа с формой для изменения имени
const formUserName = document.querySelector('.setting__formChangeUserName'); // форма

// Записи нового значения имени в localStorage и применение на текущей странице.
function changeUserName (newUserName) {
    currentUser.user = newUserName;
    localStorage.setItem('userSetting', JSON.stringify(currentUser));
    userName.textContent = currentUser.user
}

formUserName.addEventListener('submit', (e) => {
    e.preventDefault();

    const inputNewUserNameArea = document.querySelector('.settingNewUserName').value.trim(); // Значение в поле input

    if (inputNewUserNameArea) {
        changeUserName (inputNewUserNameArea); // вызов функции, подставляем из переменной полученной выше новое имя
    } else {
        return;
    }
})