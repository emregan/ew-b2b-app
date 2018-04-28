export function TwigGroup(data: Array<any>, prop: string): any {
  const group: any = {};

  for (const row of data) {
    const value = row[prop];

    if (typeof group[value] === "undefined") {
      group[value] = [];
    }

    group[value].push(row);
  }

  return group;
}
