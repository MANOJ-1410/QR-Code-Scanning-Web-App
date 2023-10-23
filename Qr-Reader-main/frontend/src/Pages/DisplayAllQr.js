import React, { useState, useEffect } from 'react';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import QrCode from 'react-qr-code';
import { useNavigate } from 'react-router-dom';

const DisplayAllQr = () => {
  const [qrCodes, setQrCodes] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [userId, setUserId] = useState(null);
  const Navigate = useNavigate();


  useEffect(() => {
    // Get user ID from JWT
    const token = localStorage.getItem('token');
    if (token) {
      const decodedToken = jwt_decode(token);
      if (decodedToken && decodedToken.id) {
        setUserId(decodedToken.id);
      }
      else{
        Navigate('/login')
      }
    }
  }, [Navigate]);

  const API_URL = process.env.REACT_APP_BACKEND_URL;
  useEffect(() => {
    const fetchQrCodes = async () => {
      if (userId) {
        try {
          const response = await axios.get(
            `${API_URL}/qrcodes/${userId}?page=${currentPage}&perPage=${itemsPerPage}`
          );
          setQrCodes(response.data.qrCodes);
          setTotalPages(response.data.totalPages);
        } catch (error) {
          console.error('Error fetching QR codes:', error);
        }
      }
    };

    fetchQrCodes();
  }, [currentPage, userId, itemsPerPage, API_URL]);

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/qrcodes/${id}`);
      setQrCodes((prevCodes) => prevCodes.filter((code) => code.id !== id));
    } catch (error) {
      console.error('Error deleting QR code:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h2 className="text-3xl font-semibold mb-4">Your QR Codes</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {qrCodes.map((code) => (
          <div key={code.id} className="border border-gray-300 p-4 rounded-lg">
            <div className="w-40 h-24 flex justify-center mx-auto mb-4">
              <QrCode value={code.data} size={192} />
            </div>
            <p className="text-blue-500 hover:underline my-2 pt-24">
              <a href={code.data} target="_blank" rel="noopener noreferrer">
                {code.data}
              </a>
            </p>
            <button
              className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded ml-auto flex justify-center"
              onClick={() => handleDelete(code.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div className="mt-4">
        {Array.from({ length: totalPages }, (_, index) => (
          <button
            key={index}
            className={`mx-1 py-1 px-3 rounded ${
              index + 1 === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-200 hover:bg-gray-300'
            }`}
            onClick={() => setCurrentPage(index + 1)}
            disabled={index + 1 === currentPage}
          >
            {index + 1}
          </button>
        ))}
      </div>
    </div>
  );
};

export default DisplayAllQr;
