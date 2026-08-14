export class Fetch {
  private static async fetcher(url: string, options?: RequestInit) {
    const response = await fetch(url, options);

    if (!response.ok) {
      const body = await response.text();

      throw new Error(`Failed to fetch from ${url} (${response.status} - ${body})`);
    }

    return response;
  }

  static async arrayBuffer(url: string, options?: RequestInit) {
    const response = await this.fetcher(url, options);

    return await response.arrayBuffer();
  }

  static async json(url: string, options?: RequestInit) {
    const response = await this.fetcher(url, options);

    return await response.json() as unknown;
  }

  static async text(url: string, options?: RequestInit) {
    const response = await this.fetcher(url, options);

    return await response.text();
  }
}
