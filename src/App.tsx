import './App.css'
import {Route, BrowserRouter as Router, Switch} from "react-router-dom";
import {Page} from "./Page.component.tsx";



function App() {
  return (
    <Router>
      <Switch>
        <Route path="/">
          <Page />
        </Route>
      </Switch>
    </Router>
  )
}

export default App
