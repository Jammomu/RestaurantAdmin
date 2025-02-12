import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route,  } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import ManageUsers from './pages/ManageUsers';
import ManageReservations from './pages/ManageReservations';
import ManageReviews from './pages/ManageReviews';
import ManageReports from './pages/ManageReports';
import ManageBoards from './pages/ManageBoards';
import Reservationlistpage from 'pages/ReservationListpage';
import 'admin-lte/dist/css/adminlte.min.css';
import AdminReviewList from './components/js/AdminReviewList';
import AdminReport from './components/js/AdminReport';
import AdminRestaurantTable from './components/jh/AdminRestaurantTable';
import Update from './components/jh/Update';
import AddRestaurant from './components/jh/Add';

function App() {

  return (

      <Router>
        <div className="App">
          <Sidebar />
          <div className="content-wrapper">
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/manage-users" element={<ManageUsers />} />
              <Route path="/manage-restaurants" element={<AdminRestaurantTable />} />
              <Route path="/manage-reservations" element={<ManageReservations />} />
              <Route path="/manage-reviews" element={<ManageReviews />} />
              <Route path="/reviewList/:restaurantId" element={<AdminReviewList />} />
              <Route path="/report/:restaurantId" element={<AdminReport />} />
              <Route path="/manage-reports" element={<ManageReports />} />
              <Route path="/manager-reservations/reservations" element={<Reservationlistpage />} />
              <Route path="/restaurant/update/:restaurantId" element={<Update />} />
              <Route path="/restaurant/add" element={<AddRestaurant />} />
            </Routes>
          </div>
        </div>
      </Router>
  );
}

export default App;
