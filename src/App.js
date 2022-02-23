import { Route, Switch } from "react-router-dom";
import "./App.css";
import Nav from "./components/Nav/Nav";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Footer from "./components/Footer/Footer";
import Profile from "./pages/Profile";
import { useContext, useEffect, useRef } from "react";
import LoginContext from "./context";
import { auth } from "./firebase";
import AdminPanel from "./pages/AdminPanel";
import LoginForm from "./components/Login/LoginForm";
import UserInfo from "./components/UserInfo/UserInfo";
import Overlay from "./components/Overlay/Overlay";
import Article from "./pages/Article";
import EditArticlesPage from "./pages/EditArticles";
import Comment from "./components/comment/Comment";
import Comments from "./pages/Comments";
import CommentRulesPage from "./pages/CommentRulesPage";
import CommentLink from "./pages/CommentLink";
import ResetPass from "./pages/ResetPass";
import ResetPassword from "./components/Login/ResetPassword";

function App() {
  const ctx = useContext(LoginContext);

  const clearStorage = () => {
    const session = sessionStorage.getItem("ref");
    if (session == null) {
      localStorage.removeItem("remove");
      localStorage.removeItem("userObj");
      ctx.logout();
    }
    sessionStorage.setItem("ref", 1);
  };
  useEffect(() => {
    // window.addEventListener('load', clearStorage);
    auth.onAuthStateChanged((user) => {
      if (user) {
        // alert('userhere');
      } else if (!user) {
        if (localStorage.getItem("token")) {
        } else {
          ctx.logout();
        }
      }
    });
  }, []);

  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Login>
            <LoginForm />
          </Login>
        </Route>
        <Route path="/profil/:user">
          <Login>
            <UserInfo />
          </Login>
        </Route>
        <Route path="/mojprofil">
          <Profile />
        </Route>
        <Route path="/adminpanel">
          <AdminPanel />
        </Route>
        <Route path="/editarticles">
          <EditArticlesPage />
        </Route>
        <Route path="/:category/:subCategory/:title/:articleId/komentari">
          <Comments />
        </Route>
        <Route path="/:category/:subCategory/:title/:articleId">
          <Article />
        </Route>
        <Route path="/komentar/:commentId">
          <CommentLink />
        </Route>
        <Route path="/komentari">
          <CommentRulesPage />
        </Route>
        <Route path="/resetpass">
          <ResetPass>
            <ResetPassword />
          </ResetPass>
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
