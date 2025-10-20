const API_BASE = globalThis.__API_BASE__ || '';
document.getElementById('backButton').addEventListener('click', () => {
    if (globalThis.history.length > 1) {
        globalThis.history.back();
    } else {
        globalThis.location.href = "../home/home.html";
    }
});

document.getElementById('messageIcon').addEventListener('click', () => {
    globalThis.location.href = "../chat/chat.html";
});


document.getElementById('backButton').addEventListener('click', () => {
    if (globalThis.history.length > 1) {
        globalThis.history.back();
    } else {
        globalThis.location.href = "../home/home.html";
    }
});

document.getElementById('messageIcon').addEventListener('click', () => {
    globalThis.location.href = "../chat/chat.html";
});

