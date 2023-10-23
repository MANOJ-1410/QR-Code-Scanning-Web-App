import React, { useEffect, useState } from 'react';
import QrReader from 'react-qr-scanner';
import axios from 'axios';
import jwt_decode from 'jwt-decode';
import { useNavigate } from 'react-router-dom';

const QrCodeReader = () => {
  const [result, setResult] = useState(null);
  const [scanning, setScanning] = useState(false);
  const [id, setId] = useState(null);
  const Navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      try {
        const decodedToken = jwt_decode(token);
        if (decodedToken && decodedToken.id) {
          setId(decodedToken.id);
        }else{
          Navigate('/login')
        }
      } catch (error) {
      Navigate('/login')

        console.error('Error decoding the JWT:', error);
      }
    }else{
      Navigate('/login')
    }
  }, [Navigate]);

  const handleScan = async (data) => {
    if (data) {
      setResult(data);
      if (scanning && id) {
        try {
          const API_URL = process.env.REACT_APP_BACKEND_URL;
          const response = await axios.post(`${API_URL}/qrcodes`, { user_id: id, data: data.text });
          console.log('API Response:', response.data);
        } catch (error) {
          console.error('API Error:', error);
        }
      }
    }
  };

  const handleError = (error) => {
    console.error(error);
  };

  const toggleScanning = () => {
    if (!scanning) {
      setScanning(true);
    } else {
      setScanning(false);
      setResult(null);
    }
  };


  return (
    <div className="w-1/2 mx-auto mt-5 text-center">
      <h2 className="text-2xl mb-4">QR Code Reader</h2>

  

      {scanning && (
        <div>
          <QrReader
            delay={100}
            style={{ width: '100%' }}
            onError={handleError}
            onScan={handleScan}
          />
          {result && (
            <div>
              <p>Scanned Data: {result.text}</p>
            </div>
          )}
        </div>
      )}

<button
        className={`${scanning ? 'bg-red-500 hover:bg-red-700': 'bg-green-500 hover:bg-green-700'} text-white font-bold py-2 px-4 rounded mt-4`}
        onClick={toggleScanning}
      >
        {scanning ? 'Stop Scanning' : 'Start Scanning'}
      </button>
    </div>
  );
};

export default QrCodeReader;
