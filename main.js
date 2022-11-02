let book_list = [];
const RENDER_EVENT = 'render_books'

document.addEventListener('DOMContentLoaded', function() {
    let book = [];
    const submitBook = document.getElementById('inputBook');
    submitBook.addEventListener('submit', function(event) {
        event.preventDefault();
        addBook();
    });
    if(isStorageExist()){
        loadDataLocalStorage();
    }
});

function addBook (){
    const titleBook = document.getElementById('inputBookTitle').value;
    const authorBook = document.getElementById('inputBookAuthor').value;
    const yearBook = document.getElementById('inputBookYear').value;
    const checkbox = document.getElementById('inputBookIsComplete');
    let completeBook;
    if(checkbox.checked){
        completeBook = true;
    } else {
        completeBook = false;
    }
    const isCompleted = completeBook;

    const generateID = generateId();
    const bookObject = generateBookObject(generateID, titleBook, authorBook, yearBook, isCompleted);

    book_list.push(bookObject);

    alert('Berhasil menambahkan buku..');

    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function generateId(){
    return +new Date();
}

function generateBookObject(id, title, author, year, isCompleted) {
    return {
        id, 
        title,
        author,
        year,
        isCompleted
    }
}

document.addEventListener(RENDER_EVENT, function() {
    const uncompletedBook = document.getElementById('incompleteBookshelfList');
    uncompletedBook.innerHTML = '';

    const completedBook = document.getElementById('completeBookshelfList');
    completedBook.innerHTML = '';

    for (const book of book_list){
        const bookElement = makeBook(book);
        if(book.isCompleted == true){
            completedBook.append(bookElement);
        } else {
            uncompletedBook.append(bookElement);
        }
    }
})

function makeBook(bookObject){
    const bookTitle = document.createElement('h3');
    bookTitle.innerText = bookObject.title;

    const bookAuthor = document.createElement('p');
    bookAuthor.innerText = `Penulis: ${bookObject.author}`;

    const bookYear = document.createElement('p');
    bookYear.innerText = `Tahun: ${bookObject.year} `;


    const articleContainer = document.createElement('article');
    articleContainer.classList.add('book_item');
    articleContainer.setAttribute('id', `id-${bookObject.id}`);
    articleContainer.append(bookTitle, bookAuthor, bookYear);
    
    const action = document.createElement('div');
    action.classList.add('action');
    if (bookObject.isCompleted == true) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('green');
        undoButton.innerText = 'Belum selesai dibaca'
    
        undoButton.addEventListener('click', function () {
            undoFromCompleted(bookObject.id);
        });
    
        const trashButton = document.createElement('button');
        trashButton.classList.add('red');
        trashButton.innerText = 'Hapus buku';
    
        trashButton.addEventListener('click', function () {
            const book = findBook(bookObject.id);
            const deleteBook = confirm('Hapus buku "' + book.title + '" karya ' + book.author + '?');
            if(deleteBook){
                removeBook(bookObject.id);
            } else  
            document.dispatchEvent(new Event(RENDER_EVENT));
        });
        
        action.append(undoButton, trashButton);
        articleContainer.append(action);

    } else { 
        const checkButton = document.createElement('button');
        checkButton.classList.add('green');
        checkButton.innerText = 'Selesai dibaca';
        
        checkButton.addEventListener('click', function () {
            addToCompleted(bookObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('red', 'delete');
        trashButton.innerText = 'Hapus buku';
    
        trashButton.addEventListener('click', function () {
            const book = findBook(bookObject.id);
            const deleteBook = confirm('Hapus buku "' + book.title + '" karya ' + book.author + '?');
            if(deleteBook){
                removeBook(bookObject.id);
            } else  
            document.dispatchEvent(new Event(RENDER_EVENT));
        });
        
        action.append(checkButton, trashButton);
        articleContainer.append(action);
    }
    
    return articleContainer;
}

function findBook(bookId) {
    for (const book of book_list) {
        if (book.id === bookId) {
            return book;
        }
    }
    return null;
}
    
function removeBook(bookId) {
    const bookIndex = findBookIndex(bookId);
    
    if (bookIndex === -1) return;
    
    book_list.splice(bookIndex, 1);
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function undoFromCompleted(bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;
    
    bookTarget.isCompleted = false;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

function findBookIndex(bookId){
    for(const index in book_list){
        if(book_list[index].id === bookId){
            return index;
        }
    }
    return -1;
}

function addToCompleted (bookId) {
    const bookTarget = findBook(bookId);
    
    if (bookTarget == null) return;
    
    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    saveData();
}

const SAVED_EVENT = 'saved-book';
const STORAGE_KEY = 'BOOKSHELF_APPS';

function saveData() {
    if (isStorageExist()) {
        const parsed = JSON.stringify(book_list);
        localStorage.setItem(STORAGE_KEY, parsed);
        document.dispatchEvent(new Event(SAVED_EVENT));
    }
}

function isStorageExist() {
    if (typeof (Storage) === undefined) {
        alert('Browser kamu tidak mendukung local storage');
        return false;
    }
    return true;
}

document.addEventListener(SAVED_EVENT, function () {
    console.log(localStorage.getItem(STORAGE_KEY));
});

function loadDataLocalStorage() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(savedData);

    if(data !== null){
        for(const book of data){
            book_list.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}

document.addEventListener('DOMContentLoaded', function() {
    const submitBook = document.getElementById('searchBook');
    submitBook.addEventListener('submit', function(event) {
        event.preventDefault();
        searchBook();
    });
    if(isStorageExist()){
        loadSearchedData();
    }
});

function searchBook(){
    const searched = document.getElementById('searchTheBook').value.toLowerCase();
    const list = book_list;
    console.log(list);
    console.log('you searched: '+searched);
    let searchResult = [];
    for(const book of book_list){
        const title = book.title.toLowerCase();
        const author = book.author.toLowerCase();
        if(title.includes(searched) || author.includes(searched)){
            searchResult.push(book);
        }
    }
    // if(searchResult.length > 0){
    //     book_list = searchResult;
    // } else book_list = list;
    
    document.dispatchEvent(new Event(RENDER_EVENT));
}

function loadSearchedData() {
    const savedData = localStorage.getItem(STORAGE_KEY);
    let data = JSON.parse(savedData);

    if(data !== null){
        for(const book of data){

            book_list.push(book);
        }
    }

    document.dispatchEvent(new Event(RENDER_EVENT));
}