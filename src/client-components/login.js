/* global chrome */

import React from 'react';

import { Button, Grid, Paper, TextField, Typography } from '@material-ui/core';
import { PhoneAndroid } from '@material-ui/icons';
import styles from './styles';

import IP from '../IP';
import axios from 'axios';
//==================================================== 
class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
      wrongEmailOrPass: false, 
    }

    this.handleKeyDown = this.handleKeyDown.bind(this);
  }
  //====================================================
  componentDidMount() {
  }
  //====================================================
  handleKeyDown = (e) => {
    if(e.keyCode == 13 && e.shiftKey == false) {
      e.preventDefault();
      this.submitLogin();
    }
  }
  
  redirectToSignup(){
    this.props.changeScreen('signup');
  }
  
  submitLogin() {
    if (this.state.email.length) {
      axios.post(`http://${IP}/api/login`, {
        email: this.state.email,
        password: this.state.password,
      }).then(results => {
        if (results.data === 'Wrong email or password') {
          this.setState({
            wrongEmailOrPass: true,
          });
        } else {
          let { email, name } = results.data;
          chrome.storage.sync.set({
            'cbLogin': {
              'isLoggedIn': true,
              'email': email,
              'name': name,
            }
          });
          this.props.changeScreen('main');
        }
      }).catch(error => {
        console.log('Error in validating user login:', error);
      });
    }
  }

  updateEmail(e) {
    this.setState({
      email: e.target.value,
      wrongEmailOrPass: false,
    });
  }

  updatePassword(e) {
    this.setState({
      password: e.target.value,
      wrongEmailOrPass: false,
    });
  }

  //====================================================
  render() {
    return (
      <div style={{ width: 218, backgroundImage: 'url("./4.jpg")', border: '1px solid lightgray', textAlign: 'center' }}>
        <div style={{ marginTop: 10}}>
          <img src="./logo.png" height="120" width="120"></img>
          <Typography variant="body2" color="inherit">
            <span style={{ marginRight: 5, textDecoration: 'underline' }}>Login</span> 
            <span style={{ marginLeft: 5 }} onClick={this.redirectToSignup.bind(this)}>Sign Up</span>
          </Typography>
        </div>
        <Paper style={{ width: '90%', margin: 'auto', borderRadius: '20px', marginTop: 10, marginBottom: 10 }}>
        <div style={{ paddingTop: 10, paddingBottom: 10 }}>
          <TextField
            style={{ height: 40, width: '60%', margin: 'auto' }}
            placeholder='Email'
            onChange={this.updateEmail.bind(this)}
            inputProps={{style: styles.textField}}
            />
          {this.state.wrongEmailOrPass
            ? (<p style={styles.warningText}>Wrong email or password.</p>)
            : (null)}
          <TextField
            style={{ height: 40, width: '60%', margin: 'auto' }}
            type='password'
            placeholder='Password'
            secureTextEntry={true}
            onChange={this.updatePassword.bind(this)}
            inputProps={{style: styles.textField}}
            onKeyDown={this.handleKeyDown}
          />
          <div style={{ textAlign: 'center'}}>
            <Button 
              variant='contained' 
              color='primary'
              size='small'
              onClick={this.submitLogin.bind(this)}>
            Log In 
            </Button>
          </div>
        </div>
        </Paper>
      <Grid container onClick={() => window.open('https://play.google.com/store/apps/details?id=org.chuiohrobinson.flexchef')}>
        <Grid item xs={10} style={{ textAlign: 'right', marginTop: '2px' }}><Typography variant="body1" color="inherit">Check out our mobile app!</Typography></Grid>
        <Grid item xs={2} style={{ textAlign: 'left' }}><PhoneAndroid /></Grid>
      </Grid>
      </div>
    )
  }
}

export default Login;