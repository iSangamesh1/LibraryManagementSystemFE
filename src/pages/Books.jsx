import { useEffect, useState } from "react";
import { Navigate, useNavigate } from "react-router-dom";
import "./Books.css"
import { getAllBooks, addBook, updateBook, deleteBook } from "../services/bookService";

function Books() {

    // const books = [
    //     {
    //         id: 1,
    //         title: "Java: The Complete Reference",
    //         author: "Herbert Schildt",
    //         category: "Programming",
    //         availableCopies: true,
    //     },
    //     {
    //         id: 2,
    //         title: "Spring in action",
    //         author: "Craig Walls",
    //         category: "Programming",
    //         availableCopies: false,
    //     },
    //     {
    //         id: 3,
    //         title: "Clean code",
    //         author: "Robert C. Martin",
    //         category: "Software Development",
    //         availableCopies: true,
    //     }
    // ];

    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";
    const navigate = useNavigate();

    const [books, setBooks] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [editingBook, setEditingBook] = useState(null)
    const [formData, setFormData] = useState({
        title: "",
        author: "",
        isbn: "",
        category: "",
        availableCopies: 0
    })
    const [searchText, setSearchText] = useState("");

    const handleBookClick = (bookId) => {
        navigate(`/borrow-records?bookId=${bookId}`);
    } 

    // When this Books component loads, call the API.
    useEffect(() => {
        getAllBooks()
            .then((response) => {
                setBooks(response.data)
        })
        .catch((error) => {
            console.log("Error fetching books:", error);
        });
    }, []); // [] It means the effect runs when the component initially mounts.

    const handleAddBook = () => {

        const newBook = {
            title: formData.title,
            author: formData.author,
            isbn: formData.isbn,
            category: formData.category,
            availableCopies: formData.availableCopies
        };

        addBook(newBook)
            .then((response) => { // if success then will execute
                console.log("Book added successfully:", response.data)

                setBooks([...books, response.data]);

                setFormData({
                    title: "",
                    author: "",
                    isbn: "",
                    category: "",
                    availableCopies: 0
                })

                setShowForm(false)
            })
            .catch((error) => { // if failure the error will execute
                console.error("Error adding book:", error);
            });
    };

    const handleDeleteButton = id => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this book?"
        );

        if(!confirmed) {
            return;
        }

        deleteBook(id)
            .then(() => {
                console.log("Book deleted successfully")

                setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id));
                // if we delete id=2, then Book -> 2 !== 2 -> false -> remove, hence new state has id, 1,3,4...
                // react sees that books chnaged and automatically re-renders the table

                // this means takes whatever the latest book state is and remove the boook whose ID matches this id
            })
            .catch((error) => {
                console.log("Error deleting book: ", error.response?.data || error);

                alert(error.response?.data?.message || 
                    "Failed to delete book"
                );
            });
    }

    const filteredBooks = books.filter((book) => 
        book.title.toLowerCase().includes(searchText.toLocaleLowerCase()) ||
        book.author.toLowerCase().includes(searchText.toLowerCase())
    );

    return(
        <div className="books-page">

            <div className="books-header">
                <div>
                    <h1>Books</h1>
                    <button>Manage all books in the library.</button>
                </div>
                {isAdmin && 
                    <button className="add-book-button"
                    onClick={() => setShowForm(true)}>
                        + Add Book
                    </button>
                }   
            </div>
            <div className="search-container">
            Search for book you want: 
                <input
                    type="text"
                    placeholder="Search by title or author"
                    value={searchText}
                    onChange={(e) => setSearchText(e.target.value)}
                />
            </div>
            {showForm && (
                    <div className="add-book-form">
                        <h2>{editingBook ? "Edit Book" : "Add New Book"}</h2>

                        <input
                            type="text"
                            placeholder="Title"
                            value={formData.title}
                            onChange={(e) => 
                                setFormData({
                                    ...formData,
                                    title: e.target.value
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Author"
                            value={formData.author}
                            onChange={(e) => 
                                setFormData({
                                    ...formData,
                                    author: e.target.value
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="ISBN"
                            value={formData.isbn}
                            onChange={(e) => 
                                setFormData({
                                    ...formData,
                                    isbn: e.target.value
                                })
                            }
                        />
                        <input
                            type="text"
                            placeholder="Category"
                            value={formData.category}
                            onChange={(e) => 
                                setFormData({
                                    ...formData,
                                    category: e.target.value
                                })
                            }
                        />
                        <input
                            type="number"
                            placeholder="Available Copies"
                            value={formData.availableCopies}
                            onChange={(e) => 
                                setFormData({
                                    ...formData,
                                    availableCopies: Number(e.target.value) // HTML input returns their value as string, even when typr=number
                                })
                            }
                        />
                        <div>
                            <button onClick={() => {
                                    setShowForm(false)
                                    setEditingBook(null)
                                }}>
                                Cancel
                            </button>

                        {/* <button onClick={handleAddBook}>
                            Add Book
                        </button> */}

                            <button 
                                onClick={ () => {
                                    if (editingBook) {
                                        updateBook(editingBook.id, formData)
                                            .then(() => {
                                                // console.log(formData)
                                                return getAllBooks() // we need retunr here so that we can pass the value to the next .then()
                                            })
                                            .then((response) => { // response of getAllBooks will be passed here
                                                console.log("Book edited successfully:", response.data)
                                                setBooks(response.data);
                                                setEditingBook(null);
                                                setShowForm(false)
                                            })
                                            .catch((error) => {
                                                console.error("Error updating book:", error)
                                            });
                                    } else {
                                        handleAddBook();
                                    }
                                }}>
                                {editingBook ? "Update Book" : "Add Book"}
                            </button>
                        </div>
                        {/* it will tell us the o/p */}
                        {/* <prep>{JSON.stringify(formData, null, 3)}</prep> */}
                    </div>
            )}
            <table className="books-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Title</th>
                        <th>Author</th>
                        <th>ISBN</th>
                        <th>Category</th>
                        <th>Available Copies</th>
                        <th>Status</th>
                        { isAdmin && <th>Actions</th> }
                    </tr>
                </thead>
                <tbody>
                    {filteredBooks.map((book) => (
                        <tr key={book.id}>
                            <td>{book.id}</td>
                            <td><button className="title-button-class" onClick={() => handleBookClick(book.id)}>{book.title}</button></td>
                            <td>{book.author}</td>
                            <td>{book.isbn}</td>
                            <td>{book.category}</td>
                            <td>{book.availableCopies}</td>
                            <td>{book.availableCopies > 0 ? "Available" : "Issued"}</td>
                            { isAdmin && <td>
                                
                                    <button onClick={() => { 
                                        setEditingBook(book);
                                        setFormData({
                                            title: book.title,
                                            author: book.author,
                                            isbn: book.isbn,
                                            category: book.category,
                                            availableCopies: book.availableCopies
                                        });
                                        setShowForm(true);
                                    }}>
                                        Edit
                                    </button>
                                    <button onClick={() => handleDeleteButton(book.id)}>
                                        Delete
                                    </button>
                                </td>
                            }
                        </tr>
                    ))}
                </tbody>
            </table>

        </div>
    )
}

export default Books;