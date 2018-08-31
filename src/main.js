import React, { Component } from 'react'
import * as firebase from 'firebase'

import {
  Input, Button, Modal, Form, Icon
} from 'antd'

const Search = Input.Search
const FormItem = Form.Item

// Initialize Firebase
const config = {
  apiKey: 'AIzaSyD71FqS5lCiGdJuE8UrfS4Ic_TgHsgikV4',
  authDomain: 'kettle-84ea2.firebaseapp.com',
  databaseURL: 'https://kettle-84ea2.firebaseio.com',
  projectId: 'kettle-84ea2',
  storageBucket: 'kettle-84ea2.appspot.com',
  messagingSenderId: '850017678808'
}
firebase.initializeApp(config)

export default class Kettle extends Component {
  constructor (props) {
    super(props)

    this.state = {
      value: '',
      currentKettle: '',
      kettleTitle: '',
      contentText: '',
      showModal: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.updateContent = this.updateContent.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
  }

  componentDidMount () {
    if (window.location.pathname.length > 1) {
      const kettle = window.location.pathname.slice(1)
      this.getKettle(kettle)
    }
  }

  showModal () {
    this.setState({ showModal: true })
  }

  hideModal () {
    this.setState({ showModal: false })
  }

  onSubmit (event) {
    event.preventDefault()
    event.stopPropagation()
  }

  handleChange (event) {
    this.setState({ currentKettle: event.target.value })
  }

  onKeyPress (event) {
    if (event.which === 13) {
      event.preventDefault()
      this.getKettle(this.state.currentKettle)
    }
  }

  getKettle (kettle) {
    this.setState({ kettleTitle: kettle })
    const contentRef = firebase
      .database()
      .ref(`kettles/${kettle}/content`) // this.state.kettleTitle = kettleId;

    const checkRef = firebase.database().ref('kettles/') // Checks if the searched Kettle exists
    checkRef.on('value', (snapshot) => {
      if (!snapshot.hasChild(kettle)) {
        alert("Kettle doesn't exist")
      } else {
        contentRef.on('value', (snapshot) => {
          this.setState({ contentText: snapshot.val() })
        })
      }
    })
  }

  updateContent (e) {
    firebase.database().ref(`kettles/${this.state.currentKettle}/`).set({
      content: e.target.value
    })
    const contentRef = firebase
      .database()
      .ref(`kettles/${this.state.currentKettle}/content`) // this.state.kettleTitle = kettleId;

    const checkRef = firebase.database().ref('kettles/') // Checks if the searched Kettle exists
    checkRef.on('value', (snapshot) => {
      contentRef.on('value', (snapshot) => {
        this.setState({ contentText: snapshot.val() })
      })
    })
  }

  render () {
    return (
      <div>
        <div style={{ textAlign: 'center', fontSize: '24px', marginTop: '20px' }}>
          <Icon type="coffee" />
kettle
          <small>
({this.state.kettleTitle})
          </small>
        </div>
        <Button
          style={{
            margin: '20px auto',
            display: 'flex'
          }}
          onClick={() => this.showModal()}
        >
           Add
        </Button>
        <form
          onKeyPress={this.onKeyPress}
          style={{ maxWidth: '900px', margin: '0px auto' }}
        >
          <FormItem>
            <Search
              type="text"
              placeholder="Search for Kettle..."
              size="large"
              enterButton="Search"
              onSearch={() => this.getKettle(this.state.currentKettle)}
              onChange={this.handleChange}
              style={{borderRadius: '20px !important'}}
            />
          </FormItem>

          <FormItem>
            <Input.TextArea
              value={this.state.contentText}
              onChange={e => this.updateContent(e)}
            />
          </FormItem>
        </form>
        <div />

        <Modal
          title="New Kettle"
          visible={this.state.showModal}
          onOk={e => this.onKeyPress(e)}
          onCancel={() => this.hideModal()}
        >
          <div>
            Remember, anybody can access your Kettle if they have the name, so if you want to keep it secret, make the name unique.
          </div>
          <Input
            placeholder="Kettle Name..."
          />
        </Modal>
      </div>
    )
  }
}
