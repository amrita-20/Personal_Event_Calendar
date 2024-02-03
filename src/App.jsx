import { useEffect, useState } from "react";
import "./App.css";
import Header from "./Header";
import Footer from "./Footer";
import Login from "./Login";
import {
  fetchLogin,
  fetchSession,
  fetchLogout,
  fetchAddEvent,
  fetchEventDetails,
  fetchEventDelete,
  fetchUpdateEvent
} from "./services";
import Calendar from "./Calendar";
import Status from "./Status";
import Spinner from "./Spinner";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { LOGIN_STATUS, CLIENT, SERVER, DATE_FORMATS } from "./constants";

function App() {
  const [theme, setTheme] = useState("");

  const [loginInfo, setLoginInfo] = useState({
    isLoggedIn: LOGIN_STATUS.PENDING,
    username: "",
  });
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [isEventPending, setIsEventPending] = useState(false);
  const [isAddEventPending, setIsAddEventPending] = useState(false);
  const [modalError, setModalError] = useState("");

  const handleTheme = (selectedTheme) => {
    if (selectedTheme === "dark") {
      setTheme(selectedTheme);
    } else {
      setTheme("");
    }
  };

  useEffect(() => {
    const startDate = format(
      startOfMonth(new Date()),
      DATE_FORMATS.SERVER_DATE
    );
    const endDate = format(endOfMonth(new Date()), DATE_FORMATS.SERVER_DATE);
    checkForSession()
      .then(() => getEvents(startDate, endDate))
      .catch((err) => {
        setIsEventPending(false);
        if (err?.error === CLIENT.NO_SESSION) {
          setLoginInfo({
            isLoggedIn: LOGIN_STATUS.NOT_LOGGED_IN,
            username: "",
          });
          return;
        }
        setError(err?.error || "ERROR");
      });
  }, []);

  const checkForSession = () => {
    return fetchSession()
      .then((session) => {
        setLoginInfo({
          isLoggedIn: LOGIN_STATUS.IS_LOGGED_IN,
          username: session.username,
        });
      })

      .catch((err) => {
        if (err?.error === SERVER.AUTH_MISSING) {
          return Promise.reject({ error: CLIENT.NO_SESSION });
        }
        return Promise.reject(err);
      });
  };

  const getEvents = (startDate, endDate) => {
    setIsEventPending(true);
    fetchEventDetails({ startDate, endDate })
      .then((eventDetails) => {
        setEvents(eventDetails);
        setIsEventPending(false);
      })

      .catch((err) => {
        setIsEventPending(false);
        setError(err?.error || "ERROR");
      });
  };

  const handleLogin = (username) => {
    const startDate = format(
      startOfMonth(new Date()),
      DATE_FORMATS.SERVER_DATE
    );
    const endDate = format(endOfMonth(new Date()), DATE_FORMATS.SERVER_DATE);
    setLoginInfo({ isLoggedIn: LOGIN_STATUS.PENDING, username: username });
    fetchLogin({ username, startDate, endDate })
      .then((eventDetails) => {
        setError("");
        setEvents(eventDetails);
        setLoginInfo({
          isLoggedIn: LOGIN_STATUS.IS_LOGGED_IN,
          username: username,
        });
      })

      .catch((err) => {
        setError(err?.error || "ERROR");
        setLoginInfo({
          isLoggedIn: LOGIN_STATUS.NOT_LOGGED_IN,
          username: username,
        });
      });
  };

  const handleLogout = () => {
    fetchLogout()
      .then(() => {
        setError("");
        setModalError("");
        setLoginInfo({ isLoggedIn: LOGIN_STATUS.NOT_LOGGED_IN, username: "" });
        setEvents([]);
      })

      .catch((err) => {
        setError(err?.error || "ERROR");
      });
  };

  const onSave = (eventDetails) => {
    setIsAddEventPending(true);
    fetchAddEvent(eventDetails)
      .then((res) => {
        const updatedEvents = [...events, res];
        setEvents(updatedEvents);
        setModalError("");
        setIsAddEventPending(false);
      })

      .catch((err) => {
        setModalError(err?.error || "ERROR");
        setIsAddEventPending(false);
      });
  };

  const onDelete = (id, startDate, endDate) => {
    setIsAddEventPending(true);
    fetchEventDelete(id)
      .then(() => {
        return fetchEventDetails({ startDate, endDate });
      })

      .catch((err) => {
        setModalError(err?.error || "ERROR");
      })

      .then((eventDetails) => {
        setEvents(eventDetails);
        setModalError("");
        setIsAddEventPending(false);
      })

      .catch((err) => {
        setModalError(err?.error || "ERROR");
        setIsAddEventPending(false);
      });
  };

  const onEdit = (id, event) => {
    setIsAddEventPending(true);
    fetchUpdateEvent(id,  event)
      .then((res) => {
        setEvents((prevEvents) => {
          const updatedIdx = prevEvents.findIndex(
            (event) => event.id === res.id
          );
          const updatedEvents = [...prevEvents];
          updatedEvents[updatedIdx] = res;
          return updatedEvents;
        });
        setModalError("");
        setIsAddEventPending(false);
      })

      .catch((err) => {
        setModalError(err?.error || "ERROR");
        setIsAddEventPending(false);
      });
  };

  return (
    <div className={`app-container ${theme}`}>
      <Header
        onThemeSelection={handleTheme}
        onLogout={handleLogout}
        isLoggedIn={loginInfo.isLoggedIn}
        username={loginInfo.username}
      ></Header>
      <main id="main" className="main">
        {error && <Status error={error} />}
        {loginInfo.isLoggedIn === LOGIN_STATUS.PENDING && <Spinner />}
        {loginInfo.isLoggedIn === LOGIN_STATUS.IS_LOGGED_IN && (
          <Calendar
            onSave={onSave}
            events={events}
            onDelete={onDelete}
            onEdit={onEdit}
            isEventPending={isEventPending}
            username={loginInfo.username}
            isAddEventPending={isAddEventPending}
            modalError={modalError}
            setModalError={setModalError}
            getEvents={getEvents}
          />
        )}{" "}
        {loginInfo.isLoggedIn === LOGIN_STATUS.NOT_LOGGED_IN && (
          <Login onLogin={handleLogin}></Login>
        )}
      </main>
      <Footer></Footer>
    </div>
  );
}

export default App;
