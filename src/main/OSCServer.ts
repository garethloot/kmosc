import { Server } from 'node-osc'
import { runMacro } from './macro'
import Preferences from './preferences'

const createOSCServer = (port: number): Server => {
  const oscServer = new Server(port, '0.0.0.0', () => {
    console.log('OSC Server is listening')
  })

  return oscServer
}

class OSCServer {
  private server: Server
  private preferences: Preferences

  constructor(preferences: Preferences) {
    this.preferences = preferences
    this.server = createOSCServer(this.preferences.port)
    this.handleOSCMessage()
  }

  private handleOSCMessage(): void {
    this.server.on('message', (msg) => {
      const [address, ...args] = msg
      const macroName = this.preferences.slashRequired ? address : address.substring(1)
      const parameters = args.join(',')
      console.log(`Running macro: ${macroName} with parameters: ${parameters}`)
      runMacro(macroName, parameters)
    })
  }

  restart(): void {
    this.server.close()
    this.server = createOSCServer(this.preferences.port)
    this.handleOSCMessage()
  }

  close(): void {
    this.server.close()
  }
}

export default OSCServer
