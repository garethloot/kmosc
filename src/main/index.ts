import { app, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import TrayMenu from './TrayMenu'
import { resolve } from 'path'
import Preferences from './preferences'
import OSCServer from './OSCServer'
import OSCClient from './OSCClient'

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('kmosc', process.execPath, [resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('kmosc')
}

app.whenReady().then(() => {
  electronApp.setAppUserModelId('nl.garethloot.KMOSC')
  app.dock.hide()

  const preferences = new Preferences()
  const oscServer = new OSCServer(preferences)
  new OSCClient()
  new TrayMenu()

  ipcMain.on('changePort', (_, arg) => {
    preferences.port = arg
    preferences.write()
    oscServer.restart()
  })

  ipcMain.on('changeSlash', (_, arg) => {
    preferences.slashRequired = arg
    preferences.write()
    oscServer.restart()
  })

  app.on('browser-window-created', (_, window) => {
    optimizer.watchWindowShortcuts(window)
  })

  app.on('window-all-closed', () => {
    app.dock.hide()
    if (process.platform !== 'darwin') {
      app.quit()
    }
  })

  app.on('will-quit', () => {
    oscServer.close()
  })
})
