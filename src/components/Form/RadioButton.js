import React from 'react'

import { Icon } from '@component/Basic'
import { Button, TextInput } from '@component/Form'

const RadioButton = ({variant = 'default', ...props}) => {
  const { style, checked, onChange, prefix, color, ...p } = props

  p.onPress = () => {
    onChange && onChange(!checked)
  }

  const iconStyle = { color: color || 'black' }
  if (prefix) {
    iconStyle.paddingHorizontal = 5
  }

  return (
    <Button style={props.style ? [styles.container, props.style] : styles.container} {...p}>
      {prefix}
      <Icon name={checked ? 'check-circle' : 'circle'} type='Feather' style={iconStyle} />
    </Button>
  )
}

const styles = {
  container: {
    paddingHorizontal: 5
  }
}

export default RadioButton
