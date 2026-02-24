const myLibrary = [];

function Book(title, author, pages, genre, read) {
    this.id = crypto.randomUUID();
    this.title = title;
    this.author = author;
    this.pages = pages;
    this.genre = genre;
    this.read = read;
}

Book.prototype.toggleRead = function() {
    this.read = !this.read;
};

function saveLibrary() {
    localStorage.setItem('myLibrary', JSON.stringify(myLibrary));
}

function loadLibrary() {
    const stored = localStorage.getItem('myLibrary');
    if (stored) {
        const parsed = JSON.parse(stored);
        // Reconstruct Book objects
        myLibrary.length = 0; // Clear array
        parsed.forEach(bookData => {
            const book = new Book(bookData.title, bookData.author, bookData.pages, bookData.genre, bookData.read);
            book.id = bookData.id; // Preserve ID
            myLibrary.push(book);
        });
    }
}

function addBookToLibrary(title, author, pages, genre, read) {
    const newBook = new Book(title, author, pages, genre, read);
    myLibrary.push(newBook);
    saveLibrary();
    displayBooks();
}

function displayBooks() {
    const bookGrid = document.getElementById('bookGrid');
    bookGrid.innerHTML = '';

    myLibrary.forEach(book => {
        const bookCard = document.createElement('div');
        bookCard.className = 'book-card';
        bookCard.setAttribute('data-id', book.id);
        bookCard.innerHTML = `
            <div class="book-info">
                <h3>${book.title}</h3>
                <p><strong>Author:</strong> ${book.author}</p>
                <p><strong>Pages:</strong> ${book.pages}</p>
                <p><strong>Genre:</strong> ${book.genre}</p>
                <p><strong>Read:</strong> ${book.read ? 'Yes' : 'No'}</p>
                <button class="remove-btn">Remove</button>
                <button class="toggle-read-btn">${book.read ? 'Mark as Unread' : 'Mark as Read'}</button>
            </div>
        `;
        bookGrid.appendChild(bookCard);
    });

    // Add event listeners to buttons
    document.querySelectorAll('.remove-btn').forEach(btn => {
        btn.addEventListener('click', removeBook);
    });

    document.querySelectorAll('.toggle-read-btn').forEach(btn => {
        btn.addEventListener('click', toggleReadStatus);
    });
}

function removeBook(e) {
    const bookId = e.target.closest('.book-card').getAttribute('data-id');
    const index = myLibrary.findIndex(book => book.id === bookId);
    if (index > -1) {
        myLibrary.splice(index, 1);
        saveLibrary();
        displayBooks();
    }
}

function toggleReadStatus(e) {
    const bookId = e.target.closest('.book-card').getAttribute('data-id');
    const book = myLibrary.find(book => book.id === bookId);
    if (book) {
        book.toggleRead();
        saveLibrary();
        displayBooks();
    }
}

// Initialize the page
document.addEventListener('DOMContentLoaded', () => {
    loadLibrary();
    displayBooks();

    // Add some sample books if library is empty
    if (myLibrary.length === 0) {
        addBookToLibrary("The Great Gatsby", "F. Scott Fitzgerald", 180, "Fiction", true);
        addBookToLibrary("To Kill a Mockingbird", "Harper Lee", 281, "Fiction", false);
        addBookToLibrary("1984", "George Orwell", 328, "Dystopian", true);
    }

    // Dialog functionality
    const dialog = document.getElementById('bookDialog');
    const newBookBtn = document.getElementById('newBookBtn');
    const cancelBtn = document.getElementById('cancelBtn');
    const bookForm = document.getElementById('bookForm');

    newBookBtn.addEventListener('click', () => {
        dialog.showModal();
    });

    cancelBtn.addEventListener('click', () => {
        dialog.close();
    });

    bookForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const pages = parseInt(document.getElementById('pages').value);
        const genre = document.getElementById('genre').value;
        const read = document.getElementById('read').checked;

        addBookToLibrary(title, author, pages, genre, read);
        bookForm.reset();
        dialog.close();
    });
});