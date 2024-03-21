import { useContext, createContext, useState } from "react";


interface AuthData {
  token: string | null; 
  user: string | null; 
  loginAction: (data: LoginInfo) => void; 
  logOut: () => void;
}

const AuthContext = createContext<AuthData | null>(null);

interface LoginInfo {
  username: string;
  password: string;
}

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<string | null>(null);
  const [token, setToken] = useState(localStorage.getItem("site") || null);
  const loginAction = async (data: LoginInfo) => {
    setUser("user");
    setToken("etwijwoet");
    localStorage.setItem("site", "etwijwoet");
    return;
    /*try {
      const response = await fetch("your-api-endpoint/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const res = await response.json();
      if (res.data) {
        setUser(res.data.user);
        setToken(res.token);
        localStorage.setItem("site", res.token);
        return;
      }
      throw new Error(res.message);
    } catch (err) {
      console.error(err);
    }*/
  };

  const logOut = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("site");
  };

  return (
    <AuthContext.Provider value={{ token, user, loginAction, logOut }}>
      {children}
    </AuthContext.Provider>
  );

};

export default AuthProvider;

export const useAuth = () => {
  return useContext(AuthContext);
};