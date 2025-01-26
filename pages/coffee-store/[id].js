import Link from 'next/link';
import Head from 'next/head';
import styles from '../../styles/coffee-store.module.css';
import Image from 'next/image';
import cls from 'classnames';
import { useRouter } from 'next/router';
import { fetchCoffeeStores } from '@/lib/coffee-stores';
import { useState, useContext, useEffect, useCallback } from 'react';
import { StoreContext } from '@/store/coffeeStore-context';
import { isEmpty, fetcher } from '@/utils';
import useSWR from 'swr';

export async function getStaticProps({ params }) {
  const coffeeStoresData = await fetchCoffeeStores();

  const findCoffeeStore = coffeeStoresData.find(
    store => store.id.toString() === params.id,
  );

  return {
    props: {
      coffeeStores: findCoffeeStore ? findCoffeeStore : {},
    },
  };
}

export async function getStaticPaths() {
  const coffeeStoresData = await fetchCoffeeStores();
  return {
    paths: coffeeStoresData.map(store => ({
      params: {
        id: store.id.toString(),
      },
    })),
    fallback: true,
  };
}

const CoffeeStore = initialProps => {
  const {
    container,
    layout,
    col1,
    col2,
    text,
    upvoteButton,
    coffeeName,
    nameWrapper,
    iconWrapper,
    backToHomeLink,
    storeImg,
  } = styles;

  const router = useRouter();

  //Storing Context API Data
  const [coffeeStore, setCoffeeStore] = useState(initialProps.coffeeStores);
  // Counting votes on click
  const [votingCount, setVotingCount] = useState(0);

  const {
    state: { coffeeStoresNearMe },
  } = useContext(StoreContext);

  const id = router.query.id;

  const handleCreateCoffeeStore = useCallback(async coffeeStore => {
    if (!coffeeStore) return;

    try {
      const { id, name, address, place, imgUrl } = coffeeStore;
      const response = await fetch('/api/createCoffeeStore', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
          name,
          address: address || '',
          place: place || '',
          voting: 0,
          imgUrl,
        }),
      });
      const dbCoffeeStore = await response.json();
    } catch (error) {
      console.error('Error creating coffee store:', error);
    }
  }, []);

  useEffect(() => {
    if (!id) return; // Exit if no id

    if (!coffeeStore || isEmpty(coffeeStore)) {
      if (coffeeStoresNearMe && coffeeStoresNearMe.length > 0) {
        const coffeStoreFromContext = coffeeStoresNearMe.find(
          store => store?.id?.toString() === id?.toString(),
        );

        if (coffeStoreFromContext) {
          setCoffeeStore(coffeStoreFromContext);
          handleCreateCoffeeStore(coffeStoreFromContext);
        }
      } else if (initialProps?.coffeeStores) {
        handleCreateCoffeeStore(initialProps.coffeeStores);
      }
    }
  }, [
    id,
    coffeeStore,
    coffeeStoresNearMe,
    handleCreateCoffeeStore,
    initialProps?.coffeeStores,
  ]);

  // Invoking SWR

  const { data, error } = useSWR(
    id ? `/api/getCoffeeStoreById?id=${id}` : null,
    fetcher,
    {
      refreshInterval: 1000,
    },
  );

  useEffect(() => {
    if (data && Array.isArray(data) && data.length > 0) {
      // console.log('Data from SWR', data);
      setCoffeeStore(data[0]);
      setVotingCount(data[0].voting);
    } else if (data) {
      console.warn('Coffee store data is empty or malformed:', data);
    }
  }, [data]);

  if (error) return <div>Failed to load</div>;

  // End of SWR

  /* if (router.isFallback) {
    return <div>Loading...</div>;
  } */

  const handleUpvoteButton = async () => {
    try {
      const response = await fetch('/api/upvoteCoffeeStoreById', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          id,
        }),
      });
      const dbCoffeeStore = await response.json();
      if (dbCoffeeStore && dbCoffeeStore.length > 0) {
        let count = votingCount + 1;
        setVotingCount(count);
      }
    } catch (error) {
      console.error('Error upvoting coffee store', error);
    }
  };

  const { name, imgUrl, address, place } = coffeeStore || {};
  return (
    <div className={layout}>
      <Head>
        <title>{name}</title>
      </Head>

      <div className={container}>
        <div className={col1}>
          <div className={backToHomeLink}>
            <Link href='/'>← Back to home</Link>
          </div>
          {name && (
            <div className={nameWrapper}>
              <h1 className={coffeeName}>{name}</h1>
            </div>
          )}
          <Image
            src={imgUrl ?? '/static/default.png'}
            width={600}
            height={360}
            alt={name || 'coffee store'}
            priority={true}
            className={storeImg}
          />
        </div>
        <div className={cls('glass', col2)}>
          {address && (
            <div className={iconWrapper}>
              <Image
                src='/static/icons/nearMe.svg'
                width={24}
                height={24}
                alt='Near store of coffee'
              />
              <p className={text}>{address}</p>
            </div>
          )}
          {place && (
            <div className={iconWrapper}>
              <Image
                src='/static/icons/places.svg'
                width={24}
                height={24}
                alt='Formatted Address'
              />
              <p className={text}>{place}</p>
            </div>
          )}
          <div className={iconWrapper}>
            <Image
              src='/static/icons/star.svg'
              width={24}
              height={24}
              alt='Rating'
            />
            <p className={text}>{votingCount}</p>
          </div>
          <button className={upvoteButton} onClick={handleUpvoteButton}>
            Up Vote!
          </button>
        </div>
      </div>
    </div>
  );
};

export default CoffeeStore;
