const currentUser = JSON.parse(localStorage.getItem('userSetting'));

console.log(currentUser);

const userAvatar = document.querySelector('.profile__userPicture-avatar');

userAvatar.src = currentUser.avatar;

const userName = document.querySelector('.profile__userName');
userName.textContent = currentUser.user;

const profilePicture = document.querySelector('.profile__userPicture');

const profileInfo = document.querySelector('.profile__info');

const popupActive = document.querySelector('.profile__popup');

const allPicture = document.querySelectorAll('.profile__popup img');

function changeVisiblePageArea(a, b, c) {
    profilePicture.style.opacity = a;
    profileInfo.style.opacity = a;
    popupActive.style.opacity = b;
    popupActive.style.pointerEvents = c;
}

profilePicture.addEventListener('click', () => {
    changeVisiblePageArea('0', '1', 'all');
})

allPicture.forEach((img) => {
    img.addEventListener('click', (e) => {
        changeVisiblePageArea('1', '0', 'none');
    }
    )
})

popupActive.addEventListener('click', (e) => {
    const clickedImg = e.target;

    if (clickedImg.tagName == 'IMG') {
        switch (clickedImg.dataset.avatar) {
            case '1':
                userAvatar.src = '/src/assets/avatars/default.jpg';
                currentUser.avatar = '/src/assets/avatars/default.jpg';
                break;
            case '2':
                userAvatar.src = '/src/assets/avatars/ghost.jpg';
                currentUser.avatar = '/src/assets/avatars/ghost.jpg';
                break;
            case '3':
                userAvatar.src = '/src/assets/avatars/man_1.jpg';
                currentUser.avatar = '/src/assets/avatars/man_1.jpg';
                break;
            case '4':
                userAvatar.src = '/src/assets/avatars/man_2.jpg';
                currentUser.avatar = '/src/assets/avatars/man_2.jpg';
                break;
            case '5':
                userAvatar.src = '/src/assets/avatars/man_3.jpg';
                currentUser.avatar = '/src/assets/avatars/man_3.jpg';
                break;
            case '6':
                userAvatar.src = '/src/assets/avatars/women_1.jpg';
                currentUser.avatar = '/src/assets/avatars/women_1.jpg';
                break;
            case '7':
                userAvatar.src = '/src/assets/avatars/women_3.jpg';
                currentUser.avatar = '/src/assets/avatars/women_3.jpg';
                break;
            case '8':
                userAvatar.src = '/src/assets/avatars/women_2.jpg';
                currentUser.avatar = '/src/assets/avatars/women_2.jpg';
                break;

            default:
                return;

        }

        localStorage.setItem('userSetting', JSON.stringify(currentUser));
    }
})