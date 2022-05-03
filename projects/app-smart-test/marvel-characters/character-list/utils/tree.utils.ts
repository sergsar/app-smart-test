import {ListDimensions} from "../classes/list-dimensions";

export function buildTree<T>(items: T[], dimensions: ListDimensions): T[][] {
  const tree: T[][] = [];
  const rowsCount: number = Math.ceil(items.length / dimensions.cellsCount);
  for (let i = 0; i < rowsCount; i++) {
    const startIndex: number = dimensions.cellsCount * i;
    const row: T[] = items.slice(startIndex, startIndex + dimensions.cellsCount);
    const container: T[] = new Array(dimensions.cellsCount);
    Object.assign(container, row);
    tree[i] = container;
  }
  return tree;
}
