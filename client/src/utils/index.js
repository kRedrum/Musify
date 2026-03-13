import { forEach } from 'lodash'

/**
 * Acces localstorage and return the value of the key.
 * If you van to access nested key, you can use dot notation. Example: `status.balance`
 * @param {string} key simple or nested key to find
 * @returns null or the value of the key
 */
export const readFromLocalStorage = (key) => {
  const keyMap = key.split('.')
  let current = JSON.parse(localStorage.getItem(keyMap[0]))
  forEach(keyMap.slice(1), (key, index) => {
    if (!current || !current[key]) {
      return null
    }
    if (index === keyMap.length - 2) {
      current = current[key]
    }
    current = current[key]
  })
  return current
}

/**
 * Set localstorage and return the value of the key.
 * You can set nested object as value. Example: `status.balance`
 * @param {string} key simple or nested key to find
 * @param {any} value to set as the last object value
 */
export const saveToLocalStorage = (key, value) => {
  const keyMap = key.split('.')
  const parsedData = JSON.parse(localStorage.getItem(keyMap[0])) || {}
  let current = parsedData
  forEach(keyMap.slice(1), (key, index) => {
    if (!current || !current[key]) {
      current[key] = {}
    }
    if (index === keyMap.length - 2) {
      current[key] = value
    }
    current = current[key]
  })
  localStorage.setItem(keyMap[0], JSON.stringify(parsedData))
}
