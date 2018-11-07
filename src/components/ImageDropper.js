import React, { Component } from 'react'
// import styled from 'styled-components'
import Dropzone from 'react-dropzone'

// const Wrapper = styled.div`
//     text-align: center;
// `

const thumbsContainer = {
  display: 'flex',
  flexDirection: 'row',
  flexWrap: 'wrap',
  marginTop: 16,
  justifyContent: 'center'
}

const thumb = {
  display: 'inline-flex',
  borderRadius: 2,
  border: '1px solid #eaeaea',
  marginBottom: 8,
  marginRight: 8,
  width: 100,
  height: 100,
  padding: 4,
  boxSizing: 'border-box'
}

const thumbInner = {
  display: 'flex',
  minWidth: 0,
  overflow: 'hidden'
}

const img = {
  display: 'block',
  width: 'auto',
  height: '100%'
}

export default class imageDropper extends React.Component {
  constructor () {
    super()
    this.state = {
      files: []
    }
  }

  onDrop (files) {
    this.setState({
      files: this.state.files.length > 0 ? this.state.files.concat(files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))) : files.map(file => ({
        file,
        preview: URL.createObjectURL(file)
      }))
    })

    this.props.handleUpload(this.state.files.concat(files))
  }

  componentWillUnmount () {
    // Make sure to revoke the data uris to avoid memory leaks
    const {files} = this.state
    for (let i = files.length; i >= 0; i--) {
      const file = files[0]
      URL.revokeObjectURL(file.preview)
    }
  }

  render () {
    const {files} = this.state

    const thumbs = files.map(file => (
      <div style={thumb} key={file.preview}>
        <div style={thumbInner}>
          <img
            src={file.preview}
            style={img}
          />
        </div>
      </div>
    ))

    return (
      <section>
        <div style={{display: 'flex', justifyContent: 'center'}}>
          <Dropzone
            accept="image/*"
            onDrop={this.onDrop.bind(this)}
          >
          Ways to upload: <br />
          1. Drag and drop <br />
          2. Click here to open file explorer
          </Dropzone>
        </div>
        {/* <aside style={thumbsContainer}>
          {thumbs}
        </aside> */}
      </section>
    )
  }
}
