<script lang="ts">
  import { type PreferencesJSON } from '../../shared/types'

  window.electron.ipcRenderer.on('log-item', (_, message) => {
    console.log(message)
  })

  let preferences: PreferencesJSON

  const getPreferences = (): void => {
    window.electron.ipcRenderer.invoke('getPreferences').then((res: PreferencesJSON) => {
      console.log(res)
      preferences = res
    })
  }

  const handlePortChange = (e: Event): void => {
    const target = e.target as HTMLInputElement
    preferences.port = parseInt(target.value)
    window.electron.ipcRenderer.send('changePort', preferences.port)
  }

  const handleSlashRequiredChange = (e: Event): void => {
    const target = e.target as HTMLInputElement
    preferences.slashRequired = target.checked
    window.electron.ipcRenderer.send('changeSlash', preferences.slashRequired)
  }

  const handleOpenAtLoginChange = (e: Event): void => {
    const target = e.target as HTMLInputElement
    preferences.openAtLogin = target.checked
    window.electron.ipcRenderer.send('changeOpenAtLogin', preferences.openAtLogin)
  }

  getPreferences()
</script>

{#if preferences}
  <div class="container">
    <h2>Preferences</h2>
    <label for=""
      >Port
      <input type="number" bind:value={preferences.port} on:change={handlePortChange} />
    </label>

    <label for="">
      <input
        type="checkbox"
        bind:checked={preferences.slashRequired}
        on:change={handleSlashRequiredChange}
      />
      Macro name must start with a forward slash '/'
    </label>

    <label for="">
      <input
        type="checkbox"
        bind:checked={preferences.openAtLogin}
        on:change={handleOpenAtLoginChange}
      />
      Start at Login
    </label>
  </div>
{/if}
