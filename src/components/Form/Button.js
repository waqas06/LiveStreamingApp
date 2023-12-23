import { Pressable } from 'react-native'

import { COLOR } from '@theme/typography'
import React from 'react'
import { Icon, Text } from '@component/Basic'

export const Button = ({variant = 'default', disabled, style, children, ...props}) => {
  const btnStyle = [styles.button[variant]]
  if (disabled) {
    btnStyle.push(styles.disabled)
  }
  if (style) {
    btnStyle.push(style)
  }
  return <Pressable
      {...props}
      style={btnStyle}
  >
    {children}
  </Pressable>
}

const styles = {
  button: {
    default: {
    
    },
    primary: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: COLOR.default,
      alignItems: 'center',
      padding: 20,
    },
    secondary: {
    
    },
  },
  disabled: {
    backgroundColor: COLOR.dark
  },
  size: {}
}

export default Button
