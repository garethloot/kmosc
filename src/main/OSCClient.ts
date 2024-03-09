import { Client, Message } from 'node-osc'
import { app } from 'electron'
import { parse } from 'url'

const sendOSCMessage = (url: string): void => {
  const { pathname, hostname, port, query } = parse(url, true)

  if (!pathname || !hostname || !port) return
  const message: Message = new Message(pathname)

  const { value, valueType } = query

  if (typeof value === 'string' && typeof valueType === 'string') {
    switch (valueType) {
      case 'int':
        message.append(parseInt(value))
        break
      case 'float':
        message.append(parseFloat(value))
        break
      case 'boolean':
        message.append(Boolean(value))
        break
      case 'string':
        message.append(value)
        break
      default:
        return
    }
  }

  const oscClient = new Client(hostname, Number(port))
  oscClient.send(message, () => {
    oscClient.close()
  })
}

class OSCClient {
  constructor() {
    app.on('open-url', (_, url) => {
      sendOSCMessage(url)
    })
  }
}

export default OSCClient
