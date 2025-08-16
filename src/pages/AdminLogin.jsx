import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/admin.scss";

function AdminLogin() {
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (password === "manmood123") {
      localStorage.setItem("isAdmin", "true");
      navigate("/admin");
    } else {
      alert("Wrong Password");
    }
  };

  return (
    <div className="login-page">
      <form onSubmit={handleLogin} className="login-box">
        <h2>Admin Login</h2>
        <input
          type="password"
          placeholder="Enter Admin Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="btn-primary">Login</button>
      </form>
    </div>
  );
}

export default AdminLogin;
