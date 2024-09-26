"use client"; // This must be the first line in the file

import { useState } from "react";
import Link from "next/link";
import { DataGrid } from "@mui/x-data-grid";
import { Modal, Button } from "@mui/material";
import CancelIcon from '@mui/icons-material/Cancel';
import CheckBoxIcon from '@mui/icons-material/CheckBox';

export default function DataPage() {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedScreenshot, setSelectedScreenshot] = useState(null);
  const [verifiedUsers, setVerifiedUsers] = useState({});
  const [approveUserId, setApproveUserId] = useState(null); // Track which user is being approved
  const [approvedStatus, setApprovedStatus] = useState({}); // Track approval status

  const toggleMenu = () => {
    setIsOpen(!isOpen);
  };

  // Sample data for the Data Grid
  const columns = [
    { field: "id", headerName: "ID", width: 90 },
    { field: "firstName", headerName: "First name", width: 150 },
    { field: "lastName", headerName: "Last name", width: 150 },
    { field: "age", headerName: "Age", type: "number", width: 110 },
    { field: "email", headerName: "Email", width: 200 },
    {
      field: "screenshots",
      headerName: "Screenshots",
      width: 200,
      renderCell: (params) => (
        <Button
          variant="outlined"
          onClick={() => handleOpenModal(params.row.id, params.value)}
        >
          View Screenshots
        </Button>
      ),
    },
    {
      field: "verifyUser",
      headerName: "Verify User",
      width: 200,
      renderCell: (params) => (
        <>
          {approvedStatus[params.row.id] ? (
            <CheckBoxIcon
              style={{ color: "green", cursor: "pointer" }}
            />
          ) : (
            <CancelIcon
              style={{ color: "red", cursor: "pointer" }}
            />
          )}
        </>
      ),
    },
  ];

  const rows = [
    { id: 1, lastName: "Snow", firstName: "Jon", age: 35, email: "jon.snow@example.com", screenshots: "https://ramleela.s3.ap-south-1.amazonaws.com/ramleelascreenshots/1727263833492" },
    { id: 2, lastName: "Lannister", firstName: "Cersei", age: 42, email: "cersei.lannister@example.com", screenshots: "screenshot2.png" },
    // Add more rows as needed
  ];

  const handleOpenModal = (id, screenshot) => {
    setApproveUserId(id); // Set the ID of the user to approve
    setSelectedScreenshot(screenshot);
    setIsOpen(true); // Open the modal
  };

  const handleCloseModal = () => {
    setSelectedScreenshot(null);
    setIsOpen(false);
  };

  const handleSubmitApproval = () => {
    // Update the approval status for the user
    setApprovedStatus((prev) => ({
      ...prev,
      [approveUserId]: true, // Mark as approved
    }));
    handleCloseModal(); // Close the modal
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
            <div className="-mr-2 flex md:hidden">
              <button
                onClick={toggleMenu}
                type="button"
                className="bg-blue-700 inline-flex items-center justify-center p-2 rounded-md text-white hover:bg-blue-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-blue-800 focus:ring-white"
                aria-controls="mobile-menu"
                aria-expanded={isOpen}
              >
                <span className="sr-only">Open main menu</span>
                {isOpen ? (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                ) : (
                  <svg
                    className="block h-6 w-6"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu, show/hide based on menu state */}
        {isOpen && (
          <div className="md:hidden" id="mobile-menu">
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              <Link href="/">
                <span className="text-white hover:bg-blue-500 block px-3 py-2 rounded-md text-base font-medium">Home</span>
              </Link>
            </div>
          </div>
        )}
      </nav>

      {/* Data Grid */}
      <div style={{ height: 400, width: "100%", marginTop: "20px" }}>
        <DataGrid rows={rows} columns={columns} pageSize={5} />
      </div>

      {/* Modal for Screenshots */}
      <Modal
        open={Boolean(selectedScreenshot)}
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
          <h2 id="screenshot-modal-title" className="mb-4">Screenshot</h2>
          {selectedScreenshot && (
            <img src={selectedScreenshot} alt="Screenshot" style={{ width: "100%", marginBottom: "16px" }} />
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
