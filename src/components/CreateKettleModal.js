import React, { Component } from 'react'
import { Modal, Input } from 'antd'
import firebase from 'firebase'

export default class CreateKettleModal extends Component {
  constructor (props) {
    super(props)

    this.state = {
      newName: '',
      buttonDisabled: true
    }
  }

  onChange (event) {
    this.setState({ newName: event.target.value })
    if ((event.target.value).length > 0) {
      this.setState({ buttonDisabled: false })
    }
  }

  createKettle () {
    firebase.database().ref('/kettles/' + this.state.newName).set({
      content: 'Welcome to your new Kettle!'
    })
  }

  onSubmit () {
    // check if kettle exists previously
    const kettle = firebase.database().ref('kettles/' + this.state.newName)
    kettle.once('value', snapshot => {
      if (!snapshot.exists()) {
        this.createKettle()
        this.props.updateKettle(this.state.newName)
        this.props.cancel()
      }
    })
  }

  render () {
    return (
      <Modal
        title="New Kettle"
        visible={this.props.visible}
        onOk={() => this.onSubmit()}
        onCancel={() => this.props.cancel()}
        okButtonProps={{disabled: this.state.buttonDisabled}}
      >
        <div>
      Remember, anybody can access your Kettle if they have the name, so if you want to keep it secret, make the name unique.
        </div>
        <Input
          placeholder="Kettle Name..."
          onChange={(event) => this.onChange(event)}
        />
      </Modal>
    )
  }
}
