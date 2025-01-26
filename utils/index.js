export const isEmpty = obj => {
  return !obj || Object.keys(obj).length === 0;
};

export const fetcher = async url => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  return response.json();
};
