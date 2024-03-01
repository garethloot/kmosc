import { Server } from 'node-osc'
import { runMacro } from './macro'

const createOSCServer = (port: number): Server => {
  const oscServer = new Server(port, '0.0.0.0', () => {
    console.log('OSC Server is listening')
  })

  return oscServer
}

class OSCServer {
  private oscServer: Server
  private slashRequired: boolean

  constructor(port: number, slashRequired: boolean) {
    this.slashRequired = slashRequired
    this.oscServer = createOSCServer(port)
    this.handleOSCMessage()
  }

  private handleOSCMessage(): void {
    this.oscServer.on('message', (msg) => {
      const [address, ...args] = msg
      const macroName = this.slashRequired ? address : address.substring(1)
      const parameters = args.join(',')
      console.log(`Running macro: ${macroName} with parameters: ${parameters}`)
      runMacro(macroName, parameters)
    })
  }

  changePreferences(port: number, slashRequired: boolean): void {
    this.slashRequired = slashRequired
    this.oscServer.close()
    this.oscServer = createOSCServer(port)
    this.handleOSCMessage()
  }

  close(): void {
    this.oscServer.close()
  }
}

export default OSCServer
