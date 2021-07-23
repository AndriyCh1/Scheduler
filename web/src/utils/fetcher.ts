export default async function fetcher<T>(
  url: string, options: RequestInit = {},
){
  fetch(url).then(r => r.json());
};
