import { Client } from 'node-osc'
import { app } from 'electron'

const createOSCSClient = (ip: string, port: number): Client => {
  const oscClient = new Client(ip, port)

  app.on('open-url', (_, url) => {
    oscClient.send(url)
  })

  return oscClient
}

class OSCServer {
  private client: Client

  constructor(ip: string, port: number) {
    this.client = createOSCSClient(ip, port)
  }

  changePreferences(ip: string, port: number): void {
    this.client.close()
    this.client = createOSCSClient(ip, port)
  }

  close(): void {
    this.client.close()
  }
}

export default OSCServer
