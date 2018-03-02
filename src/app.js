import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';
import { mailService } from './mail';
import { Menu, LoggedinMenu, AdminLoggedinMenu } from './menues';
import { Login, Registration, Registered, ForgotPassword, PasswordSent, loggedin, updateUserDetails } from './outlogged';
import { Profile, EditProfile} from './profile';
import { UnconfirmedUsers } from './unconfirmed';

let loggedinUser = {};

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.user = {};

    this.id = props.userId;
  }

  render() {
    return(
      <div>
        <h5>Du er logget inn som { this.user.firstName + ' ' + this.user.lastName }</h5>
      </div>
    );
  }

  componentDidMount() {
    userService.getUser(this.id, (result) => {
      this.user = result;
      this.forceUpdate();
    });
  }
}

class ChangePassword extends React.Component {
  constructor(props) {
    super(props);

    this.user = loggedin;
  }
  render() {
    return(
      <div>
        Change password: <br/>
        <input ref='oldpw' placeholder='Current password' type='password'></input> <br/>
        <input ref='newpw' placeholder='New password' type='password'></input> <br/>
        <input ref='confirmnewpw' placeholder='Confirm new password' type='password'></input> <br/>
        <button ref='submitnewpw'>Change password</button>
      </div>
    )
  }

  nextPath(path) {
    this.props.history.push(path);
  }

  componentDidMount() {
    this.refs.submitnewpw.onclick = () => {
      if (this.user.password != this.refs.oldpw.value) {
        console.log('Old password is wrong.');
      }

      else {
        if(this.refs.newpw.value != this.refs.confirmnewpw.value) {
          console.log('The new passwords are not matching.');
        }

        else {
          userService.changePassword(this.user.id, this.refs.newpw.value, (result) => {
            userService.getUser(this.user.id, (result) => {
              console.log('Password for ' + this.user.username + ' is updated.');
              updateUserDetails();
              this.nextPath('/profile/' + this.user.id);
            });
          });
        }
      }
    }
  }
}

class Events extends React.Component {
  render() {
    return(
      <div>
        Test
      </div>
    );
  }
}

class Skills extends React.Component {
  render() {
    return(
      <div>
        Skills
      </div>
    );
  }
}

// The Route-elements define the different pages of the application
// through a path and which component should be used for the path.
// The path can include a variable, for instance
// path='/customer/:customerId' component={CustomerDetails}
// means that the path /customer/5 will show the CustomerDetails
// with props.match.params.customerId set to 5.

ReactDOM.render((
  <HashRouter>
    <div>
      <Menu />
      <Switch>
        <Route exact path='/registration' component={Registration} />
        <Route exact path='/login' component={Login} />
        <Route exact path='/forgotpassword' component={ForgotPassword} />
        <Route exact path='/passwordsent/:mail' component={PasswordSent} />
        <Route exact path='/registered' component={Registered} />
        <Login />
      </Switch>
    </div>
  </HashRouter>
), document.getElementById('root'));

export function renderLogin(user) {
  ReactDOM.render((
    <HashRouter>
      <div>
        <LoggedinMenu userId={user}/>
        <Switch>
          <Route exact path='/profile/:userId' component={Profile} />
          <Route exact path='/events' component={Events} />
          <Route exact path='/skills' component={Skills} />
          <Route exact path='/editProfile/:userId' component={EditProfile} />
          <Route exact path='/changePassword/:userId' component={ChangePassword} />
          <Home userId={user} />
        </Switch>
      </div>
    </HashRouter>
  ), document.getElementById('root'));
}

export function renderAdminLogin(user) {
  ReactDOM.render((
    <HashRouter>
      <div>
        <AdminLoggedinMenu userId={user}/>
        <Switch>
          <UnconfirmedUsers />
        </Switch>
      </div>
    </HashRouter>
  ), document.getElementById('root'));
}
