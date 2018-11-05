export default class ColourProvider {
  private readonly BLACK = '#000000'

  private lookUp: { [id: string]: string }
  private availableColours: string[]

  constructor() {
    this.lookUp = {}
    this.availableColours = this.getAvailableColours()
  }

  public get(key: string) {
    if (this.lookUp[key]) return this.lookUp[key]

    if (!this.availableColours.length) {
      this.availableColours = this.getAvailableColours()
    }

    let colour = this.availableColours.shift()

    if (!colour) {
      colour = this.BLACK
    }

    this.lookUp[key] = colour

    return colour
  }

  public remove(key: string) {
    const colour = this.lookUp[key]

    if (!colour) return

    if (this.availableColours.indexOf(colour) < 0) {
      this.availableColours.push(colour)
    }

    delete this.lookUp[key]
  }

  private getAvailableColours(): string[] {
    return ['#1DADE2', '#cc2529', '#6b4c9a']
  }
}
