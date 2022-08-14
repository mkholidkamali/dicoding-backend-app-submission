const books = require('./books');
const { nanoid } = require('nanoid');
const { response } = require('@hapi/hapi/lib/validation');

const addBookHandler = (request, h) => {
    // Read From request body
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    // Prepare data from server
    const id = nanoid();
    const finished = pageCount === readPage ? true : false;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    // 1: Name is Empty Response
    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku'
        })
        .code(400);
    }
    // 2: Read page > pageCount Response
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount'
        })
        .code(400);
    }

    // Prepare new Books
    const book = {
        id,name, year, author, summary, publisher, pageCount, readPage, finished, reading, insertedAt, updatedAt
    };

    // Insert New Books
    books.push(book);

    // Validate new Book
    const isSuccess = books.filter((b) => b.id === id).length > 0;

    // 3: Success Response
    if (isSuccess) {
        return h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id
            }
        })
        .code(201);
    }

    // 4: Generic error Response
    return h.response({
        status: 'error',
        message: 'Buku gagal ditambahkan',
    })

};

const getAllBookHandler = (request, h) => {

    // Get Query Params
    const { name, reading, finished } = request.query;

    // Get by Name
    if (name !== undefined) {
        const book = books.filter((b) => b.publisher == name);
        return h.response({
            status: 'success',
            data: {
                books: book.map((n) => ({
                    id: n.id,
                    name: n.name,
                    publisher: n.publisher
                }))
            }
        })
        .code(200);
    }

    // Get by reading state
    if (reading !== undefined) {
        if (reading === 0) {
            const book = books.filter((b) => b.reading == false);
            return h.response({
                status: 'success',
                data: {
                    books: book.map((n) => ({
                        id: n.id,
                        name: n.name,
                        publisher: n.publisher
                    }))
                }
            })
            .code(200);
        } else if (reading === 1) {
            const book = books.filter((b) => b.reading == true);
            return h.response({
                status: 'success',
                data: {
                    books: book.map((n) => ({
                        id: n.id,
                        name: n.name,
                        publisher: n.publisher
                    }))
                }
            })
            .code(200);
        }
    }

    // Get by finished state
    if (finished !== undefined) {
        if (finished === 0) {
            const book = books.filter((b) => b.finished == false);
            return h.response({
                status: 'success',
                data: {
                    books: book.map((n) => ({
                        id: n.id,
                        name: n.name,
                        publisher: n.publisher
                    }))
                }
            })
            .code(200);
        } else if (finished === 1) {
            const book = books.filter((b) => b.finished == true);
            return h.response({
                status: 'success',
                data: {
                    books: book.map((n) => ({
                        id: n.id,
                        name: n.name,
                        publisher: n.publisher
                    }))
                }
            })
            .code(200);
        }
    }

    // Response without query params
    return h.response({
        status: 'success',
        data: {
            books: books.map((n) => ({
                id: n.id,
                name: n.name,
                publisher: n.publisher
            }))
        }
    })
    .code(200);
};

const getBookByIdHandler = (request, h) => {
    // Get Book id from url parameter
    const { bookId } = request.params;
    
    // Filter Book using Book id
    const book = books.filter((b) => b.id === bookId)[0];
    
    // Success Response
    if(book !== undefined) {
        return h.response({
            status: 'success',
            data: {
                book
            }
        })
        .code(200);
    }
    
    // Not Found Response
    return h.response({
        status: 'fail',
        message: 'Buku tidak ditemukan'
    })
    .code(404);
};

const editBookByIdHandler = (request, h) => {
    // Get Book id from url parameter
    const { bookId } = request.params;

    // Get body request
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;

    // Prepare data from server
    const updatedAt = new Date().toISOString();

    // 1: Name is empty Response
    if (name === undefined) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku'
        })
        .code(400);
    }
    
    // 2: readPage > pageCount Response
    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount'
        })
        .code(400);
    }

    // Filter Book using Book id
    const index = books.findIndex((b) => b.id === bookId);

    // Validate 
    if (index !== -1) {
        // Update Book
        books[index] = {
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading, 
            updatedAt
        };

        // 3: Success Response
        return h.response({
            status: 'success',
            message: 'Buku berhasil diperbarui'
        })
        .code(200);
    }

    // 4: Id not found Response
    return h.response({
        status: 'fail',
        message: 'Gagal memperbarui buku. Id tidak ditemukan'
    })
    .code(404);
};

const deleteBookByIdHandler = (request, h) => {
    // Get Book id from url parameter
    const { bookId } = request.params;

    // Filter Book using Book id
    const index = books.findIndex((b) => b.id === bookId);

    if (index !== -1) {
        // Remove Book
        books.splice(index, 1);

        // Success Response
        return h.response({
            status: 'success',
            message: 'Buku berhasil dihapus'
        })
        .code(200);
    }

    // Id Not Found Response
    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan'
    })
    .code(404);
};

module.exports = { 
    addBookHandler,
    getAllBookHandler,
    getBookByIdHandler,
    editBookByIdHandler,
    deleteBookByIdHandler
};