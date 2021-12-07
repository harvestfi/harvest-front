import React, { useState, useEffect } from 'react'

const Checkbox = props => {
  const {
    borderColor,
    borderRadius,
    borderStyle,
    borderWidth,
    checkbox,
    className,
    checked,
    containerClassName,
    containerStyle,
    label,
    labelClassName,
    labelStyle,
    name,
    onChange,
    reference,
    right,
    size,
    style,
    value,
    icon,
    disabled,
  } = props
  const [check, setCheck] = useState(checked)

  const toggle = e => {
    e.preventDefault()
    setCheck(!check)
    onChange(!check)
  }

  useEffect(() => {
    setCheck(checked)
  }, [checked])

  return (
    <div
      tabIndex={0}
      role="button"
      style={{
        ...containerStyle,
        display: 'flex',
        alignItems: 'center',
        outline: 'none',
        cursor: disabled ? 'not-allowed' : 'pointer',
      }}
      className={containerClassName}
      onClick={e => {
        if (!disabled) {
          toggle(e)
        }
      }}
      aria-hidden="true"
    >
      {(right && label && (
        <span className={labelClassName} style={labelStyle}>
          {label}
        </span>
      )) ||
        null}
      {checkbox || (
        <span>
          <div
            style={{
              ...style,
              height: size,
              width: size,
              borderWidth,
              borderColor,
              borderStyle,
              borderRadius,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              opacity: disabled ? 0.5 : 1,
              pointerEvents: disabled ? 'none' : 'auto',
              backgroundColor: 'white',
              fontSize: 9,
            }}
            className={className}
          >
            {(check && icon) || null}
            <input
              ref={reference}
              type="checkbox"
              name={name}
              checked={check}
              value={value}
              onChange={e => {
                if (!disabled) {
                  toggle(e)
                }
              }}
              hidden
            />
          </div>
        </span>
      )}
      {(!right && label && (
        <span className={labelClassName} style={labelStyle}>
          {label}
        </span>
      )) ||
        null}
    </div>
  )
}
Checkbox.defaultProps = {
  borderColor: '#F2B435',
  borderStyle: 'solid',
  borderWidth: 2,
  borderRadius: 5,
  checked: false,
  right: false,
  name: '',
  size: 18,
  style: {},
  className: '',
  labelStyle: {
    marginLeft: 10,
    userSelect: 'none',
    fontWeight: 500,
    fontSize: '14px',
  },
  labelClassName: '',
  containerStyle: {},
  containerClassName: '',
  value: '',
  onChange: null,
  icon: <div style={{ backgroundColor: 'white', borderRadius: 5, padding: 5 }} />,
}
export default Checkbox
