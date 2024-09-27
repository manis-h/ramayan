"use client"
import { useEffect, useState } from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import axios from 'axios';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import Swal from "sweetalert2";  // Import SweetAlert2

export default function DataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [approvedStatus, setApprovedStatus] = useState({});
  const [isApproved, setIsApproved] = useState(false); // Track approval status

  // Fetch the users
  const fetchUsers = async () => {
    try {
      const response = await axios.get('/api/getusers');
      setUsers(response.data.userinfo);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  const deleteUser = async (row) => {

    Swal.fire({
      title: "Are you sure?",
      text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!"
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          // API call to delete the user
          const res = await axios.post("/api/disableUser", {
            id: row._id,
          });
          console.log("User deleted successfully:", res);

          // Refresh the user list after successful deletion
          await fetchUsers();

          // Show confirmation that the user was deleted
          Swal.fire({
            title: "Deleted!",
            text: "The user has been deleted.",
            icon: "success"
          });
        } catch (error) {
          console.error("Unable to delete this user:", error);
        }
      }
    });



    // console.log("The row is", row);
    // try {
    //   // Await the deletion request
    //   const res = await axios.post("/api/disableUser", {
    //     id: row._id,
    //   });
    //   console.log("User deleted successfully:", res);
  
    //   // Refresh the user list after successful deletion
    //   await fetchUsers();
    // } catch (error) {
    //   console.error("Unable to delete this user:", error);
    // }
  };


  // Function to handle WhatsApp navigation
  const navigateWhatsapp = (row) => {
    const phoneNumber = row.pnno || ''; // Ensure phone number exists
    const message = `Hello, ${row.firstname} ${row.lastname}!`; // Customize message
    const encodedMessage = encodeURIComponent(message); // URL encoding the message
    const whatsappLink = `https://wa.me/+91${phoneNumber}/?text=${encodedMessage}`; // Construct WhatsApp link

    // Navigate to the WhatsApp link
    window.open(whatsappLink, "_blank");
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
        <Button variant="outlined" onClick={() => handleOpenModal(params.row)}>
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
          {params.row.ticketInfo?.status ? (
            <CheckBoxIcon style={{ color: "green", cursor: "pointer" }} />
          ) : (
            <CancelIcon style={{ color: "red", cursor: "pointer" }} />
          )}
        </>
      ),
    },
    // Column definition for WhatsApp
    {
      field: "whatsapp",
      headerName: "WhatsApp User",
      width: 200,
      renderCell: (params) => (
        <WhatsAppIcon
          onClick={() => navigateWhatsapp(params.row)}
          style={{ color: '#25D366', fontSize: '24px', cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')} // Zoom effect on hover
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        />
      ),
    },
    {
      field: "deleteUser",
      headerName: "Delete User",
      width: 150,
      renderCell: (params) => (
        <DeleteOutlineIcon
          onClick={() => deleteUser(params.row)}
          aria-label="delete user"
          style={{ color: 'red' , cursor: 'pointer' }}
          onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')} // Zoom effect on hover
          onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
        >
          <DeleteOutlineIcon />
        </DeleteOutlineIcon>
      ),
    },
  ];

  const rows = Array.isArray(users)
    ? users.map((user, index) => ({
        id: index + 1,
        _id: user._id,
        firstname: user.user.fName,
        lastname: user.user.lName,
        emailadress: user.user.email,
        address: user.user.address,
        pnno: user.user.Mobile,
        ticketInfo: user.ticketInfo,
        verifyUser: user?.ticketInfo?.status || false,
      }))
    : [];

  const handleOpenModal = (user) => {
    setSelectedUser(user);
    setIsApproved(user.ticketInfo?.status || false); // Initialize checkbox with status
    setIsOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedUser(null);
    setIsOpen(false);
  };

  const handleSubmitApproval = async () => {
    if (selectedUser) {
      try {
        const response = await axios.post('/api/setStatus', {
          id: selectedUser._id,
          approved: true,
        });

        console.log("API Response:", response.data);

        // Update approved status in local state
        setApprovedStatus((prev) => ({
          ...prev,
          [selectedUser._id]: true,
        }));

        handleCloseModal(); // Close modal after submission

        await fetchUsers(); // Refresh users
      } catch (error) {
        console.error("Error submitting approval:", error);
      }
    }
  };

  const handleCheckboxChange = (e) => {
    setIsApproved(e.target.checked);
  };

  return (
    <div>
      <nav className="bg-blue-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/">
                <span className="text-white font-bold text-xl">Admin Dashboard</span>
              </Link>
            </div>
          </div>
        </div>
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
        <div
          className="modal-content flex flex-col items-center justify-center p-4"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            background: 'white',
            borderRadius: '8px',
            boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
            maxWidth: '800px',
            width: '50%',
          }}
        >
          <h2 id="screenshot-modal-title" className="mb-4">
            Screenshot for {selectedUser?.firstname}
          </h2>
          {selectedUser?.ticketInfo?.screenshot_Url && (
            <img
              src={selectedUser.ticketInfo.screenshot_Url}
              alt="Screenshot"
              style={{ width: "100%", marginBottom: "16px" }}
            />
          )}
          {selectedUser?.ticketInfo?.utrno && (
            <div className="mb-4">
              <strong>UTR Number:</strong> {selectedUser.ticketInfo.utrno}
            </div>
          )}
          <div className="flex items-center mb-4">
            <input
              type="checkbox"
              id="approve"
              checked={isApproved}
              onChange={handleCheckboxChange}
            />
            <label htmlFor="approve" className="ml-2">
              Approve the user *
            </label>
          </div>
          {isApproved && (
            <Button
              onClick={handleSubmitApproval}
              color="primary"
              variant="contained"
              style={{ marginRight: '8px' }}
            >
              Submit
            </Button>
          )}
          <Button onClick={handleCloseModal} color="secondary">
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
