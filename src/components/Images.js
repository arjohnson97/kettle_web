import React, { Component } from 'react'
import styled from 'styled-components'
import { Button } from 'antd'

const Wrapper = styled.div`
//  max-width: 900px;
 margin: 30px auto;
 display: flex;
 flex-direction: row;
 flex-wrap: wrap;
`

const Container = styled.div`
margin: 30px 10px;
object-fit: contain;
display: flex;
align-items: center;
flex-direction: column;

img {
    border: 1px solid black;
}
`

const StyledButton = styled(Button)`
margin-top: -13%;
`

export default class Images extends Component {
  render () {
    const { images } = this.props
    return (
      <Wrapper>
        {images.length > 0 && images.map((image, index) => {
          return <Image image={image} index={index} delete={this.props.deleteImage} />
        })}
      </Wrapper>
    )
  }
}

class Image extends Component {
  constructor (props) {
    super(props)
    this.state = { hover: false }
  }
  render () {
    return (
      <Container><a target="_blank" href={this.props.image.downloadURL}><img onMouseOut={() => this.setState({hover: false})} onMouseEnter={() => this.setState({hover: true})} key={this.props.image.downloadURL} src={this.props.image.downloadURL} alt={this.props.image.name} height="auto" width="300" /></a> { this.state.hover && <StyledButton onMouseEnter={() => this.setState({ hover: true })} onClick={() => this.props.delete(this.props.index)}>Delete</StyledButton>}</Container>
    )
  }
}
