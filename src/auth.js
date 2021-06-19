/**
 * Created by Dima on 28.08.2019.
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import  Redirect from 'react-router-dom';
import axios from 'axios';

class Auth extends Component {
    constructor(props) {
        super(props);
        this.send_to_server = this.send_to_server.bind(this);
        this.handle_username_change = this.handle_username_change.bind(this);
        this.handle_pass_change = this.handle_pass_change.bind(this);
        this.state = {
            login: '',
            password: ''
        };
    }

    handle_username_change(e) {
        this.setState({login: e.target.value});
    }

    handle_pass_change(e) {
        this.setState({password: e.target.value})
    }

    send_to_server(e) {
        e.preventDefault();
        axios.post('/auth', {username: this.state.login, password: this.state.password}).then(function (response) {
            if (response.data.state==='oks'){
                alert(1);
                window.location.assign('/');
            }
        });
    }

    render() {
        return (
            <div className="App">
                <div className="App-content">
                    <form className="auth_form" onSubmit={this.send_to_server}>
                        <p>Авторизация</p>
                        <p><input className="username_auth" type="text" onChange={this.handle_username_change}/></p>
                        <p><input className="pass_auth" type="password" onChange={this.handle_pass_change}/></p>
                        <p><input type="submit" value="Вход"/></p>
                    </form>
                </div>
            </div>
        );
    }
}

export default Auth;
