import React from 'react';
import  { useContext } from 'react';
import { AuthContext } from '../components/AuthContext';


const AdminDashboard = () => {
    const { user } = useContext(AuthContext); 
console.log(user?.role);

  return (
    <div>
      <h1>Admin Dashboard</h1>
    </div>
  );
};

export default AdminDashboard;
