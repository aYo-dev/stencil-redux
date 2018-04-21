import storeService  from '../services/store-service';

export const store = (target: any, key: string) => {
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