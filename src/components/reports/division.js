import React from 'react'

const Division = (props) => {

  let foo = '';
  let split = props.division.split(';');
  if (split.includes('mixed') || split.includes('soft mixed')) foo += '⚥'
  if (split.includes('women')) foo += '♀'
  if (split.includes('open')) foo += '♂'

  return (
    <span>{foo}</span>
  )
}
export default Division