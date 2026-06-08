export function readJsonSafe(response) {
  return response.json().catch(() => null);
}
