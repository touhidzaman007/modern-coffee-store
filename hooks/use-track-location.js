import { useContext, useState } from 'react';
import { ACTION_TYPES, StoreContext } from '@/store/coffeeStore-context';

const useTrackLocation = () => {
  const [locationErrorMsg, setLocationErrorMsg] = useState('');
  // const [latLong, setLatLong] = useState('');
  const [isFindingLocaion, setIsFindingLocaion] = useState(false);

  const { dispatch } = useContext(StoreContext);

  const success = position => {
    const latitude = position.coords.latitude;
    const longitude = position.coords.longitude;
    // setLatLong(`${latitude},${longitude}`);
    dispatch({
      type: ACTION_TYPES.SET_LAT_LONG,
      payload: `${latitude},${longitude}`,
    });
    setLocationErrorMsg('');
    setIsFindingLocaion(false);
  };
  const error = () => {
    setIsFindingLocaion(false);
    setLocationErrorMsg('Unable to retrieve your location');
  };

  const handleTrackLocation = () => {
    setIsFindingLocaion(true);
    if (!navigator.geolocation) {
      setIsFindingLocaion(false);
      setLocationErrorMsg('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition(success, error);
    }
    navigator.geolocation.getCurrentPosition(success, error);
  };

  return {
    // latLong,
    locationErrorMsg,
    isFindingLocaion,
    handleTrackLocation,
  };
};

export default useTrackLocation;
