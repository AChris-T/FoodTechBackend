import { getCsvMimeTypeRegex } from './csv-upload.utils';

describe('getCsvMimeTypeRegex', () => {
  it('matches common CSV MIME types and charset suffixes', () => {
    expect('text/csv'.match(getCsvMimeTypeRegex())?.[0]).toBe('text/csv');
    expect('text/csv; charset=utf-8'.match(getCsvMimeTypeRegex())?.[0]).toBe('text/csv; charset=utf-8');
    expect('application/vnd.ms-excel'.match(getCsvMimeTypeRegex())?.[0]).toBe('application/vnd.ms-excel');
    expect('text/plain'.match(getCsvMimeTypeRegex())?.[0]).toBe('text/plain');
  });

  it('rejects unsupported MIME types', () => {
    expect('application/json'.match(getCsvMimeTypeRegex())).toBeNull();
    expect('image/png'.match(getCsvMimeTypeRegex())).toBeNull();
  });
});
