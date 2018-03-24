import storeService  from '../services/store-service';

export function connect({mapState, props}) {
  return (target) => {
    var original = target;
    // a utility function to generate instances of a class
    function construct(constructor, args) {
      var c : any = function () {
        const instance =  new constructor(args);
        storeService.connect(instance, mapState, props);
        console.log('instance', instance);
        console.log('storeService', storeService.getState());
        
        return instance;
      };

      c.prototype = constructor.prototype;
      return new c();
    }

    // the new constructor behaviour
    var f : any = function (...args) {      
      return construct(original, args);
    };
    
    // copy prototype so intanceof operator still works
    f.prototype = original.prototype;
    
    // return new constructor (will override original)
    console.log('target1234', f);
    
    return f;
  };
}
