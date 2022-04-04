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
import TagsPage from "./pages/TagsPage";

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
          <Home route="Početna" />
        </Route>
        <Route path="/Vijesti" exact>
          <Home route="Vijesti" />
        </Route>
        <Route path="/Biznis" exact>
          <Home route="Biznis" />
        </Route>
        <Route path="/Sport" exact>
          <Home route="Sport" />
        </Route>
        <Route path="/Magazin" exact>
          <Home route="Magazin" />
        </Route>
        <Route path="/Lifestyle" exact>
          <Home route="Lifestyle" />
        </Route>
        <Route path="/Scitech" exact>
          <Home route="Scitech" />
        </Route>
        <Route path="/Auto" exact>
          <Home route="Auto" />
        </Route>
        <Route path="/tagovi/:category/:tagLabel">
          <TagsPage />
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
