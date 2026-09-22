import { useEffect, useState } from "react";
import { getAllBorrowRecords } from "../services/borrowRecordService";
import "./Members.css";

function Members() {
    const [borrowRecords, setBorrowRecords] = useState([]);
    const [members, setMembers] = useState([]);

    const loadBorrowRecords = () => {
        getAllBorrowRecords()
            .then((response) => {
                console.log("Borrow records:", response.data);
                setBorrowRecords(response.data);

                createMembers(response.data); // we are directly passing response.data as it contains the actual array returned by springBoot
            })
            .catch((error) => {
                console.error("Error fetching borrow records:", error);
            });
    };

    const createMembers = (records) => {
        const memberMap = new Map(); // we are using map function to combine the users of bases of particular term

        records.forEach((record) => { // go to through each and every record
            const email = record.memberEmail; 

            if(!memberMap.has(email)){ // check if map contains this email? -> No -> add them
                memberMap.set(email, {
                    memberName: record.memberName,
                    memberEmail: record.memberEmail,
                    booksBorrowed: 1,
                    activeBorrows: record.status === "BORROWED" || record.status === "OVERDUE" ? 1 : 0
                });
            } else {
                const member = memberMap.get(email);
                member.booksBorrowed += 1;
                if (
                    record.status === "BORROWED" ||
                    record.status === "OVERDUE"
                ) {
                    member.activeBorrows += 1;
                }
            }
        });

        setMembers(Array.from(memberMap.values()));
    }

    useEffect(() => {
        loadBorrowRecords();
    }, []);

    return(
        <div className="members-page">
            <h1>Members</h1>

            <p>Total borrow records: {borrowRecords.length}</p>

            <table className="members-table">
                <thead>
                    <tr>
                        <th>Member Name</th>
                        <th>Email</th>
                        <th>Books Borrowed</th>
                        <th>Active Borrows</th>
                    </tr>
                </thead>

                <tbody>
                    {members.map((member) => (
                        <tr key={member.memberEmail}>
                            <td>{member.memberName}</td>
                            <td>{member.memberEmail}</td>
                            <td>{member.booksBorrowed}</td>
                            <td>{member.activeBorrows}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default Members;