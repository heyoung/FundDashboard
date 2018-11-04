export default class ColourProvider {
  private CANDIDATE_COLOURS = ['#1DADE2', '#cc2529', '#6b4c9a']

  private lookUp: { [id: string]: string }
  private currentIndex: number

  constructor() {
    this.currentIndex = 0
    this.lookUp = {}
  }

  public get(key: string) {
    if (this.lookUp[key]) return this.lookUp[key]

    const colour = this.CANDIDATE_COLOURS[this.currentIndex]

    this.lookUp[key] = colour

    if (this.currentIndex === this.CANDIDATE_COLOURS.length - 1) {
      this.currentIndex = 0
    } else {
      this.currentIndex++
    }

    return colour
  }
}
