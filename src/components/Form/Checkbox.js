import React from 'react'

import { Icon } from '@component/Basic'
import { Button } from '@component/Form'
import { COLOR, FAMILY, SIZE } from '@theme/typography'

const Checkbox = (props) => {
  const { style, checked, onChange, prefix, suffix, color, ...p } = props

  p.onPress = () => {
    onChange && onChange(!checked)
  }

  const iconStyle = { color: color || 'black' }
  if (prefix || suffix) {
    iconStyle.paddingHorizontal = 5
  }

  return (
    <Button style={props.style ? [styles.container, props.style] : styles.container} {...p}>
      {prefix}
      <Icon name={checked ? 'check-square' : 'square'} type='Feather' style={styles.icon} />
      {suffix}
    </Button>
  )
}

const styles = {
  container: {
    paddingHorizontal: 5
  },
  icon: {
    fontSize: SIZE.SIZE18,
    color: COLOR.grey,
  }
}

export default Checkbox