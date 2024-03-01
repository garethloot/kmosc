import { app, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import TrayMenu from './TrayMenu'
import OSCServer from './OSCServer'
import Preferences from './preferences'

app.whenReady().then(() => {
  // Set app user model id for windows
  const preferences = new Preferences()
  electronApp.setAppUserModelId('nl.garethloot.KMOSC')
  app.dock.hide()

  const oscServer = new OSCServer(preferences.port, preferences.slashRequired)

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('will-quit', () => {
    oscServer.close()
  })

  ipcMain.on('changePort', (_, arg) => {
    preferences.port = arg
    oscServer.changePreferences(preferences.port, preferences.slashRequired)
    preferences.write()
  })

  ipcMain.on('changeSlash', (_, arg) => {
    preferences.slashRequired = arg
    oscServer.changePreferences(preferences.port, preferences.slashRequired)
    preferences.write()
  })

  ipcMain.on('changeOpenAtLogin', (_, arg) => {
    preferences.openAtLogin = arg
    app.setLoginItemSettings({ openAtLogin: arg })
    preferences.write()
  })

  ipcMain.handle('getPreferences', () => {
    return preferences
  })

  app.on('window-all-closed', () => {
    app.dock.hide()
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  new TrayMenu()
})
