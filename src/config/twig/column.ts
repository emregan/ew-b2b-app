export function column(data: any, prop: string): any {
  const column = [];

  for (const row of data) {
    if (typeof row[prop] !== "undefined") {
      column.push(row[prop]);
    }
  }

  return column;
}
