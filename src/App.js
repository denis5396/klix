import { Route, Switch } from 'react-router-dom';
import './App.css';
import Nav from './components/Nav/Nav';
import Home from './pages/Home';
import Login from './pages/Login';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="App">
      <Nav />
      <Switch>
        <Route path="/" exact>
          <Home />
        </Route>
        <Route path="/login">
          <Login />
        </Route>
      </Switch>
      <Footer />
    </div>
  );
}

export default App;
