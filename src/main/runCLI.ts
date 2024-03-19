import { app } from 'electron'
import { sendOSCMessage } from './sendOSCMessage'
import { Command } from 'commander'

export const runCLI = (): void => {
  const program = new Command()

  program
    .name('KMOSC')
    .description('KMOSC CLI tool for sending OSC messages.')
    .version(app.getVersion())
    .command('send')
    .argument('<host>')
    .argument('<port>')
    .argument('<address>')
    .argument('<type>')
    .argument('<message>')
    .action((host, port, address, type, message) => {
      if (!host || !port || !address || !type || !message) {
        program.help()
        process.exit(1)
      } else {
        sendOSCMessage(host, port, address, type, message)
        app.quit()
      }
    })

  program.parse()
}
