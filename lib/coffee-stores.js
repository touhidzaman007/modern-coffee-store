import { createApi } from 'unsplash-js';

const unsplash = createApi({
  accessKey: process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY,
});

const getApisUrl = (latLong, query, limit) => {
  return `https://api.foursquare.com/v3/places/search?query=${query}&ll=${latLong}&limit=${limit}`;
};

const getPhotosUrl = async () => {
  try {
    const photos = await unsplash.search.getPhotos({
      query: 'coffee shop',
      perPage: 30,
    });

    const photosUrl = photos.response.results.map(
      result => result.urls['small'],
    );
    return photosUrl;
  } catch (error) {
    console.error(error);
  }
};

export const fetchCoffeeStores = async (
  latLong = '23.7809757%2C90.3372881',
  limit = 6,
) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: process.env.NEXT_PUBLIC_FOURSQUARE_API_KEY,
    },
  };

  const photos = await getPhotosUrl();

  // console.log(latLong);
  try {
    const response = await fetch(
      // fetch('https://api.foursquare.com/v3/places/search?query=coffee&ll=23.7809757%2C90.3372881', options)
      getApisUrl(latLong, 'coffee', limit),
      options,
    );
    const data = await response.json();
    const coffeeStoresData = data.results.map((result, index) => ({
      id: result.fsq_id,
      name: result.name,
      address: result.location?.address || null,
      place: result.location?.formatted_address || null,
      imgUrl: photos.length > 0 ? photos[index] : null,
    }));
    return coffeeStoresData;
  } catch (error) {
    console.error(error);
  }
};
