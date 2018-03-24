import { Switch, Route, Redirect } from 'react-router-dom'
import 'bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import Header from './common/Header'
import Footer from './common/Footer'
import Home from './pages/Home'
import Film from './pages/Film'
import List from './pages/List'
import NewList from './pages/NewList'

const App = () => (
  <div>
    <Header />
    <main className="container my-5">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route path="/film/:filmID" component={Film} />
        <Route exact path="/list/:listID" component={List} />
        <Route path="/list/:listID/sort/:sort" component={List} />
        <Route exact path="/newlist" component={NewList} />
        <Route path="/newlist/with/:filmID" component={NewList} />
        <Redirect to="/" />
      </Switch>
    </main>
    <Footer />
  </div>
)

export default App
