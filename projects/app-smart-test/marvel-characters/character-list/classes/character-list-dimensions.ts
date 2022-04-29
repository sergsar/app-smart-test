export class CharacterListDimensions {
  public readonly cellsCount: number;
  public readonly rowsCount: number;
  public readonly rowHeight: number;

  constructor(
    public readonly width: number,
    public readonly height: number,
    public readonly cellMinWidth: number = 350,
    public readonly cellWidth: number = 3,
    public readonly cellHeight: number = 5,
  ) {
    const aspect: number = this.cellWidth / this.cellHeight;
    const rowHeight: number = this.cellMinWidth / aspect;
    this.cellsCount = Math.floor(width / cellMinWidth) || 1;
    this.rowsCount = Math.ceil(this.height / rowHeight) + 1;
    this.rowHeight = this.cellMinWidth / aspect;
  }
}
