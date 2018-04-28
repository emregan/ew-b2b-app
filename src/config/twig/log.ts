export function log(data: any, inConsole: boolean): string {
  if (process.env.NODE_ENV == "production") {
    return "";
  }

  const id = Math.random().toString().split(".")[1];

  if (inConsole) {
    return this.filters.raw(`<script>
          console.group(${id});
          console.log(${JSON.stringify(data)});
          console.groupEnd();
      </script>`);
  }

  return this.filters
    .raw(`<script src="https://cdn.jsdelivr.net/npm/json-formatter-js@1.3.0/dist/json-formatter.min.js"></script>
    <pre id="json-${id}"></pre>
    <script>
        const formatter${id} = new JSONFormatter(${JSON.stringify(data)});
        document.getElementById('json-${id}').appendChild(formatter${id}.render());
    </script>`);
}
