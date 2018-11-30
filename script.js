VK.init({
    apiId: 6764240
});

if (localStorage.data) {
    //якщо є збереження то відтворити їх
    const data = JSON.parse(localStorage.data || '{}');
    const filter_friend = document.querySelector('.right-list').querySelector('.friends-list');
    const all_friend = document.querySelector('.left-list').querySelector('.friends-list');

    filter_friend.innerHTML = data.filter_friend;
    all_friend.innerHTML = data.all_friend;
} else {
    //якщо не було збережень то загрузити друзів
    loadFriends();
}

/* авторизація VK */
function auth() {
    return new Promise((resolve, reject) => {
        VK.Auth.login(data => {
            if (data.session) {
                resolve();
            } else {
                reject(new Error('Не вдається авторизуватися!'));
            }
        }, 2);
    });
}

/* шаблон методів VK API*/
function callAPI(method, params) {
    params.v = '5.92';

    return new Promise((resolve, reject) => {
        VK.api(method, params, (data) => {
            if (data.error) {
                reject(data.error);
            } else {
                resolve(data.response);
            }
        });
    });
}

/* відображення в списку друзів*/
function loadFriends() {
    auth()
        .then(() => {
            console.log('Авторизація пройшла успішно!');
            return callAPI('friends.get', {
                fields: 'name, lastname, photo_100',
                count: '50'
            }); //список друзів
        })
        .then((friends) => {
            for (let i = 0; i < friends.items.length; i++) {
                let ul = document.querySelector('.left-list').querySelector('.friends-list');
                let element = createLi(friends.items[i].first_name, friends.items[i].last_name, friends.items[i].photo_100);
                ul.appendChild(element);
            }
        });
}

/* cтворення LI*/
function createLi(name, lastName, photo) {
    let li = document.createElement('li');
    li.classList.add('list-item');
    li.draggable = true;


    let img = document.createElement('img');
    img.classList.add('avatar');
    img.src = photo;

    let span = document.createElement('span');
    span.innerHTML = name + ' ' + lastName;

    let i = document.createElement('i');
    i.classList.add('add','fas','fa-plus');

    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(i);
    return li;
}

/* Переміщення по списках*/
function changeList(element) {
    const filter_friend = document.querySelector('.right-list').querySelector('.friends-list');
    const all_friend = document.querySelector('.left-list').querySelector('.friends-list');
    const input_all = document.querySelector('.input-block').querySelector('.friend').querySelector('input');
    const input_filter = document.querySelector('.input-block').querySelector('.filter').querySelector('input');
    let i = element.querySelector('i');


    //нажато +(add)
    if (i.classList.contains('add')) {
        i.classList.remove('add', 'fas', 'fa-plus');
        i.classList.add('delete', 'fas', 'fa-times');
        //перевірка чи є щось у фільтрі
        if (input_filter.value) {
            i.parentNode.classList.add('hide');
        }
        filter_friend.appendChild(i.parentNode);
        filterList();
        return 0;
    }



    //нажато Х(delete)
    if (i.classList.contains('delete')) {
        i.classList.remove('delete', 'fas', 'fa-times');
        i.classList.add('add', 'fas', 'fa-plus');
        if (input_all.value) {
            i.parentNode.classList.add('hide'); //перевірка чи є щось у фільтрі
        }
        all_friend.appendChild(i.parentNode);
        filterList();
        return 0;
    }
}


document.addEventListener('click', (e) => {
    if (e.target.tagName == 'I') {
        changeList(e.target.parentNode); //функціонал кнопок '+' 'x'
    }
});

/* Dnd */
const left = document.querySelector('.left-list');
const right = document.querySelector('.right-list');
makeDnD([left, right])

function makeDnD(zones) {
    let currentDrag;

    zones.forEach(zone => {
        zone.addEventListener('dragstart', (e) => {
            e.dataTransfer.setData('text/html', 'dragstart');
            currentDrag = {
                source: zone,
                node: e.target
            };
        });
        zone.addEventListener('dragover', (e) => {
            e.preventDefault();
        });
        zone.addEventListener('drop', (e) => {
            if (currentDrag) {
                e.preventDefault();
                //чи маємо ми щось з мишкою
                if (currentDrag.source !== zone) {
                    //чи знаходиться над списками
                    if (e.target.classList.contains('friends-list') || e.target.classList.contains('list-item')) {
                        changeList(currentDrag.node);
                    }
                }
            }

        });
    });
}



/***** Filter *****/
const input_all = document.querySelector('.input-block').querySelector('.friend').querySelector('input');
const input_filter = document.querySelector('.input-block').querySelector('.filter').querySelector('input');

input_all.addEventListener('keyup', function (e) {
    const listTable = document.querySelector('.left-list').querySelector('.friends-list');
    let array_name = listTable.querySelectorAll('span');
    for (let name of array_name) {
        let result = isMatching(name.textContent, e.target.value);
        if (result) {
            name.parentNode.classList.remove('hide');
        } else {
            name.parentNode.classList.add('hide');
        }
    }
});

input_filter.addEventListener('keyup', function (e) {
    const listTable = document.querySelector('.right-list').querySelector('.friends-list');
    let array_name = listTable.querySelectorAll('span');
    for (let name of array_name) {
        let result = isMatching(name.textContent, e.target.value);
        if (result) {
            name.parentNode.classList.remove('hide');
        } else {
            name.parentNode.classList.add('hide');
        }
    }
});

function isMatching(full, chunk) {
    return full.toUpperCase().includes(chunk.toUpperCase());
};


/****** Local Storage ******/
const save_btn = document.querySelector('.btn-save');
var storage = localStorage;


/**** Зберегти дані */ ///
save_btn.addEventListener('click', (e) => {
    const filter_friend = document.querySelector('.right-list').querySelector('.friends-list');
    const all_friend = document.querySelector('.left-list').querySelector('.friends-list');

    check(); //якщо є щось у фільрах збереження не відбудеться
    function check() {
        if (input_all.value !== '' || input_filter.value !== '') {
            alert('Очитіть поля фільтрації');
            return 0;
        } else {
            storage.data = JSON.stringify({
                filter_friend: filter_friend.innerHTML,
                all_friend: all_friend.innerHTML
            });
        }
    }
});




/****Фільтрація списків ****/
function filterList() {
    // елементи в списках 
    const array_all_friend = document.querySelector('.left-list').querySelector('.friends-list').querySelectorAll('li');
    const array_filter_friend = document.querySelector('.right-list').querySelector('.friends-list').querySelectorAll('li');
    //ul
    const all_friend = document.querySelector('.left-list').querySelector('.friends-list');
    const filter_friend = document.querySelector('.right-list').querySelector('.friends-list');

    let all_array = [];
    let filter_array = [];

    //конвертація
    for (let li of array_all_friend) {
        all_array.push(li);
    }
    for (let li of array_filter_friend) {
        filter_array.push(li);
    }

    //сортування
    all_array.sort((a, b) => {
        return a.innerText > b.innerText ? 1 : -1;
    });
    filter_array.sort((a, b) => {
        return a.innerText > b.innerText ? 1 : -1;
    });
    //відображення на сторінці
    all_array.forEach((element) => {
        all_friend.appendChild(element);
    });
    filter_array.forEach((element) => {
        filter_friend.appendChild(element);
    });
}