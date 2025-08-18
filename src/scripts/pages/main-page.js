const alreadyRegistered = localStorage.getItem('userSetting');

if (!alreadyRegistered && !window.location.pathname.endsWith('register.html')) {
    window.location.href = 'register.html';
}

const result = JSON.parse(localStorage.getItem('userSetting'));
console.log(result);