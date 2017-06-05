import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.css';
import * as firebase from 'firebase';
import MuiThemeProvider from 'material-ui/styles';

import AppBar from 'material-ui/AppBar';

import TextField from 'material-ui/TextField';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

// Initialize Firebase
var config = {
  apiKey: 'AIzaSyD71FqS5lCiGdJuE8UrfS4Ic_TgHsgikV4',
  authDomain: 'kettle-84ea2.firebaseapp.com',
  databaseURL: 'https://kettle-84ea2.firebaseio.com',
  projectId: 'kettle-84ea2',
  storageBucket: 'kettle-84ea2.appspot.com',
  messagingSenderId: '850017678808'
};
firebase.initializeApp(config);

export default class Kettle extends React.Component {
  constructor(props) {
    super(props);
    this.state = { value: '' };

    this.state = { currentKettle: '' };
    this.state = { kettleTitle: '' };
    this.state = { contentText: '' };

    this.handleChange = this.handleChange.bind(this);
    this.updateContent = this.updateContent.bind(this);
    this.onKeyPress = this.onKeyPress.bind(this);
  }

  state = {
    open: false
  };

  handleOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  onSubmit(event) {
    event.preventDefault();
    event.stopPropagation();
  }

  handleChange(event) {
    this.setState({ currentKettle: event.target.value });
  }

  onKeyPress(event) {
    if (event.which === 13) {
      event.preventDefault();
      this.handleSubmit(this.state.currentKettle);
    }
  }

  handleSubmit() {
    this.setState({ kettleTitle: this.state.currentKettle });
    var contentRef = firebase
      .database()
      .ref('kettles/' + this.state.currentKettle + '/content'); //this.state.kettleTitle = kettleId;

    var checkRef = firebase.database().ref('kettles/'); // Checks if the searched Kettle exists
    checkRef.on('value', snapshot => {
      if (!snapshot.hasChild(this.state.currentKettle)) {
        alert("Kettle doesn't exist");
      } else {
        contentRef.on('value', snapshot => {
          this.setState({ contentText: snapshot.val() });
        });
      }
    });
  }
  //test
  updateContent(e) {
    //this.setState({ contentText: e.target.value });
    firebase.database().ref('kettles/' + this.state.currentKettle + '/').set({
      content: e.target.value
    });
    var contentRef = firebase
      .database()
      .ref('kettles/' + this.state.currentKettle + '/content'); //this.state.kettleTitle = kettleId;

    var checkRef = firebase.database().ref('kettles/'); // Checks if the searched Kettle exists
    checkRef.on('value', snapshot => {
      contentRef.on('value', snapshot => {
        this.setState({ contentText: snapshot.val() });
      });
    });
  }

  render() {
    const actions = [
      <FlatButton label="Cancel" primary={true} onClick={this.handleClose} />,
      <FlatButton
        label="Submit"
        primary={true}
        keyboardFocused={true}
        onClick={this.handleClose}
      />
    ];
    return (
      <div>
        <AppBar title={this.state.kettleTitle} showMenuIconButton={false}>
          <form
            onKeyPress={this.onKeyPress}
            style={{
              display: 'flex',
              justifyContent: 'flex-start'
            }}
          >

            <TextField
              type="text"
              hintText="Search for Kettle..."
              hintStyle={{ color: 'white' }}
              onChange={this.handleChange}
            />

          </form>
        </AppBar>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        />
        <form
          style={{
            display: 'flex'
          }}
        >

          <textarea
            value={this.state.contentText}
            style={{
              borderColor: 'white',
              height: 500,
              width: '100%'
            }}
            onChange={this.updateContent}
          />

        </form>
        <FloatingActionButton
          backgroundColor="green"
          style={{
            position: 'fixed',
            bottom: 15,
            right: 15
          }}
          onClick={() => this.handleOpen()}
        >

          <ContentAdd />

        </FloatingActionButton>
        <Dialog
          title="New Kettle"
          actions={actions}
          modal={false}
          open={this.state.open}
          onRequestClose={this.handleClose}
        >
          <h4>
            Remember, anybody can access your Kettle if they have the name, so if you want to keep it secret, make the name unique.
          </h4>
          <TextField
            placeholder={'Kettle Name...'}
            style={{ textColor: 'black' }}
          />
        </Dialog>

      </div>
    );
  }
}
