declare global {
  interface Window {
    Buffer: unknown;
    SQL: unknown;
    electronApi: {
      openUrl: (url: string) => unknown;
      writeFile: (filepath: string, data: string) => Promise<unknown>;
      readFile: (filepath: string) => Promise<string>;
    };
  }
}

export default Window;
