import React from 'react'
import { TextInput as NativeTextInput } from 'react-native'
import { COLOR } from '@theme/typography'

const TextInput = ({variant = 'default', ...props}) => {
  const { style, ...p } = props
  return (
    <NativeTextInput
        style={props.style ? [styles.container, props.style] : styles.container}
        {...p}
    >{props.children}</NativeTextInput>
  )
}

const styles = {
  container: {
    paddingHorizontal: 5
  },
  default:{
    backgroundColor: COLOR.dark
  },
}

export default TextInput
