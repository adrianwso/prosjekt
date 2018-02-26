import React from 'react';
import ReactDOM from 'react-dom';
import { Link, HashRouter, Switch, Route } from 'react-router-dom';
import { userService } from './services';
import { mailService } from './mail';
import './style.css';

class Menu extends React.Component {
  render() {
    return (
      <ul className="navbar-ul">
        <li className="navbar-il"><Link to='/login' className="navbar-link">Login</Link></li>
        <li className="navbar-il"><Link to='/registration' className="navbar-link">Registration</Link></li>
      </ul>
    );
  }
}

class Loggedin extends React.Component {
  render() {
    return (
      <ul className="navbar-ul">
        <li className="navbar-il"><Link to='/login' className="navbar-link">Login</Link></li>
      </ul>
    );
  }
}

class Login extends React.Component {
  constructor(props) {
    super(props);
    // this.handleLogin = this.handleLogin.bind(this);
  }

  // handleLogin(event) {
  //   event.preventDefault();
  //   this.props.history.push('/home');
  // }

  render() {
    return (
        <div>
          <input ref='username' type='text' placeholder='Username' /> <br />
          <input ref='password' type='password' placeholder='Password' /> <br />
          <button ref='login'>Login</button> <br />
          <Link to='/forgotpassword'>Forgot password</Link>
        </div>
    );

    // return(
    //   <div>
    //     <form onSubmit={this.handleLogin}>
    //       <input type='submit' value='Login' />
    //     </form>
    //   </div>
    // );
  }

  componentDidMount () {
    this.refs.login.onclick = () => {
      userService.login(this.refs.username.value, this.refs.password.value, (result) => {
        if (result == undefined) {
          alert("Feil!")
        } else {
          let home = {
            userId: result.id,
            name: result.firstName,
          }
          ReactDOM.render(
            <HashRouter>
              <div>
                <Loggedin />
                <Switch>
                  <Route exact path='/home/:userId' component={Home} />
                  <Home userId={home.userId} />
                </Switch>
              </div>
            </HashRouter>
            , document.getElementById('root'));
          console.log('Logged in as ' + result.firstName + ' ' + result.lastName);
        }
      });
    }
  }
}

class Registration extends React.Component {
  render() {
   return (
     <div>
       <input ref="fname" placeholder="Type your firstname"></input><br/>
       <input ref="lname" placeholder="Type your lastname"></input><br/>
       <input ref="city" placeholder="Type your city"></input><br/>
       <input ref="adress" placeholder="Type your adress"></input><br/>
       <input ref="post" placeholder="Type your postalnumber"></input><br/>
       <input ref="tlf" placeholder="Type your phonenumber"></input><br/>
       <input ref="email" placeholder="Type your email"></input><br/>
       <input ref="username" placeholder="Type your username"></input><br/>
       <input ref="password1" placeholder="Type your password" type='password'></input><br/>
       <input ref="password2" placeholder="Type your password" type='password'></input><br/>
       <button ref="newUserButton">Register</button>
     </div>
   );
 }

 componentDidMount () {
   this.refs.newUserButton.onclick = () => {
     if(this.refs.password1.value != this.refs.password2.value) {
       console.log('The passwords must match');
     }

     else {
     userService.addUser(this.refs.fname.value, this.refs.lname.value, this.refs.city.value,
       this.refs.adress.value, Number(this.refs.post.value), Number(this.refs.tlf.value), this.refs.email.value, this.refs.username.value,
       this.refs.password1.value, (result) => {

       });
     }
   }
 }
}

class ForgotPassword extends React.Component {
  render() {
    return (
      <div>
        <Link to='/login'>Back to login</Link> <br/>
        <input ref="fpemail" placeholder="Type your email"></input><br/>
        <button ref="fpsubmit">Request</button>
      </div>
    );
  }

  componentDidMount() {
    this.refs.fpsubmit.onclick = () => {
      userService.getUserbyMail(this.refs.fpemail.value, (result) => {
        userService.resetPassword(result.email, result.username, (result, subject, text, email) => {
          mailService.sendMail(email, subject, text);
        });
      });
    }
  }
}

class Home extends React.Component {
  constructor(props) {
    super(props);

    this.user = {};

    this.id = props.userId;
  }

  render() {
    return(
      <div>
        <h5>Du er logget inn som { this.user.firstName + this.user.lastName }</h5>
        Change password: <br/>
        <input ref='oldpw' placeholder='Current password' type='password'></input> <br/>
        <input ref='newpw' placeholder='New password' type='password'></input> <br/>
        <input ref='confirmnewpw' placeholder='Confirm new password' type='password'></input> <br/>
        <button ref='submitnewpw'>Change password</button>
      </div>
    );
  }

  componentDidMount() {
    userService.getUser(this.id, (result) => {
      this.user = result;
      this.forceUpdate();
      console.log(this.user);
    });

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
            userService.getUser(this.id, (result) => {
              console.log('Password for ' + this.user.username + ' is updated.');
              this.user = result;
            });
          });
        }
      }
    }
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
          <Route exact path='/home/:userId' component={Home} />
          <Login />
        </Switch>
      </div>
    </HashRouter>
  ), document.getElementById('root'));



//   ReactDOM.render((
//     <HashRouter>
//       <div>
//         <Home />
//         <Switch>
//           <Route exact path='/home/:userId' component={Home} />
//         </Switch>
//       </div>
//     </HashRouter>
//   ))
