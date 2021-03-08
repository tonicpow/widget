/* global localStorage */

export default class Storage {
  /*
  removeStorage: removes a key from localStorage and its sibling expiry key
  params:
      key <string> : localStorage key to remove
  returns:
      <boolean> : telling if operation succeeded
  */
  removeStorage = (name: string) => {
    try {
      localStorage.removeItem(name)
      localStorage.removeItem(`${name}_expiresIn`)
    } catch (e) {
      console.log(
        `removeStorage: Error removing key [${name}] from localStorage: ${JSON.stringify(e)}`
      )
      return false
    }
    return true
  }

  /*
  getStorage: retrieves a key from localStorage previously set with setStorage().
  params:
      key <string> : localStorage key
  returns:
      <string> : value of localStorage key
      null : in case of expired key or failure
  */
  getStorage = (key: string) => {
    // epoch time, lets deal only with integer
    const now = Date.now()

    // Set expiration for storage
    let expires

    try {
      expires = localStorage.getItem(`${key}_expires`)
    } catch (e) {
      console.log(`getItem: error getting localStorage: ${JSON.stringify(e)}`)
      return null
    }

    if (expires === undefined || expires === null) {
      expires = 0
    }

    // Expired
    if (expires < now) {
      this.removeStorage(key)
      return null
    }

    // Get the existing item
    try {
      return localStorage.getItem(key)
    } catch (e) {
      console.log(`getStorage: Error reading key [${key}] from localStorage: ${JSON.stringify(e)}`)
      return null
    }
  }

  /*
  setStorage: writes a key into localStorage setting a expire time
  params:
      key <string>     : localStorage key
      value <string>   : localStorage value
      expires <number> : number of seconds from now to expire the key
  returns:
      <boolean> : telling if operation succeeded
  */
  setStorage = (key: string, value: string, expires: number | null = null) => {
    // Expired time
    if (expires) {
      expires = Math.abs(expires) // make sure it's positive
    } else {
      expires = 24 * 60 * 60 // default: seconds for 1 day
    }

    // Milli seconds since epoch time, lets deal only with integer
    const now = Date.now()
    const schedule = now + expires * 1000
    try {
      localStorage.setItem(key, value)
      localStorage.setItem(`${key}_expires`, schedule.toString())
    } catch (e) {
      console.log(`setStorage: Error setting key [${key}] in localStorage: ${JSON.stringify(e)}`)
      return false
    }
    return true
  }
}
