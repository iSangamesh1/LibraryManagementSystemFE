import { useEffect, useState } from "react";
import "./BorrowRecords.css"
import { addBorrowRecord, getAllBorrowRecords, updateBorrowRecord, returnBorrowRecord, deleteBorrowRecord } from "../services/borrowRecordService";
import { getAllBooks } from "../services/bookService";
import { useSearchParams } from "react-router-dom";

function BorrowRecords() {


    const role = localStorage.getItem("role");
    const isAdmin = role === "ADMIN";

    const [borrowRecords, setBorrowRecords] = useState([])
    const [books, setBooks] = useState([]);
    const [statusFilter, setStatusFilter] = useState("ALL")

    // Controls weather the Add borrow record form is visible
    const [showForm, setShowForm] = useState(false);
    const [editingRecord, setEditingRecord] = useState(null);

    const [formData, setFormData] = useState({
        bookId: "",
        memberName: "",
        memberEmail: "",
    });

    const [searchParams] = useSearchParams();
    const bookId = searchParams.get("bookId");

   
//  get borrow records
    const loadBorrowRecords = () => {
        getAllBorrowRecords()
            .then((response) => {
                console.log("Borrow records:", response.data);
                setBorrowRecords(response.data)
            })
            .catch((error) => {
                console.log("Error fetching borrow records:", error);
            })
    };

// Get books
    const loadBooks = () => {
        getAllBooks()
            .then((response) => {
                setBooks(response.data);
            })
            .catch((error) => {
                console.log("Error fetching books", error)
            })
    };

    // Run when page loads
    useEffect(() => {
        loadBorrowRecords();
        loadBooks();
    },[])

    // this useEffect will help when,for admin when the page loads and we need to select + add borrow record, at that time there is no need to click on select book, defaultly it will be selected by this useEffect
    useEffect(() => {
        if(bookId) {
            setFormData((currentData) => ({
                ...currentData,
                bookId: bookId
            }))
        }
    }, [bookId])

    // Handle form input changes
    const handleChange = (event) => {
        const {name, value} = event.target;

        setFormData({
            ...formData,
            [name]: value
        });
    };

    // this will send put request as we need to update only specific thing
    const handleEditBorrowRecord = (record) => {
        setEditingRecord(record);

        setFormData({
            bookId: record.book.id || "",
            memberName: record.memberName,
            memberEmail : record.memberEmail
        });

        setShowForm(true);
    }

    // Handle add borrow record
    const handleSubmit = (event) => {
        event.preventDefault();

        if(editingRecord) {
            const updateData = {
                memberName: formData.memberName,
                memberEmail: formData.memberEmail
            };

            updateBorrowRecord(editingRecord.id, updateData)
                .then((response) => {
                    console.log(
                        "Borrow record updated:",
                        response.data
                    );

                    alert("Borrow record updated successfully!")

                    setEditingRecord(null);
                    setShowForm(null);

                    loadBorrowRecords();
                })
                .catch((error) => {
                    console.log(
                        "Error updating borrow record:",
                        error.response?.data || error
                    );

                    alert(
                        error.response?.data?.message ||
                        "Failed to update borrow record."
                    );
                });
        } else {

        const borrowRecord = {
            bookId: Number(formData.bookId),
            memberName: formData.memberName,
            memberEmail: formData.memberEmail
        };

        console.log("Sending borrow record:", borrowRecord);

        addBorrowRecord(borrowRecord)
            .then((response) => {
                console.log("Borrow record added: ", response.data)

                alert("Borrow record added successfully!");

                // clear form
                setFormData({
                    bookId: "",
                    memberName: "",
                    memberEmail: ""
                });

                // hide form
                setShowForm(false);

                // reload records
                loadBorrowRecords();
            })
            .catch((error) => {
                console.error(
                    "Error adding borrow record:", error.response?.data || error
                );

                alert(error.response?.data?.message || "Failed to add borrow record.");
            })
        }
    }

    // handle return book
    const handleReturnBook = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to return this book?"
        );

        if(!confirmed) {
            return;
        }

        returnBorrowRecord(id)
            .then((response) => {
                console.log(
                    "Book returned successfully:", response.data
                );

                alert("Book returned successfully!");

                loadBorrowRecords();
            })
            .catch((error) => {
                console.error(
                    "Error returning book:", error.response?.data || error
                );

                alert(
                    error.response?.data?.message || "Failed to return book."
                )
            })
    }

    // Delete the borrow record
    const handleDeleteBorrowRecord = (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this borrow record?"
        );

        if(!confirmed)
            return;

        deleteBorrowRecord(id)
            .then(()=> {
                console.log("Borrow record deleted successfully!")

                alert("Borrow record deleted successfully!")

                loadBorrowRecords();
            })
            .catch((error) => {
                console.error(
                    "Error deleting borrow records:",
                    error.response?.data || error
                );

                alert(
                    error.response?.data?.message || "Failed to delete borrow record."
                );
            });
    }

    // to get the borrowrecords on bases of id
    const displayRecords = bookId 
        ? borrowRecords.filter(
            (record) => String(record.book?.id) === String(bookId)
        )
        : borrowRecords;

    const filterBorrowRecords = statusFilter === "ALL" ? displayRecords : displayRecords.filter(
        (record) => record.status === statusFilter
    );


    return(
        <div className="borrow-records-page">
            <h1>Borrow Records</h1>

            {/* Add borrow record button */}
            {isAdmin && (
                <button className="add-borrow-button" 
                        onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Cancel" : "Add Borrow Record"}
                </button>
            )}

            {/* Add Borrow record form */}
            {showForm && (
                <form onSubmit={handleSubmit}>
                    <h2>
                        {editingRecord ? "Edit Borrow Record" : "Add Borrow Record"}
                    </h2>

                    <div>
                        <label>Book: </label>

                        <select
                            name="bookId" 
                            value={formData.bookId}
                            onChange={handleChange}
                            required   
                            disabled={editingRecord}
                        >
                            <option value="">
                                -- Select Book --
                            </option>

                            {books.map((book) => (
                                <option
                                    key={book.id}
                                    value={book.id}
                                >
                                    {book.title}
                                </option>
                            ))}

                        </select>
                    </div>
                    <br />
                    
                    <div>
                        <label>Member Name:</label>

                        <input
                            type="text"
                            name="memberName"
                            value={formData.memberName}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <br />

                    <div>
                        <label>Member Email:</label>

                        <input 
                            type="email"
                            name="memberEmail"
                            value={formData.memberEmail}
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <br />

                    <button type="submit">
                        {editingRecord ? "Update Borrow Recprd" : "Save Borrow Record"}
                    </button>
                </form>
            )}

            <h2>All Borrow Records</h2>
            <div className="borrow-filter">
                <label>Filter by Status: </label>

                <select 
                    value={statusFilter} 
                    onChange={(event) => 
                        setStatusFilter(event.target.value)
                    }
                >
                    <option value="ALL">All</option>
                    <option value="BORROWED">Borrowed</option>
                    <option value="RETURNED">Returned</option>
                    <option value="OVERDUE">Overdue</option>
                </select>
            </div>
            <div className="borrow-table-container">
                <table className="borrow-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Book</th>
                            <th>Member Name</th>
                            <th>Member Email</th>
                            <th>Borrow Date</th>
                            <th>Due Date</th>
                            <th>Return Date</th>
                            <th>Status</th>
                            {isAdmin && (<th>Actions</th>)}
                        </tr>
                    </thead>

                    <tbody>
                        {filterBorrowRecords.map((record) => (
                            <tr key={record.id}>
                                <td>{record.id}</td>
                                <td>{record.book?.title}</td> {/* BorrowRecord contains: private Book book; and JSON contains "book": {"id": 1, "title": "Java Complete Reference"} */}
                                <td>{record.memberName}</td>
                                <td>{record.memberEmail}</td>
                                <td>{record.borrowDate}</td>
                                <td>{record.dueDate}</td>
                                <td>{record.returnDate || "-"}</td>
                                <td className={`borrow-status ${record.status.toLowerCase()}`}>
                                    {record.status}
                                </td>
                                <td>
                                    {isAdmin && (
                                        <button
                                            className="borrow-action-button"
                                            onClick={() => handleEditBorrowRecord(record)}
                                        >
                                            Edit
                                        </button>
                                    )

                                    }
                                    {isAdmin && record.status !== "RETURNED" && (
                                        <button className="borrow-action-button borrow-return-button" 
                                                onClick={() => handleReturnBook(record.id)}>
                                            Return
                                        </button>
                                    )}
                                    {isAdmin && record.status === "RETURNED" && (
                                        <button className="borrow-action-button borrow-delete-button"
                                            onClick={() => handleDeleteBorrowRecord(record.id)}>
                                                Delete
                                        </button>
                                    )
                                        
                                    }
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default BorrowRecords;