// Регистрация пользователя
async function getRegistration() {
    const response = await fetch('https://jsonbox.ru/api.php?action=register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email: 'rubbersoul@rambler3.com'
        })
    });
    const data = await response.json();
    const apiKey = await data.api_key;
    console.log(`DATA: ${data}  API_KEY: ${apiKey}`);
};

//API_KEY: a10d7ba1eb7f9165f6fae49f4bffdac7


// getRegistration();

// Сохранение данных
async function putData(message) {
    await fetch('https://jsonbox.ru/api.php?action=store', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            api_key: 'a10d7ba1eb7f9165f6fae49f4bffdac7',
            data: { message }
        })
    });
};

// Получение данных
async function getData() {
    const result = await fetch(`https://jsonbox.ru/api.php?action=get&api_key=a10d7ba1eb7f9165f6fae49f4bffdac7`);
    const userData = await result.json();
    console.log(userData.data);
}

// putData();
// getData();

export { putData, getData, getRegistration };