import React from 'react';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { eventService } from './services';
import { loggedin } from './outlogged';

export class EventList extends React.Component {
  constructor() {
    super();

    this.evntList = [];
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  render() {
    let evntsList = [];
    for (let evnt of this.evntList) {
      evntsList.push(<tr key={evnt.eventid} className='tableRow' onClick={() => this.nextPath('/eventdetails/' + evnt.eventid)}><td className='tableLines'>{evnt.title}</td><td className='tableLines'>{evnt.start}</td><td className='tableLines'>{evnt.end}</td></tr>)
    }

    if (loggedin.admin == true) {
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
          <br />
          <button onClick={() => this.nextPath('/createevent')}>Lag arrangement</button>
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

    this.event = {};

    this.id = props.match.params.eventId;
  }

  render() {
    return(
      <div>
        <h3>{this.event.title}</h3>
      </div>
    );
  }

  componentDidMount() {
    eventService.getEvent(this.id, (result) => {
      this.event = result;
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
        <input ref='title' type='text' /> <br />
        <input ref='text' type='text' /> <br />
        <input ref='start' type='date' /> <br />
        <input ref='end' type='date' /> <br />
        <input ref='adresse' type='text' /> <br />
        <button>Bekreft</button>
      </div>
    );
  }

  componentDidMount() {

  }
}
