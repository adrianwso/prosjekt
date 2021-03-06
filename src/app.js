import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';
import { mailService } from './mail';
import { Menu, LoggedinMenu, AdminLoggedinMenu } from './menues';
import { Login, Registration, Registered, ForgotPassword, PasswordSent, loggedin, updateUserDetails, selectUser } from './outlogged';
import { Profile, MyProfile, EditProfile } from './profile';
import { Requests, UserListAdmin, UserList, UserDetails } from './users';
import { EventList, EventDetails, CreateEvent } from './events'
import crypto from 'crypto';

crypto.DEFAULT_ENCODING = 'hex';

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

      crypto.pbkdf2(this.refs.oldpw.value, 'RødeKors', 100, 64, 'sha512', (err, derivedKey) => {
        if (err) throw err;

        this.oldpw = derivedKey;

        if (this.user.passw != this.oldpw) {
          console.log('Det gamle passordet stemmer ikke');
        }

        else {
          if(this.refs.newpw.value != this.refs.confirmnewpw.value) {
            console.log('De nye passordene stemmer ikke');
          }

          else {
            crypto.pbkdf2(this.refs.newpw.value, 'RødeKors', 100, 64, 'sha512', (err, derivedKey) => {
              if (err) throw err;

              this.newpw = derivedKey;

              userService.changePassword(this.user.id, this.newpw, (result) => {
                userService.getUser(this.user.id, (result) => {
                  updateUserDetails();
                  this.nextPath('/profile/' + this.user.id);
                });
              });
            });
          }
        }
      });
    }
  }
}


// The Route-elements define the different pages of the application
// through a path and which component should be used for the path.
// The path can include a variable, for instance
// path='/customer/:customerId' component={CustomerDetails}
// means that the path /customer/5 will show the CustomerDetails
// with props.match.params.customerId set to 5.


export function renderOutlogged() {
  let loggedinUser = userService.getSignedInUser();
  if (loggedinUser != undefined) {
    if (loggedinUser.admin == true) {
      renderAdminLogin(loggedinUser.id);
      selectUser(loggedinUser);
    }
    else {
      renderLogin(loggedinUser.id);
      selectUser(loggedinUser);
    }
  }
  else {
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
  }
}

renderOutlogged();

export function renderLogin(user) {
  ReactDOM.render((
    <HashRouter>
      <div>
        <LoggedinMenu userId={user}/>
        <Switch>
          <Route exact path='/myprofile/:userId' component={MyProfile} />
          <Route exact path='/eventlist' component={EventList} />
          <Route exact path='/skills' component={Skills} />
          <Route exact path='/editprofile' component={EditProfile} />
          <Route exact path='/changepassword' component={ChangePassword} />
          <Route exact path='/userlist' component={UserList} />
          <Route exact path='/userdetails/:userId' component={UserDetails} />
          <Route exact path='/eventlist' component={EventList} />
          <Route exact path='/eventdetails/:eventId' component={EventDetails} />
          <EventList />
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
          <Route exact path='/userlistadmin' component={UserListAdmin} />
          <Route exact path='/requests' component={Requests} />
          <Route exact path='/myprofile/:userId' component={MyProfile} />
          <Route exact path='/profile/:userId' component={Profile} />
          <Route exact path='/editprofile' component={EditProfile} />
          <Route exact path='/eventlist' component={EventList} />
          <Route exact path='/eventdetails/:eventId' component={EventDetails} />
          <Route exact path='/createevent' component={CreateEvent} />
          <Route exact path='/changepassword' component={ChangePassword} />
          <Requests />
        </Switch>
      </div>
    </HashRouter>
  ), document.getElementById('root'));
}
