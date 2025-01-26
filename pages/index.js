import Head from 'next/head';
import styles from '@/styles/Home.module.css';
import Banner from '@/components/banner/banner';
import Card from '@/components/card/card';
import Image from 'next/image';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import useTrackLocation from '@/hooks/use-track-location';
import { useState, useEffect, useContext } from 'react';
import { ACTION_TYPES, StoreContext } from '@/store/coffeeStore-context';
export async function getStaticProps() {
  // console.log('Hi getStaticProps');

  const coffeeStoresData = await fetchCoffeeStores();

  return {
    props: {
      coffeeStores: coffeeStoresData,
    },
  };
}

export default function Home({ coffeeStores }) {
  // console.log('Props', coffeeStores);

  // const [coffeeStoresNearMe, setCoffeeStoresNearMe] = useState('');
  const { dispatch, state } = useContext(StoreContext);
  const [coffeeStoreError, setCoffeeStoreError] = useState(null);

  const { handleTrackLocation, locationErrorMsg, isFindingLocaion } =
    useTrackLocation();

  const { coffeeStoresNearMe, latLong } = state;

  useEffect(() => {
    async function fetchData() {
      if (latLong) {
        try {
          const res = await fetch(
            `/api/getCoffeeStoresByLocation?latLong=${latLong}&limit=30`,
          );
          const fetchedCoffeeStoresData = await res.json();
          // console.log({ fetchedCoffeeStoresData });
          // setCoffeeStoresNearMe(fetchedCoffeeStoresData);
          dispatch({
            type: ACTION_TYPES.SET_COFFEE_STORES,
            payload: fetchedCoffeeStoresData,
          });
          setCoffeeStoreError('');
        } catch (error) {
          console.error({ error });
          setCoffeeStoreError(error.message);
        }
      } else {
        console.log('No latLong');
      }
    }
    fetchData();
  }, [latLong, dispatch]);

  // console.log({ latLong, locationErrorMsg });
  const handleOnBannerBtnClick = () => {
    // console.log('Button clicked');
    handleTrackLocation();
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Coffee Connoisseur</title>
        <meta name='description' content='A local coffee stores nearby you' />
        <meta name='viewport' content='width=device-width, initial-scale=1' />
        <link rel='icon' href='/favicon.ico' />
      </Head>
      <main className={styles.main}>
        <Banner
          buttonText={isFindingLocaion ? 'Locating...' : 'View stores nearby'}
          handleOnClick={handleOnBannerBtnClick}
        />
        {locationErrorMsg && <p>Something went wrong: {locationErrorMsg}</p>}
        <div className={styles.heroImage}>
          <Image
            src='/static/hero-image.png'
            width={700}
            height={400}
            alt='hero banner'
            priority={true}
          />
        </div>
        {coffeeStoresNearMe.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Coffee Stores Near Me</h2>
            <div className={styles.cardLayout}>
              {coffeeStoresNearMe.map(store => (
                <Card
                  key={store.id}
                  name={store.name}
                  imgUrl={store.imgUrl}
                  href={`/coffee-store/${store.id}`}
                />
              ))}
            </div>
          </div>
        )}
        {coffeeStoreError && <p>Something went wrong: {coffeeStoreError}</p>}
        {coffeeStores.length > 0 && (
          <div className={styles.sectionWrapper}>
            <h2 className={styles.heading2}>Dhaka Coffee Stores</h2>
            <div className={styles.cardLayout}>
              {coffeeStores.map(store => (
                <Card
                  key={store.id}
                  name={store.name}
                  imgUrl={store.imgUrl}
                  href={`/coffee-store/${store.id}`}
                />
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
