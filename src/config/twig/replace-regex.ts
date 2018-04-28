export default function ReplaceRegex(target: string, args: string[]): any {
  const expression: string = args[0] || "";
  const replaceWith: string = args[1] || "";
  const flags: string = args[2] || "";
  const regex = new RegExp(expression, flags);

  return target.replace(regex, replaceWith);
}
