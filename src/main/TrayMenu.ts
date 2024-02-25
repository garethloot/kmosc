import { app, Tray, Menu, nativeImage } from 'electron'
import icon from '../../resources/handshake-solid.png?asset'
import createWindow from './createWindow'

class TrayMenu {
  constructor() {
    const trayIcon = nativeImage.createFromPath(icon)
    const tray = new Tray(trayIcon)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Preferences',
        type: 'normal',
        click: (): void => {
          createWindow()
        }
      },
      {
        label: 'Quit',
        type: 'normal',
        click: (): void => {
          app.quit()
        }
      }
    ])
    tray.setContextMenu(contextMenu)
  }
}

export default TrayMenu
