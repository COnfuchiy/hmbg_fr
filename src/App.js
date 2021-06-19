import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
//import logo from './logo.svg';
import './App.css';
import Main from './main';

class App extends Component {

    componentDidMount() {
        axios.get('/auth').then(res => {
            if (res.data.success !== undefined && res.data.success !== "no_authorized"){
               ReactDOM.render(<Main></Main>, document.getElementById('root'));
            }
        });
    }

    render() {
        return (
            <div className="App">
                <Link to="/auth">Вход</Link>
                <Link to="/reg">Регистрация</Link>
            </div>
        );
    }
}

export default App;
