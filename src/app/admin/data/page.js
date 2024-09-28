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
import { showSpinner , hideSpinner } from "@/lib/spinner";

export default function DataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [approvedStatus, setApprovedStatus] = useState({});
  const [isApproved, setIsApproved] = useState(false); // Track approval status

  // Fetch the users
  const [amount, setAmount] = useState(''); // State for amount
  const fetchUsers = async () => {
    showSpinner()
    try {
      const response = await axios.get('/api/getusers');
      setUsers(response.data.userinfo);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      hideSpinner()
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAmountChange = (event) => {
    setAmount(event.target.value); // Update the amount state
};

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
  };



  // Function to handle WhatsApp navigation
  const navigateWhatsapp = (row) => {
    // console.log(row)
    const phoneNumber = row.pnno || ''; // Ensure phone number exists
    const message = `We are grateful to acknowledge the generous contribution of ${row.ticketInfo.amount} from ${row.firstname} ${row.lastname} towards the Luv Kusha Ramayan initiative. Your support will help us in preserving and promoting the rich cultural heritage and teachings of the Ramayan.\n\nThis donation will go a long way in furthering our cause, and we sincerely appreciate your commitment to our mission. May Lord Ram bless you with peace, prosperity, and happiness.\n\nDonation Details:\nDonor’s Name: ${row.firstname} ${row.lastname}\n\nAmount Donated: ${row.ticketInfo.amount}\n\nMode of Payment: Online Transfer\n\nDonation Reference Number: 237859238957322\n\nThank you once again for your kind support.\n\nWarm regards,\nLuv Kusha Ramayan Committee`; // Customize message

    const encodedMessage = encodeURIComponent(message); // URL encoding the message
    const whatsappLink = `https://wa.me/+91${phoneNumber}/?text=${encodedMessage}`; // Construct WhatsApp link

    // console.log("The message is ",message)

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
        params.row.ticketInfo?.amount > 0 ? ( // Check if amount is greater than 0
          <WhatsAppIcon
            onClick={() => navigateWhatsapp(params.row)}
            style={{ color: '#25D366', fontSize: '24px', cursor: 'pointer' }}
            onMouseEnter={(e) => (e.target.style.transform = 'scale(1.2)')} // Zoom effect on hover
            onMouseLeave={(e) => (e.target.style.transform = 'scale(1)')}
          />
        ) : null // Render nothing if amount is 0 or undefined
      
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
        showSpinner()
        handleCloseModal(); // Close modal after submission
        const response = await axios.post('/api/setStatus', {
          id: selectedUser._id,
          approved: true,
          amountreceived : amount
        });
        console.log("API Response:", response.data);
        // Update approved status in local state
        setApprovedStatus((prev) => ({
          ...prev,
          [selectedUser._id]: true,
        }));
        
        

        await fetchUsers(); // Refresh users
      } catch (error) {
        console.error("Error submitting approval:", error);
      }finally{
        setAmount('');
        hideSpinner();
         // Show SweetAlert2 toast on success
         Swal.fire({
          position: "top-end",
          icon: "success",
          title: "Email sent sucessfull",
          showConfirmButton: false,
          timer: 1500
        });
         // Show SweetAlert2 toast on success
      // Swal.fire({
      //   icon: 'success',
      //   title: 'Mail sent successfully',
      //   toast: true,
      //   position: 'top-end',
      //   showConfirmButton: false,
      //   timer: 3000, // The toast will disappear after 3 seconds
      //   timerProgressBar: true,
      // });

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
      maxWidth: '90%',  // Responsive width
      width: '100%',  // Full width for small screens
      maxHeight: '90vh',  // Prevent the modal from exceeding the viewport height
      overflowY: 'auto',  // Enable scrolling if content is too large
          }}
        >
          <h2 id="screenshot-modal-title" className="mb-4">
            Screenshot for {selectedUser?.firstname}
          </h2>
          {selectedUser?.ticketInfo?.screenshot_Url && (
            <img
              src={selectedUser.ticketInfo.screenshot_Url}
              alt="Screenshot"
              style={{
                width: "100%",  // Image takes full width of the modal
                maxWidth: '100%',  // Make sure it doesn’t exceed container width
                maxHeight: '70vh',  // Prevent the image from exceeding 70% of the viewport height
                height: "auto",  // Maintain aspect ratio
                objectFit: "contain",  // Keep the image contained within its container
                marginBottom: "16px",
              }}
            />
          )}
          {selectedUser?.ticketInfo?.utrno && (
            <div className="mb-4">
              <strong>UTR Number:</strong> {selectedUser.ticketInfo.utrno}
            </div>
          )}
          <div className="mb-4">
                    <label htmlFor="amount" className="mr-2">
                        Amount:
                    </label>
                    <input
                        type="string"
                        id="amount"
                        value={amount}
                        onChange={handleAmountChange}
                        placeholder="Enter amount"
                        style={{
                            padding: '8px',
                            borderRadius: '4px',
                            border: '1px solid #ccc',
                            width: '100%', // Full width for responsive design
                            maxWidth: '200px', // Optional max width
                        }}
                    />
                </div>
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
