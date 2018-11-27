VK.init({
    apiId: 6764240
});


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
auth()
    .then(() => {
        console.log('Авторизація пройшла успішно!');
        return callAPI('friends.get', {
            fields: 'name, lastname, photo_100',
            count: '50'
        }); //список друзів
    })
    .then((friends) => {
        for (let i = 0; i < friends.items.length; i++){
            let ul = document.querySelector('.left-list').querySelector('.friends-list');
            let element = createLi(friends.items[i].first_name, friends.items[i].last_name, friends.items[i].photo_100);
            ul.appendChild(element);
        }
    });

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
    i.classList.add('add');
    i.classList.add('fas');
    i.classList.add('fa-plus');


    li.appendChild(img);
    li.appendChild(span);
    li.appendChild(i);


    return li;
}

/* Переміщення по списках*/
function changeList(element) {
    const filter_friend = document.querySelector('.right-list').querySelector('.friends-list');
    const all_friend = document.querySelector('.left-list').querySelector('.friends-list');
    let i = element.querySelector('i');
    
    if(i.classList.contains('add')){
        i.classList.remove('add','fas','fa-plus');
        i.classList.add('delete','fas','fa-times');
        filter_friend.appendChild(i.parentNode);
        return 0;
    }

    if(i.classList.contains('delete')){
       i.classList.remove('delete','fas','fa-times');
            i.classList.add('add','fas','fa-plus');
            all_friend.appendChild(i.parentNode);
         return 0;
       }
}


document.addEventListener('click', (e) => {
    if (e.target.tagName == 'I') {
        changeList(e.target.parentNode);//функціонал кнопок '+' 'x'
    }
});

/* Dnd */
const left = document.querySelector('.left-list');
const right = document.querySelector('.right-list');
makeDnD([left, right])
function makeDnD(zones){
    let currentDrag;
    
    zones.forEach(zone =>{
       zone.addEventListener('dragstart', (e)=>{
           e.dataTransfer.setData('text/html', 'dragstart');
           currentDrag = {source : zone, node: e.target };
       }); 
       zone.addEventListener('dragover',(e)=>{
           e.preventDefault();
       });
       zone.addEventListener('drop',(e)=>{
           if(currentDrag){
               e.preventDefault();
           if(currentDrag.source !== zone){
               if(e.target.classList.contains('friends-list') || e.target.classList.contains('list-item'))
               changeList(currentDrag.node);
           }
           }
           
       });
    });
}


/***** Filter *****/
const input_all = document.querySelector('.input-block').querySelector('.friend');
const input_filter = document.querySelector('.input-block').querySelector('.filter');


input_all.addEventListener('keyup', function (e) {
    const listTable = document.querySelector('.left-list').querySelector('.friends-list');
    let array_name = listTable.querySelectorAll('span');
    for(let name of array_name){
        let result = isMatching(name.textContent,e.target.value);
        if(result){
            name.parentNode.classList.remove('hide');
        }else{
            name.parentNode.classList.add('hide');
        }
    }
});


input_filter.addEventListener('keyup', function (e) {
    const listTable = document.querySelector('.right-list').querySelector('.friends-list');
    let array_name = listTable.querySelectorAll('span');
    for(let name of array_name){
        let result = isMatching(name.textContent,e.target.value);
        if(result){
            name.parentNode.classList.remove('hide');
        }else{
            name.parentNode.classList.add('hide');
        }
    }
});


function isMatching(full, chunk) {
    return full.toUpperCase().includes(chunk.toUpperCase());
}


































//function sort(){
//    const ul_list = document.querySelector('.right-list');
//
//var callback = function (allmutations){
//    allmutations.map(function(mr){
//       let array = mr.target.querySelectorAll('li');
//        for(let i of array){
//            console.log(i);
//        }
//        console.log(typeof(array));
//    });
//}
//
//
//mo = new MutationObserver(callback),
//    options = {
//    'childList': true,
//    'subtree': true
//}
//
//mo.observe(ul_list, options);
//}







