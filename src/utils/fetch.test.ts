import { afterEach, describe, expect, test, vi } from 'vitest';
import { Fetch } from './fetch';

afterEach(() => {
  vi.restoreAllMocks();
});

describe('arrayBuffer', () => {
  test('should parse responses as arrayBuffer', async () => {
    const expectedResponse = new Uint8Array([1, 2, 3]).buffer;

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(expectedResponse));
    const response = await Fetch.arrayBuffer('https://www.example.com/');

    expect(new Uint8Array(response)).toStrictEqual(new Uint8Array(expectedResponse));
  });
});

describe('json', () => {
  test('should parse responses as json', async () => {
    const expectedResponse = { foo: 'bar' };

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(JSON.stringify(expectedResponse)));

    await expect(Fetch.json('https://www.example.com/')).resolves.toEqual(expectedResponse);
  });
});

describe('text', () => {
  test('should parse responses as text', async () => {
    const expectedResponse = 'foo';

    vi.spyOn(globalThis, 'fetch').mockResolvedValue(new Response(expectedResponse));

    await expect(Fetch.text('https://www.example.com/')).resolves.toBe(expectedResponse);
  });
});
