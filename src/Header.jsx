import { useState } from "react";
import "./Header.css";
import Button from "./Button";
import { LOGIN_STATUS } from "./constants";

function Header({ onThemeSelection, onLogout, isLoggedIn, username }) {
  const [menuState, steMenuState] = useState("");
  const [selectedTheme, setSelectedTheme] = useState("");
  const initialofUsername = username && username.slice(0, 1);
  const openThemeMenu = () => {
    if (!menuState) {
      steMenuState("open");
    } else {
      steMenuState("");
    }
  };

  const handleThemeSelection = (e, theme) => {
    e.preventDefault();
    setSelectedTheme(theme);
    steMenuState("");
    onThemeSelection(theme);
  };
  return (
    <>
      <a className="skiplink" href="#main">
        Skip to content
      </a>
      <header className="header">
        <div className="header-left">
          {isLoggedIn === LOGIN_STATUS.IS_LOGGED_IN && (
            <div className="username-logo capitalize">{initialofUsername}</div>
          )}
          <h1 className="header-title">EventHub Calendar</h1>
        </div>

        <div className="header-right">
          {isLoggedIn === LOGIN_STATUS.IS_LOGGED_IN && (
            <Button
              type="button"
              className="logout"
              onClick={(e) => onLogout(e)}
            >
              Logout
            </Button>
          )}
          <div className="theme-menu">
            <div className="theme-wraper">
              <button
                type="button"
                className="button has-icon theme-main"
                aria-label="theme switch menu"
                onClick={() => openThemeMenu()}
              >
                <i
                  className={`gg-${selectedTheme === "dark" ? "moon" : "sun"}`}
                ></i>
                Theme
              </button>
            </div>
            <ul className={`theme-menu__list ${menuState}`}>
              <li className="theme-menu__item">
                <a
                  className="theme-menu__link"
                  href=""
                  onClick={(e) => handleThemeSelection(e, "light")}
                >
                  <i className="gg-sun"></i>Light
                </a>
              </li>
              <li className="theme-menu__item">
                <a
                  className="theme-menu__link"
                  href=""
                  onClick={(e) => handleThemeSelection(e, "dark")}
                >
                  <i className="gg-moon"></i>Dark
                </a>
              </li>
            </ul>
          </div>
        </div>
      </header>
    </>
  );
}

export default Header;
