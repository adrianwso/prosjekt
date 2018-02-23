import mysql from 'mysql';

// Setup database server reconnection when server timeouts connection:
let connection;
function connect() {
  connection = mysql.createConnection({
    host: 'mysql.stud.iie.ntnu.no',
    user: 'paalaro',
    password: '0O1nNGBm',
    database: 'paalaro'
  });

  // Connect to MySQL-server
  connection.connect((error) => {
    if (error) throw error; // If error, show error in console and return from this function
  });

  // Add connection error handler
  connection.on('error', (error) => {
    if (error.code === 'PROTOCOL_CONNECTION_LOST') { // Reconnect if connection to server is lost
      connect();
    }
    else {
      throw error;
    }
  });
}
connect();

// Class that performs database queries related to customers
class UserService {
  getUsers(callback) {
    connection.query('SELECT * FROM Users', (error, result) => {
      if (error) throw error;

      callback(result);
    });
  }

  getUser(id, callback) {
    connection.query('SELECT * FROM Users WHERE id=?', [id], (error, result) => {
      if (error) throw error;

      callback(result[0]);
    });
  }

  addUser(fname, lname, city, adress, postalnumber, phonenumber, email, username, password, callback) {
    connection.query('INSERT INTO Users (firstName, lastName, city, adress, postalnumber, phonenumber, email, username, password) values (?, ?, ?, ?, ?, ?, ?, ?, ?)', [fname, lname, city, adress, postalnumber, phonenumber, email, username, password], (error, result) => {
      if (error) throw error;

      else {
        console.log(fname + " " + lname + " is registered.");
      }

      callback();
    });
  }

  login(username, password, callback) {
    connection.query('SELECT * FROM Users WHERE (username=? AND password=?)', [username, password], (error, result) => {
      if (error) throw error;

      console.log(result[0]);

      callback(result[0]);
    });
  }

  resetPassword(username, email, callback) {
    var newPassword = Math.random().toString(36).slice(-8);

    connection.query('UPDATE Users SET password=? WHERE (username=? AND email=?)', [newPassword, username, email], (error, result) => {
      if (error) throw error;

      let subject = "Password reset for " + username;
      let text = "Your new password is: " + newPassword;

      callback(result, subject, text, email);
    });
  }
}

let userService = new UserService();

export { userService };
