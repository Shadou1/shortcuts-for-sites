export default class Setting {
  name: string
  handleLoad?: () => void | Promise<void>
  handleSave?: () => void | Promise<void>
  handleClear?: () => void | Promise<void>
  constructor(name: string  ) {
    this.name = name
  }
}
