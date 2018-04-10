import React from 'react';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { eventService } from './services';
import { loggedin } from './outlogged';
import BigCalendar from 'react-big-calendar'
import moment from 'moment'

BigCalendar.setLocalizer(BigCalendar.momentLocalizer(moment))

export class EventList extends React.Component {
  constructor() {
    super();

    this.evntList = [];
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  render() {
    let evntsList = [];
    for (let evnt of this.evntList) {
      let day = evnt.start.getDate();
      let month = evnt.start.getMonth() + 1;
      let year = evnt.start.getFullYear();
      console.log(day + '/' + month + '/' + year);
      evntsList.push(<tr key={evnt.eventid} className='tableRow' onClick={() => this.nextPath('/eventdetails/' + evnt.eventid)}><td className='tableLines'>{evnt.title}</td><td className='tableLines'>{evnt.start.toISOString().split("T")[0]}</td><td className='tableLines'>{evnt.end.toISOString().split("T")[0]}</td></tr>)
    }

    if (loggedin.admin == true) {
      return(
        <div>
          <div className='tableList'>
            <table className='eventTable'>
              <thead>
                <tr>
                  <th className='tableLines'>Navn</th>
                  <th className='tableLines'>Start</th>
                  <th className='tableLines'>Slutt</th>
                </tr>
              </thead>
              <tbody>
              {evntsList}
              </tbody>
            </table>
            <br />
            <button onClick={() => this.nextPath('/createevent')}>Lag arrangement</button>
          </div>
          <div style={{height: 400}}>
             <BigCalendar
               events={this.evntList}
               showMultiDayTimes
               defaultDate={new Date(2018, 2, 1)}
               selectAble ={true}
               onSelectEvent={event => this.props.history.push('/eventdetails/' + event.eventid)
           }
               />
           </div>
         </div>
      );
    }

    else {
      return(
        <div className='tableList'>
          <table className='eventTable'>
            <thead>
              <tr>
                <th className='tableLines'>Navn</th>
                <th className='tableLines'>Start</th>
                <th className='tableLines'>Slutt</th>
              </tr>
            </thead>
            <tbody>
            {evntsList}
            </tbody>
          </table>
        </div>
      );
    }
  }

  componentDidMount () {
    eventService.getAllEvents((result) => {
      this.evntList = result;
      this.forceUpdate();
    });
  }
}

export class EventDetails extends React.Component {
  constructor(props) {
    super(props);

    this.evnt = {};

    this.id = props.match.params.eventId;
    console.log(this.id);
  }

  fixDate(date) {
    let day = date.getDate();
    let month = date.getMonth() + 1;
    let year = date.getFullYear();
    let hours = date.getHours();
    if (hours < 10) {
      hours = '0' + hours;
    }
    let mins = date.getMinutes();
    if (mins < 10) {
      mins = '0' + mins;
    }

    let dateTime = startday + '/' + startmonth + '/' + startyear + ' ' + starthours + ':' + startmins;
    console.log(dateTime);
    return(dateTime);
  }

  render() {
    return(
      <div>
        <h3>{this.evnt.title}</h3> <br />
        Start: {this.start} <br />
        Slutt: {this.end} <br />
      </div>
    );
  }

  componentDidMount() {
    eventService.getEvent(this.id, (result) => {
      this.evnt = result;
      this.forceUpdate();
    });
  }
}

export class EventDetailsAdmin extends React.Component {
  constructor(props) {
    super(props);

    this.arrangement = {};

    this.id = props.match.params.eventId;
  }

  render() {
    return(
      <div>
        {this.arrangement.title}
      </div>
    );
  }

  componentDidMount() {
    eventService.getEvent(this.id, (result) => {
      this.arrangement = result;
      this.forceUpdate();
    });
  }
}

export class CreateEvent extends React.Component {
  render() {
    return(
      <div>
        <input ref='title' type='text' placeholder='Tittel'/> <br />
        <input ref='text' type='text' placeholder='Beskrivelse'/> <br />
        <input ref='start' type='datetime' placeholder='Startdato'/> <br />
        <input ref='end' type='date' placeholder='Sluttdato'/> <br />
        <input ref='adresse' type='text' placeholder='Adresse'/> <br />
        <input ref='postalnumber' type='text' maxLength='4' placeholder='Postnr'/> <br />
        <button ref='createEvent'>Registrer arrangement</button>
      </div>
    );
  }

  componentDidMount() {
    this.refs.createEvent.onclick = () => {
      eventService.createEvent(this.refs.title.value, this.refs.text.value, this.refs.start.value, this.refs.end.value, this.refs.adresse.value, this.refs.postalnumber.value, (result) => {
        console.log('Arr reg');
      });
    }
  }
}
