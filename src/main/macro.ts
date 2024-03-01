import { exec } from 'node:child_process'

export const runMacro = (macro, parameter): void => {
  exec(
    `"/Applications/Keyboard Maestro.app/Contents/MacOS/keyboardmaestro" "${macro}" --parameter ${parameter}`,
    (e, sterr) => {
      if (e) {
        console.log(e)
      }
      if (sterr) {
        console.log(sterr)
      }
    }
  )
}
