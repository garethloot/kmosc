import { app, ipcMain } from 'electron'
import { electronApp, optimizer } from '@electron-toolkit/utils'
import TrayMenu from './TrayMenu'
import OSCServer from './OSCServer'
import Preferences from './preferences'
import { resolve } from 'path'
import { dialog } from 'electron'
import { parse } from 'url'

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient('kmosc', process.execPath, [resolve(process.argv[1])])
  }
} else {
  app.setAsDefaultProtocolClient('kmosc')
}

app.on('open-url', (_, url) => {
  const URI = parse(url, true)

  dialog.showErrorBox(
    'Welcome Back',
    `You arrived from: ${URI.pathname}, ${URI.hostname}, ${URI.port}, ${URI.query.value}`
  )
})

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
