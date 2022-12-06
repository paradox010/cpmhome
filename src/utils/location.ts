import { parse } from 'qs';

export function getParams(location = window.location) {
  if (location.search.split('?').length > 1) {
    const searchParams = parse(location.search.split('?')[1]);
    return searchParams;
  }
  return {};
}
