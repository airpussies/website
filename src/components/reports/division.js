import React from 'react'

export default class Division extends React.Component {

  render() {
    let foo = '';
    let split = this.props.division.split(';');
    if (split.includes('mixed') || split.includes('soft mixed')) foo += '⚥'
    if (split.includes('women')) foo += '♀'
    if (split.includes('open')) foo += '♂'
    return (
      <span>{foo}</span>
    )
  }
}