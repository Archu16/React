import { useNavigate, useLocation } from "react-router-dom";
import style from "./Navbar.module.css";

import PersonIcon from "@mui/icons-material/Person";

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  function handleLogout() {
    localStorage.clear();
    window.location.href = "/";
  }

  return (
    <div className={style.wrapper}>
      <div className={style.logo} onClick={navigate.bind(this, "/")}>
        Social Banking
      </div>

      <div className={style.buttons}>
        {localStorage.getItem("userId") ? (
          <div className={style.user}>
            {/* <span></span>
            < */}

            <PersonIcon />
            <div style={{ marginRight: "10px" }}>
              {localStorage.getItem("userName")}
            </div>

            <button onClick={handleLogout}>Logout</button>

            {location.pathname !== "/dashboard" &&
              localStorage.getItem("userId") && (
                <button
                  onClick={navigate.bind(this, "/dashboard")}
                  className={style.btnDash}
                >
                  Visit Dashboard
                </button>
              )}
          </div>
        ) : (
          <>
            <button onClick={navigate.bind(this, "/login")}>Login</button>
            <button onClick={navigate.bind(this, "/register")}>Register</button>
          </>
        )}
      </div>
    </div>
  );
}
