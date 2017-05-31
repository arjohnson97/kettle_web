import React from 'react';
import ReactDOM from 'react-dom';
import styles from './index.css';
import * as firebase from 'firebase';

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

class Kettle extends React.Component {
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
    return (
      <div>
        <form
          onKeyPress={this.onKeyPress}
          style={{
            display: 'flex',
            justifyContent: 'flex-start'
          }}
        >

          <input
            type="text"
            placeholder={'Search for Kettle...'}
            style={{
              borderWidth: 3,
              borderColor: '#fcfdff',
              borderRadius: 1,
              padding: 5,
              margin: 10
            }}
            onChange={this.handleChange}
          />

        </form>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >
          <h1>
            {this.state.kettleTitle}

          </h1>

        </div>
        <form
          style={{
            display: 'flex',
            justifyContent: 'center'
          }}
        >

          <textarea
            value={this.state.contentText}
            style={{ borderColor: 'white', height: 500, width: 500 }}
            onChange={this.updateContent}
          />

        </form>

      </div>
    );
  }
}

// ========================================

ReactDOM.render(<Kettle />, document.getElementById('root'));

// ========================================
