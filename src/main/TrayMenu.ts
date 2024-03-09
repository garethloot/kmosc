import { app, Tray, Menu, nativeImage } from 'electron'
import icon from '../../resources/tray.png?asset'
import createPreferencesWindow from './createPreferencesWindow'

class TrayMenu {
  private window: Electron.BrowserWindow | null = null
  constructor() {
    const trayIcon = nativeImage.createFromPath(icon)
    const tray = new Tray(trayIcon)
    const contextMenu = Menu.buildFromTemplate([
      {
        label: 'Preferences',
        type: 'normal',
        click: (): void => {
          if (this.window && !this.window.isDestroyed()) {
            this.window.show()
            return
          }
          this.window = createPreferencesWindow()
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
