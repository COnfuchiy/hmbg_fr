/**
 * Created by Dima on 02.10.2019.
 */

import React, {Component} from "react";
import axios from "axios";
import {RadialChart} from "react-vis";

//part 1 - events
class Events extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (<div className="latest_event">
            <p>Последние события</p>
            <div className="events_wrap">
                {this.props.list_events}
            </div>
        </div>);
    }
}
//part 2 - left header
class LeftHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            online: 0
        };
    }

    componentDidMount() {
        axios.get('/name/?username=' + this.props.username).then(res => {
            if (res.data.name !== undefined)
                this.setState({name: res.data.name});
            else
                this.setState({name: <a ref={'user/' + this.props.username}>Добавте свое имя</a>});
        });
        //this code set online users current family
    }

    render() {
        return (
            <div className="Left-header">
                <div className="user_part">
                    <div style={{float: 'left'}} className="user_pic">

                    </div>
                    <div style={{float: 'right'}} className="user_data">
                        <a>{this.props.username}</a><br/>
                        {this.state.name}
                    </div>
                </div>
                <div className="family_part">
                    <div style={{float: 'left'}} className="family_pic">

                    </div>
                    <div style={{float: 'right'}} className="family_data">
                        <a>{this.props.surname}</a><br/>
                        <a>Онлайн:{this.state.online}</a>
                    </div>
                </div>
            </div>
        );
    }
}
//part 3 - chart
class Chart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chart: undefined
        };
    }

    componentWillMount() {
        let all_consum = this.props.cons_array.all_consumption;
        let current_consumption = [];
        for (let consum in this.props.cons_array)
            if (consum !== 'all_consumption') {
                current_consumption.push(this.props.cons_array[consum]);
            }
        current_consumption = current_consumption.sort();
        current_consumption = current_consumption.map(cons => {
            cons = cons / all_consum * 100;
        });
        for (let i = 0; i < current_consumption.length; i++)
            current_consumption[i] = {angle: current_consumption[i], radius: 20, label: i.toString()};
        this.setState({chart: <RadialChart data={current_consumption} height={450} width={450} showLabels={true}/>});
    }

    render() {
        return (<div className="Chart">
            {this.state.chart}
        </div>);
    }
}
//part 4 -right-header
class RightHeader extends Component {
    constructor(props) {
        super(props);
        this.state = {
            consumption: []
        };
    }

    componentWillMount() {
        let current_consumption = [];
        if (this.props.cons_array.state !== 'no consumption') {
            current_consumption.push(<p>Всего расходов за текущий
                месяц:<span>{this.props.cons_array.all_consumption}</span></p>);
            for (let elem in this.props.cons_array) {
                if (elem !== 'all_consumption') {
                    current_consumption.push(<p className="Consumption"
                                                style={{backgroundColor: this.props.bgcolors[current_consumption.length]}}>
                        {(current_consumption.length).toString() + '. ' + elem + ':' + this.props.cons_array[elem] }
                    </p>)
                }
            }
        }
    }

    render() {
        return (<div className="Right-header">
            {this.state.consumption}
        </div>);
    }
}
//part 5 - user_api

//main_linker
class Main extends Component {
    constructor(props) {
        super(props);
        this.state = {
            events: undefined,
            list_events: []
        };
    }

    static translate_whats_upd(type, whats_upd) {
        switch (type) {
            case 'Consumption': {
                if (whats_upd.includes('name'))
                    return 'изменено имя расхода:с ' + whats_upd.slice(17, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('category'))
                    return 'измененa категория расхода:с ' + whats_upd.slice(21, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('date'))
                    return 'изменена дата расхода:с ' + whats_upd.slice(17, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('value'))
                    return 'изменено знанчение расхода:с ' + whats_upd.slice(17, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                break;
            }
            case 'Category': {
                if (whats_upd.includes('name')) {
                    return 'изменено имя категории:с ' + whats_upd.slice(17, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                }
                break;
            }
            case 'AP_Category': {
                if (whats_upd.includes('name'))
                    return 'изменено имя категории с автоплатежом:с ' + whats_upd.slice(17, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('value'))
                    return 'изменено значение категории с автоплатежом:с ' + whats_upd.slice(31, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('ap_date'))
                    return 'изменен день автоплатежа категории с автоплатежом:с ' + whats_upd.slice(19, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                break;
            }
            case 'Credit': {
                if (whats_upd.includes('name'))
                    return 'изменено имя кредита:с ' + whats_upd.slice(17, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('payday'))
                    return 'изменен день выплаты:с ' + whats_upd.slice(19, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('planned_pay'))
                    return 'изменено значение платежа:с ' + whats_upd.slice(24, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                if (whats_upd.includes('start_date'))
                    return 'изменена дата начала кредита:с ' + whats_upd.slice(23, whats_upd.indexOf(' on ')) + ' на ' +
                        whats_upd.slice(whats_upd.indexOf(' on '));
                break;
            }
        }
    }

    componentWillMount() {
        axios.get('/main').then(res => {
            this.setState({list_events: res.data});
            axios.get('/main/events').then(res => {
                let list_events = res.data;
                /*list_events = list_events.map(event => {
                    if (event.state.includes('Consumption')) {
                        if (event.state === 'Append consumption') {
                            event =
                                <p><span
                                    className="Date">{event.date}</span>{event.username + 'добавил(а) в категорию - ' +
                                event.category_name + ' расход:' + event.cons_name + '(' + event.value + 'руб ).'}</p>;
                        }
                        else {
                            event =
                                <p><span className="Date">{event.date}</span>{event.username + 'обновил(а) расход ' +
                                event.cons_name + ' в категории - ' + event.category_name + ': ' +
                                Events.translate_whats_upd('Consumption', event.what_upd)}
                                </p>;
                        }
                        return;
                    }
                    if (event.state.includes('Category was')) {
                        if (event.state === 'Category was update') {
                            event = <p><span className="Date">{event.date}</span>{event.username + '(а) категорию -' +
                            event.elem_name + ':' + Events.translate_whats_upd('Category', event.what_upd)}</p>;
                        }
                        else {
                            event =
                                <p><span className="Date">{event.date}</span>{event.username + 'создал(а) категорию :' +
                                event.elem_name}</p>;
                        }
                        return;
                    }
                    if (event.state.includes('AP_Category was')) {
                        if (event.state === 'AP_Category was update') {
                            event = <p><span
                                className="Date">{event.date}</span>{event.username + 'обновил(а) категорию с автоплатежом -' +
                            event.elem_name + ':' + Events.translate_whats_upd('AP_Category', event.what_upd)}</p>;
                        }
                        else {
                            event = <p><span
                                className="Date">{event.date}</span>{event.username + 'создал(а) категорию с автоплатежом :' + event.elem_name}
                            </p>;
                        }
                        return;
                    }
                    if (event.state.includes('Credit was')) {
                        if (event.state === 'Credit was update') {
                            event =
                                <p><span className="Date">{event.date}</span>{event.username + 'обновил(а) кредит -' +
                                event.elem_name + ':' + Events.translate_whats_upd('Credit', event.what_upd)}</p>;
                        }
                        else {
                            event = <p><span
                                className="Date">{event.date}</span>{event.username + 'создал(а) кредит :' + event.elem_name}
                            </p>;
                        }
                        return;
                    }
                    if (event.state.includes('Family')) {
                        event = <p><span
                            className="Date">{event.date}</span>{event.username + 'создал(а) эту семью'}
                        </p>;
                    }
                });*/
                for (let i = 0; i<list_events.length;i++){
                    if (list_events[i].state.includes('Consumption')) {
                        if (list_events[i].state === 'Append consumption') {
                            list_events[i] =
                                <p><span
                                    className="Date">{list_events[i].date}</span>{list_events[i].username + 'добавил(а) в категорию - ' +
                                list_events[i].category_name + ' расход:' + list_events[i].cons_name + '(' + list_events[i].value + 'руб ).'}</p>;
                        }
                        else {
                            list_events[i] =
                                <p><span className="Date">{list_events[i].date}</span>{list_events[i].username + 'обновил(а) расход ' +
                                list_events[i].cons_name + ' в категории - ' + list_events[i].category_name + ': ' +
                                Events.translate_whats_upd('Consumption', list_events[i].what_upd)}
                                </p>;
                        }
                        continue;
                    }
                    if (list_events[i].state.includes('Category was')) {
                        if (list_events[i].state === 'Category was update') {
                            list_events[i] = <p><span className="Date">{list_events[i].date}</span>{list_events[i].username + '(а) категорию -' +
                            list_events[i].elem_name + ':' + Events.translate_whats_upd('Category', list_events[i].what_upd)}</p>;
                        }
                        else {
                            list_events[i] =
                                <p><span className="Date">{list_events[i].date}</span>{list_events[i].username + 'создал(а) категорию :' +
                                list_events[i].elem_name}</p>;
                        }
                        continue;
                    }
                    if (list_events[i].state.includes('AP_Category was')) {
                        if (list_events[i].state === 'AP_Category was update') {
                            list_events[i] = <p><span
                                className="Date">{list_events[i].date}</span>{list_events[i].username + 'обновил(а) категорию с автоплатежом -' +
                            list_events[i].elem_name + ':' + Events.translate_whats_upd('AP_Category', list_events[i].what_upd)}</p>;
                        }
                        else {
                            list_events[i] = <p><span
                                className="Date">{list_events[i].date}</span>{list_events[i].username + 'создал(а) категорию с автоплатежом :' + list_events[i].elem_name}
                            </p>;
                        }
                        continue;
                    }
                    if (list_events[i].state.includes('Credit was')) {
                        if (list_events[i].state === 'Credit was update') {
                            list_events[i] =
                                <p><span className="Date">{list_events[i].date}</span>{list_events[i].username + 'обновил(а) кредит -' +
                                list_events[i].elem_name + ':' + Events.translate_whats_upd('Credit', list_events[i].what_upd)}</p>;
                        }
                        else {
                            list_events[i] = <p><span
                                className="Date">{list_events[i].date}</span>{list_events[i].username + 'создал(а) кредит :' + list_events[i].elem_name}
                            </p>;
                        }
                        continue;
                    }
                    if (list_events[i].state.includes('Family')) {
                        list_events[i] = <p><span
                            className="Date">{list_events[i].date}</span>{list_events[i].username + 'создал(а) эту семью'}
                        </p>;
                    }
                }
                this.setState({events: <Events list_events={list_events}/>,list_events:list_events});
            });

        });}

        render()
        {
            return (
                <div className="App">
                    <div className="left-part" style={{float: 'left'}}>
                        {this.state.events}
                    </div>
                    <div className="center" style={{float: 'right'}}>
                        <div className="chart" style={{float: 'left'}}>
                            <Chart cons_array={this.state.list_events}/>
                        </div>
                        <div className="right-part" style={{float: 'right'}}>
                            <RightHeader cons_array={this.state.list_events}/>
                        </div>
                        <div className="user-api">

                        </div>
                    </div>
                </div>
            );
        }
    }

    export
    default
    Main;