import { Client, Message } from 'node-osc'
import { z } from 'zod'

const schema = z.object({
  host: z
    .string()
    .ip({ message: 'Error: <host> must be a valid email address or localhost' })
    .or(z.literal('localhost')),
  port: z.coerce
    .number()
    .gt(1, { message: 'Error: <port> must be a number greater than 1' })
    .refine((value) => !isNaN(value), {
      message: 'Error: <port> must be a number greater than 1'
    }),
  address: z.string().startsWith('/', { message: 'Error: <address> must start with a /' }),
  type: z.string().refine((value) => ['int', 'float', 'string', 'boolean'].includes(value), {
    message: 'Error: <message> must be one of "int", "float", "string", or "boolean"'
  }),
  message: z.string().min(1, { message: 'Error: <message> must be a non-empty string' })
})

export const sendOSCMessage = (
  host: string,
  port: string,
  address: string,
  valueType: 'int' | 'boolean' | 'float' | 'string',
  value: string
): void => {
  const parsed = schema.safeParse({
    host,
    port,
    address,
    type: valueType,
    message: value
  })

  if (!parsed.success) {
    console.error(parsed.error.errors.forEach((error) => console.error(error.message)))
    return
  }

  const message: Message = new Message(parsed.data.address)

  switch (parsed.data.type) {
    case 'int':
      message.append(parseInt(parsed.data.message))
      break
    case 'float':
      message.append(parseFloat(parsed.data.message))
      break
    case 'boolean':
      if (parsed.data.message === 'false' || parsed.data.message === '0') {
        message.append(false)
        break
      } else if (parsed.data.message === 'true' || parsed.data.message === '1') {
        message.append(true)
        break
      }
      break
    case 'string':
      message.append(parsed.data.message)
      break
    default:
      return
  }

  const oscClient = new Client(parsed.data.host, Number(parsed.data.port))
  oscClient.send(message, (error) => {
    if (error) {
      console.error('Error sending OSC message:', error)
    }
    oscClient.close()
  })
}
