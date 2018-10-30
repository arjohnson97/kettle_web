import React, { Component } from 'react'
import * as firebase from 'firebase'

import {
  Input, Button, Form, Icon
} from 'antd'

import CreateKettleModal from './components/CreateKettleModal'

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
      contentText: '',
      showModal: false,
      searchedKettle: '',
      error: false
    }

    this.handleChange = this.handleChange.bind(this)
    this.updateKettle = this.updateKettle.bind(this)
    this.hideModal = this.hideModal.bind(this)
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

  handleChange (event) {
    this.setState({ searchedKettle: event.target.value })
  }

  onKeyPress (event) {
    if (event.which === 13) {
      event.preventDefault()
      this.getKettle(this.state.searchedKettle)
    }
  }

  getKettle (kettle) {
    const contentRef = firebase
      .database()
      .ref(`kettles/${kettle}/content`) // this.state.kettleTitle = kettleId;

    const checkRef = firebase.database().ref('kettles/') // Checks if the searched Kettle exists
    checkRef.on('value', (snapshot) => {
      if (!snapshot.hasChild(kettle)) {
        this.setState({ currentKettle: '', error: true })
      } else {
        contentRef.on('value', (snapshot) => {
          this.setState({ currentKettle: kettle, contentText: snapshot.val(), error: false })
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

  updateKettle (newKettleName) {
    this.getKettle(newKettleName)
    this.setState({ currentKettle: newKettleName, showModal: false })
  }

  render () {
    return (
      <div style={{padding: '0px 20px', userSelect: 'none'}}>
        <div style={{ textAlign: 'center', fontSize: '24px', marginTop: '20px' }}>
          <Icon type="coffee" /> kettle | <small>{this.state.currentKettle}</small>
        </div>
        <Button
          style={{
            margin: '20px auto',
            display: 'flex',
            border: 'none'
          }}
          className="add-button"
          onClick={() => this.showModal()}
        >
          <Icon type="plus-circle" className="create-icon" />
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
              enterButton
              onSearch={() => this.getKettle(this.state.searchedKettle)}
              onChange={this.handleChange}
              style={{borderRadius: '20px !important'}}
              autoFocus
              className="searchBar"
            />
          </FormItem>
          {this.state.error && <span style={{color: 'red'}}>Kettle does not exist.</span>}
          <FormItem>
            <Input.TextArea
              value={this.state.contentText}
              onChange={e => this.updateContent(e)}
            />
          </FormItem>
        </form>
        <div />

        <CreateKettleModal visible={this.state.showModal} cancel={this.hideModal} updateKettle={this.updateKettle} />
      </div>
    )
  }
}
