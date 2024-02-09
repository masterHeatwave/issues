import { isValid } from 'date-fns'
import { format, zonedTimeToUtc } from 'date-fns-tz'

export const formatDate = (value: unknown, formatString = 'dd/MM/yyyy') => {
  const { timeZone } = Intl.DateTimeFormat().resolvedOptions()
  if (value instanceof Date) {
    if (isValid(value)) {
      return format(value, formatString, {
        timeZone
      })
    }
  } else if (typeof value === 'string') {
    value = zonedTimeToUtc(value.split('.')[0], 'UTC')
    if (isValid(value)) {
      return format(value as Date, formatString, {
        timeZone
      })
    }
  } else if (typeof value === 'number') {
    return format(value, formatString, {
      timeZone
    })
  }
  return null
}

export const ellipsize = (maxLength: number, value: string | undefined | null): any => {
  if (!value) {
    return value
  }

  if (value.length > maxLength) {
    return `${value.substr(0, maxLength)}...`
  }

  return value
}

export const formatDateTime = (value: unknown, formatString = 'dd/MM/yyyy kk:mm') => {
  return formatDate(value, formatString)
}

export const numberToBase26 = (val: number, tail = ''): string => {
  if (val <= 26) {
    return `${String.fromCharCode(val + 64)}${tail}`
  }
  const remainder = val % 26 || 26
  const division = Math.trunc(val / 26) - (remainder === 26 ? 1 : 0)
  return numberToBase26(division, `${String.fromCharCode(remainder + 64)}${tail}`)
}

export const roundDigit = (number: number, digit = 0) => {
  digit = 10 ** digit
  return Math.round(number * digit) / digit
}

export const stringToColor = (string: string) => {
  let hash = 0
  let i
  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash)
  }
  let color = '#'
  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff
    color += `00${value.toString(16)}`.substr(-2)
  }
  /* eslint-enable no-bitwise */
  return color
}

export const scrollTop = () => {
  const elems = document.querySelectorAll<HTMLElement>('html, body')
  elems.forEach(elem =>
    elem.scrollTop !== 0 ? elem.scroll({ top: 0, behavior: 'smooth' }) : undefined
  )
}

export const delay = (delay = 300) =>
  new Promise<void>(resolve => {
    setTimeout(() => {
      resolve()
    }, delay)
  })

export const formatContent = (content: string | null) => {
  return content
}
