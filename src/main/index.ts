import { app, ipcMain } from 'electron'
import { optimizer } from '@electron-toolkit/utils'
import TrayMenu from './TrayMenu'
import Preferences from './preferences'
import OSCServer from './OSCServer'
import { runCLI } from './runCLI'

const checkIfCalledViaCLI = (args): boolean => {
  if (!app.isPackaged) return false
  if (args && args.length > 1) {
    return true
  }
  return false
}

const runApp = (): void => {
  app.dock.hide()

  const preferences = new Preferences()
  const oscServer = new OSCServer(preferences)
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
}

app.whenReady().then(() => {
  const cli = checkIfCalledViaCLI(process.argv)
  if (cli) {
    runCLI()
  } else {
    runApp()
  }
})
