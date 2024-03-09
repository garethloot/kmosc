import { ipcMain, app } from 'electron'
import { readFileSync, writeFileSync } from 'fs'
import { join } from 'path'
import { PreferencesJSON } from '../shared/types'

const defaultPreferences: PreferencesJSON = {
  openAtLogin: false,
  port: 1000,
  slashRequired: true
}

const preferencesPath = join(app.getPath('userData'), 'preferences.json')

class Preferences {
  public port: number
  public slashRequired: boolean
  public openAtLogin: boolean

  constructor() {
    const preferences = this.read()
    this.port = preferences.port
    this.slashRequired = preferences.slashRequired
    this.openAtLogin = preferences.openAtLogin

    this.handleIpc()
  }

  handleIpc(): void {
    ipcMain.on('changeOpenAtLogin', (_, arg) => {
      this.openAtLogin = arg
      this.write()
      app.setLoginItemSettings({ openAtLogin: arg })
    })

    ipcMain.handle('getPreferences', () => {
      return this.getPreferences()
    })
  }

  read(): PreferencesJSON {
    try {
      return JSON.parse(readFileSync(preferencesPath, 'utf-8'))
    } catch (error) {
      return defaultPreferences
    }
  }

  getPreferences(): PreferencesJSON {
    return { port: this.port, slashRequired: this.slashRequired, openAtLogin: this.openAtLogin }
  }

  write(): void {
    writeFileSync(
      preferencesPath,
      JSON.stringify({
        port: this.port,
        slashRequired: this.slashRequired,
        openAtLogin: this.openAtLogin
      })
    )
  }
}

export default Preferences
