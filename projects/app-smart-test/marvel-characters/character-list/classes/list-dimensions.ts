export class ListDimensions {

  public cellWidth: string;

  constructor(
    public readonly cellsCount: number,
    public readonly rowsCount: number,

  ) {
    this.cellWidth = `${Math.floor(100 / this.cellsCount)}%`
  }
}
