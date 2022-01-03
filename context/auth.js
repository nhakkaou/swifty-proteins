import React, { createContext, useEffect, useState, useRef } from "react";
import { AppState } from "react-native";
import { navigationRef } from "../navigator/RootNavigation";

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [isAuth, setIsAuth] = useState(false);
  const appState = useRef(AppState.currentState);

  useEffect(() => {
    if (!isAuth) {
      navigationRef.current.navigate("Login");
    }
  }, [isAuth]);

  changeAuth = (value) => {
    setIsAuth(value);
  };

  useEffect(() => {
    const sub = AppState.addEventListener("change", (nextAppState) => {
      if (
        (appState.current === "background" || appState.current === "active") &&
        nextAppState === "active"
      ) {
        setIsAuth(false);
      }

      appState.current = nextAppState;
    });

    return () => {
      if (sub) sub.remove();
    };
  }, []);

  return (
    <AuthContext.Provider
      value={{
        isAuth,
        changeAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
