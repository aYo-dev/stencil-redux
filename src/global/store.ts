import storeService  from '../services/store-service';

export const store = (target, key) => {
  const getter = function () {
    return {
      setStore: storeService.setStore.bind(storeService),
    };
  };
      
  Object.defineProperty(target, key, {
    get: getter,
    enumerable: true,
    configurable: true
  });
};