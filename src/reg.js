/**
 * Created by Dima on 25.09.2019.
 */

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import  Redirect from 'react-router-dom';
import axios from 'axios';

class Registration extends Component {
    constructor(props) {
        super(props);
        this.send_to_server = this.send_to_server.bind(this);
        this.handle_username_change = this.handle_username_change.bind(this);
        this.handle_pass_change = this.handle_pass_change.bind(this);
        this.handle_ag_pass_change = this.handle_ag_pass_change.bind(this);
        this.handle_email_change = this.handle_email_change.bind(this);
        this.handle_surname_change = this.handle_surname_change.bind(this);
        this.valid_login = this.valid_login.bind(this);
        this.view_create_family = this.view_create_family.bind(this);
        this.have_family = this.have_family.bind(this);
        this.personal_bg = this.personal_bg.bind(this);
        this.state = {
            username: '',
            password: '',
            again_password: '',
            email: '',
            family_surname:'',
            not_twice_user: false,
            twice_pass: false,
            state_family: false,
        };
    }

    handle_username_change(e) {
        this.setState({username: e.target.value});
    }

    handle_pass_change(e) {
        this.setState({password: e.target.value});
        this.setState({twice_pass: false});
    }

    handle_ag_pass_change(e) {
        this.setState({again_password: e.target.value});
        this.setState({twice_pass: false});
    }

    handle_email_change(e) {
        this.setState({email: e.target.value});
    }
    handle_surname_change(e){
        this.setState({family_surname:e.target.value});
    }
    view_create_family(){
        ReactDOM.render('', document.getElementsByClassName('refer_area')[0]);
        ReactDOM.render(<div>
            <p>Введите фамилию создаваемой семьи:</p>
            <input className="family_surname" type="text" onChange={this.handle_surname_change}/>
        </div>, document.getElementsByClassName('create_family')[0]);
        this.setState({state_family:'create'});
    }

    have_family(){
        ReactDOM.render('', document.getElementsByClassName('create_family')[0]);
        ReactDOM.render(<div>
            <p>Введите реферальную ссылку:</p>
            <input className="refer_url" type="text"/>
        </div>, document.getElementsByClassName('refer_area')[0]);
        this.setState({state_family:'have'});
    }
    personal_bg(){
        ReactDOM.render('', document.getElementsByClassName('refer_area')[0]);
        ReactDOM.render('', document.getElementsByClassName('create_family')[0]);
        this.setState({state_family:'not'});
    }

    valid_login(){
        //default valid
        document.getElementsByClassName('load_pic_place')[0].style.display = 'block';
        let cur_elem = this;
        axios.post('/reg/username',{username:this.state.username}).then(function (response) {
            document.getElementsByClassName('load_pic_place')[0].style.display = 'None';
            if (response.data.state==='oks')
                cur_elem.setState({not_twice_user:true});
            else
                cur_elem.setState({not_twice_user:false});
        });
    }
    valid_pass(){
        if (this.state.password !== this.state.again_password) {
            this.setState({twice_pass: false});
        }
        else {
            this.setState({twice_pass: true});
        }
    }
    send_to_server(e) {
        e.preventDefault();
        this.valid_pass(this);
        if (this.state.twice_pass && this.state.not_twice_user){
            if (this.state.state_family === 'create')
                axios.post('/reg/',{username:this.state.username, password:this.state.password,
                    family_aff:this.state.family_surname,state_family:this.state.state_family,email:this.state.email})
                    .then(function (response) {
                        if (response.data.state==='oks'){
                            alert('Семья успешно создана!');
                            window.location.href = '/';
                        }
                    });
        }
    }

    render() {
        return (
            <div className="App">
                <div className="App-content">
                    <h4>Регистрация нового пользователя</h4>
                    <form className="registration" onSubmit={this.send_to_server}>
                        <div style={{paddingLeft:'70px',textAlign:'left',}}>
                        <div className="username_wrap">
                            <input type="text" className="username_in" onChange={this.handle_username_change}
                                   onBlur={this.valid_login}
                                   placeholder="Имя пользователя"/>
                            <span  className="load_pic_place" style={{display:'None'}}><img src="/load.gif" /></span>
                        </div>
                        <div className="password_wrap">
                            <input type="password" className="password_in" onChange={this.handle_pass_change}
                                   placeholder="Пароль"/><br/>
                            <input type="password" className="ag_password_in" onChange={this.handle_ag_pass_change}
                                   placeholder="Еще раз пароль"/>
                        </div>
                        <div className="email_wrap">
                            <input type="email" className="email" onChange={this.handle_email_change}
                                   placeholder="Email"/>
                        </div>
                        </div>
                        <div style={{paddingLeft:'70px',textAlign:'left',}}><div className="check_btm_wrap" >
                            <input type="radio" className="check_create" name="state_family" value="create" id="rb1"
                                   onChange={this.view_create_family}/>
                            <label htmlFor="rb1">Создать новую семью</label>
                            <div className="create_family">

                            </div>
                            <input type="radio" className="check_find" name="state_family" value="have" id="rb2"
                                onChange={this.have_family}/>
                            <div className="refer_area">

                            </div>
                            <input type="radio" className="no_family" name="state_family" value="not" id="rb3"/>
                            <label htmlFor="rb3">Индивидуальный бюджет</label>
                        </div>
                        </div>
                        <input type="submit" value="Зарегестрироваться"/>
                    </form>
                </div>
            </div>
        );
    }
}
export default Registration;