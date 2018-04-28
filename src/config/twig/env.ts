export default function env(key: any): string {
  return process.env[key] || "";
}
