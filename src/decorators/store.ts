import storeService  from '../services/store-service';

export const store = (target, key) => {
    // property getter

    console.log('store decorator props', target, key);
    const getter = function () {
        return {
            setStore: storeService.setStore.bind(storeService),
        };
    };
        
    // Create new property with getter and setter
    Object.defineProperty(target, key, {
        get: getter,
        enumerable: true,
        configurable: true
    });
};
