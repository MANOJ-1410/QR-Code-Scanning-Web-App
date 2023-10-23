import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import QrCodeReader from "./Pages/QrCodeReader";
import AppLayout from "./AppLayout";
import 'react-toastify/dist/ReactToastify.css';
import Signup from "./Pages/Signup";
import Login from "./Pages/Login";
import DisplayAllQr from "./Pages/DisplayAllQr";
import Contact from "./Pages/Contact";

function App() {
  return (   
   <>
   <BrowserRouter>
   <Routes>
    <Route path="/" element={<AppLayout />}>
      <Route index element={<QrCodeReader/>}></Route>
      <Route path='/signup' element={<Signup />}></Route>
      <Route path='/login' element={<Login />}></Route>
      <Route path='/history' element={<DisplayAllQr />}></Route>
      <Route path='/contact' element={<Contact />}></Route>

    </Route>
   </Routes>
   </BrowserRouter>

   </>
  );
}

export default App;
