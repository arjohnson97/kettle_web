import React, { Component } from 'react'
// import styled from 'styled-components'
import Dropzone from 'react-dropzone'

const dropzone = {
  position: 'relative',
  border: '1px solid lightgray',
  width: '100%',
  maxWidth: '900px',
  padding: '20px',
  textAlign: 'center',
  cursor: 'pointer'
}

const activeDropzone = {
  border: 'none',
  boxShadow: 'lightgreen 0px 0px 8px 2px'
}

export default class imageDropper extends Component {
  constructor () {
    super()
    this.state = {
      files: []
    }
  }

  onDrop (files) {
    this.setState({
      files: this.state.files.length > 0 ? this.state.files.concat(files.map(file => ({
        file
      }))) : files.map(file => ({
        file
      }))
    })

    this.props.handleUpload(files)
  }

  render () {
    return (
      <section>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Dropzone
            accept="image/*"
            onDrop={this.onDrop.bind(this)}
            style={dropzone}
            activeStyle={activeDropzone}
          >
          Ways to upload: <br />
          1. Drag and drop <br />
          2. Click here to open file explorer
          </Dropzone>
        </div>
      </section>
    )
  }
}
