import AsyncStorage from '@react-native-async-storage/async-storage';

export const AsyncStoreViaKey = async (key, obj) => {
  try {
    const jsonValue = JSON.stringify(obj);
    await AsyncStorage.setItem(key, jsonValue);

    console.log('Async Storage, ' + key + ' stored successfully!');
    return true;
  } catch (err) {
    // saving error
    console.log('Async Storage, ' + key + ' stored error!');
    console.log(err);
    return false;
  }
};

export const AsyncGetViaKey = async key => {
  try {
    var jsonValue = await AsyncStorage.getItem(key);
    const jsonObject = jsonValue != null ? JSON.parse(jsonValue) : null;

    console.log('Async Storage, ' + key + ' fetched successfully!');
    return jsonObject;
  } catch (err) {
    // error reading value
    console.log('Async Storage, ' + key + ' fetched error!');
    console.log(err);
    return null;
  }
};

export const AsyncRemoveViaKey = async key => {
  try {
    AsyncStorage.removeItem(key);

    console.log('Async Storage, ' + key + ' removed successfully!');
    return true;
  } catch (err) {
    // error reading value
    console.log('Async Storage, ' + key + ' removed error!');
    console.log(err);
    return false;
  }
};

export const AsyncStoreMultiple = async obj => {
  try {
    AsyncStorage.multiSet([
      ['key1', JSON.stringify(obj.item1)],
      ['key2', JSON.stringify(obj.item2)],
    ]);

    console.log('Async Storage, Store Multiple Objects successfully!');
    return true;
  } catch (err) {
    // error storing value
    console.log('Async Storage, ' + key + ' Store Multiple Objects error!');
    console.log(err);
    return false;
  }
};

export const AsyncGetMultiple = async () => {
  try {
    var storage = await AsyncStorage.multiGet(['key1', 'key2']);

    if (storage[0][1] !== null) {
      var rtnObj = {
        obj1: !!storage[0][1] ? JSON.parse(storage[0][1]) : null,
        obj2: !!storage[1][1] ? JSON.parse(storage[1][1]) : null,
      };
      return rtnObj;
    } else {
      console.log('Async Storage, Get Multiple Objects error (empty object)!');
      return null;
    }
  } catch (err) {
    // error reading value
    console.log('Async Storage, Get Multiple Objects error!');
    console.log(err);
    return null;
  }
};

export const AsyncClearAll = async () => {
  try {
    await AsyncStorage.clear();

    console.log('Async Storage (clear all) successfully!');
    return true;
  } catch (err) {
    // error reading value
    console.log('Async Storage, (clear all) error!');
    console.log(err);
    return false;
  }
};
