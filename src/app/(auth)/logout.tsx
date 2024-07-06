import React from "react";
import { logout } from "../../services/firebaseService"; // Import logout from firebaseService.ts

const Logout: React.FC<{ onLogout: () => void }> = ({ onLogout }) => {
  const handleLogout = async () => {
    try {
      await logout();
      onLogout(); // Callback to handle successful logout
    } catch (error) {
      console.error("Error logging out:", error);
    }
  };

  return <button onClick={handleLogout}>Logout</button>;
};

export default Logout;
