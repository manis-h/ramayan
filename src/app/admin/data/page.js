"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import axios from 'axios';

export default function DataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [approvedStatus, setApprovedStatus] = useState({});

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/getusers');
        setUsers(response.data.userinfo);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const columns = [
    { field: "id", headerName: "S NO", width: 90 },
    { field: "firstname", headerName: "First Name", width: 150 },
    { field: "lastname", headerName: "Last Name", width: 150 },
    { field: "emailadress", headerName: "Email", width: 200 },
    { field: "address", headerName: "Address", width: 200 },
    { field: "pnno", headerName: "Phone Number", width: 150 },
    {
      field: "screenshots",
      headerName: "Screenshots",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpenModal(params.row)}
        >
          View Screenshot
        </Button>
      ),
    },
    {
      field: "verifyUser",
      headerName: "Verify User",
      width: 200,
      renderCell: (params) => (
        <>
          {approvedStatus[params.row._id] ? (
            <CheckBoxIcon style={{ color: "green", cursor: "pointer" }} />
          ) : (
            <CancelIcon style={{ color: "red", cursor: "pointer" }} />
          )}
        </>
      ),
    },
  ];

  const rows = Array.isArray(users) ? users.map((user, index) => ({
    id: index + 1,
    _id: user._id,
    firstname: user.user.fName,
    lastname: user.user.lName,
    emailadress: user.user.email,
    address: user.user.address,
    pnno: user.user.Mobile,
    ticketInfo: user.ticketInfo, // Add this to access ticket info in the modal
  })) : [];

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsOpen(false);
  };

  const handleSubmitApproval = async () => {
    if (selectedUser) {
      try {
        // Console the ID for debugging
        console.log("Selected User ID:", selectedUser._id);

        // Hit the POST API to update approval status
        const response = await axios.post('http://localhost:3000/api/setStatus', {
          id: selectedUser._id, // Send the user ID
          approved: true, // Indicating approval
        });

        // Handle response if necessary
        console.log("API Response:", response.data);

        // Update approved status in the local state
        setApprovedStatus((prev) => ({
          ...prev,
          [selectedUser._id]: true,
        }));

        // Optionally close the modal after submission
        handleCloseModal();
      } catch (error) {
        console.error("Error submitting approval:", error);
      }
    }
  };

  return (
    <div>
      <nav className="bg-blue-600">
        {/* Navigation code omitted for brevity */}
      </nav>

      <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      <Modal
        open={Boolean(selectedUser)}
        onClose={handleCloseModal}
        aria-labelledby="screenshot-modal-title"
        aria-describedby="screenshot-modal-description"
      >
        <div className="modal-content flex flex-col items-center justify-center p-4" style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'white',
          borderRadius: '8px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
          maxWidth: '800px',
          width: '90%',
        }}>
          <h2 id="screenshot-modal-title" className="mb-4">Screenshot for {selectedUser?.firstname}</h2>
          {selectedUser && selectedUser.ticketInfo?.screenshot_Url && (
            <img src={selectedUser.ticketInfo.screenshot_Url} alt="Screenshot" style={{ width: "100%", marginBottom: "16px" }} />
          )}
          {selectedUser && selectedUser.ticketInfo?.utrno && (
            <div className="mb-4">
              <strong>UTR Number:</strong> {selectedUser.ticketInfo.utrno}
            </div>
          )}
          <div className="flex items-center mb-4">
            <input type="checkbox" id="approve" />
            <label htmlFor="approve" className="ml-2">Approve the user *</label>
          </div>
          <Button
            onClick={handleSubmitApproval}
            color="primary"
            variant="contained"
            style={{ marginRight: "8px" }}
          >
            Submit
          </Button>
          <Button onClick={handleCloseModal} color="secondary">Close</Button>
        </div>
      </Modal>
    </div>
  );
}
