export function getCsvMimeTypeRegex(): RegExp {
  return /text\/csv(?:\s*;.*)?|application\/vnd\.ms-excel(?:\s*;.*)?|text\/plain(?:\s*;.*)?/i;
}
