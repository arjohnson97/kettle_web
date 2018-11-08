import React, { PureComponent } from 'react'
import * as firebase from 'firebase'
import { config } from './components/config'

import {
  Input, Button, Form, Icon, Menu, Dropdown, notification
} from 'antd'

import CreateKettleModal from './components/CreateKettleModal'
import ImageDropper from './components/ImageDropper'

const Search = Input.Search
const FormItem = Form.Item

// Initialize Firebase
firebase.initializeApp(config)

const storage = firebase.storage()
const database = firebase.database()
const storageRef = storage.ref()
const kettlesRef = storageRef.child('kettles/')

export default class Kettle extends PureComponent {
  constructor (props) {
    super(props)

    this.state = {
      value: '',
      currentKettle: '',
      content: '',
      showModal: false,
      searchedKettle: '',
      error: false,
      allKettles: [],
      images: []
    }

    this.handleChange = this.handleChange.bind(this)
    this.updateKettle = this.updateKettle.bind(this)
    this.hideModal = this.hideModal.bind(this)
    this.updateContent = this.updateContent.bind(this)
    this.onKeyPress = this.onKeyPress.bind(this)
    this.handleUpload = this.handleUpload.bind(this)
  }

  componentDidMount () {
    if (window.location.pathname.length > 1) {
      const kettle = window.location.pathname.slice(1)
      this.getKettle(kettle)
    }
    this.getAllKettles()
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

  getAllKettles () {
    const checkRef = database.ref('kettles')
    checkRef.on('value', (snapshot) => {
      this.setState({ allKettles: Object.keys(snapshot.val() || []) })
    })
  }

  deleteImage (index) {
    const name = this.state.images[index].name
    const ref = storageRef.child(`kettles/${this.state.currentKettle}/${name}`)

    ref.delete().then(() => {
      database.ref(`kettles/${this.state.currentKettle}/images/${name.replace(/\./g, '')}`).remove().then(() => {
        this.notify(false)
      })
    })
  }

  getKettle (kettle) {
    const ref = firebase
      .database()
      .ref(`kettles/${kettle}/`)

    const checkRef = database.ref('kettles/') // Checks if the searched Kettle exists
    checkRef.on('value', (snapshot) => {
      if (!snapshot.hasChild(kettle)) {
        this.setState({ currentKettle: '', error: true })
      } else {
        ref.on('value', (snapshot) => {
          this.setState({ currentKettle: kettle,
            content: snapshot.val().content || '',
            images: snapshot.val().images ? Object.values(snapshot.val().images) : [],
            error: false })
        })
      }
    })
  }

  updateContent (e) {
    database.ref(`kettles/${this.state.currentKettle}/`).update({
      content: e.target.value
    })
    const contentRef = firebase
      .database()
      .ref(`kettles/${this.state.currentKettle}/content`) // this.state.kettleTitle = kettleId;

    const checkRef = database.ref('kettles/') // Checks if the searched Kettle exists
    checkRef.on('value', (snapshot) => {
      contentRef.on('value', (snapshot) => {
        this.setState({ content: snapshot.val() })
      })
    })
  }

  updateKettle (newKettleName) {
    this.getKettle(newKettleName)
    this.setState({ currentKettle: newKettleName, showModal: false })
  }

  handleUpload (files) {
    files.map((file, index) => {
      const ref = kettlesRef.child(`${this.state.currentKettle}/${file.name}`)

      let blob = new Blob([file], {type: file.type})

      ref.put(blob).then(snapshot => {
        const name = file.name.replace(/\./g, '')
        database.ref(`kettles/${this.state.currentKettle}/images/${name}`).set({
          name: snapshot.metadata.name,
          downloadURL: snapshot.downloadURL,
          size: snapshot.metadata.size,
          timeCreated: snapshot.metadata.timeCreated,
          contentType: snapshot.metadata.contentType
        })
        this.notify(true)
      })

      return file
    })
  }

  notify (good) {
    notification.open({
      message: `Image ${good ? `Uploaded` : `Deleted`}`,
      description: good ? 'Yay! 🎉' : 'If it was a mistake, then oops 🤭'
    })
  }

  render () {
    const menu = (
      <Menu>
        {this.state.allKettles.map(kettle => {
          return (
            <Menu.Item onClick={() => this.getKettle(kettle)} key={kettle}>{kettle}</Menu.Item>
          )
        })}
      </Menu>
    )

    const images = (
      <div>
        {this.state.images.map((image, index) => {
          return <img key={image.downloadURL} src={image.downloadURL} alt={image.name} height="auto" width="200" onClick={() => this.deleteImage(index)} />
        })}
      </div>
    )

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
          <Dropdown overlay={menu} trigger={['click']}>
            <div style={{width: '100%', margin: '10px 0', textAlign: 'center'}}>Kettles <Icon type="down" /></div>
          </Dropdown>
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
              value={this.state.content}
              onChange={e => this.updateContent(e)}
            />
          </FormItem>

        </form>
        <ImageDropper handleUpload={this.handleUpload} />

        <div />
        { this.state.images.length > 0 && images }
        <CreateKettleModal visible={this.state.showModal} cancel={this.hideModal} updateKettle={this.updateKettle} />
      </div>
    )
  }
}
