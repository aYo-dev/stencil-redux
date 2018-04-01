import storeService  from '../services/store-service';
import { Props, MapStateToProps } from './interfaces';

export function connect({mapState, props}) {
  return (target) => {
    var original = target;
    function construct(constructor: any, args: any) {
      var c : any = function () {
        const instance =  new constructor(args);
        storeService.connect(instance, mapState, props);
        
        return instance;
      };

      c.prototype = constructor.prototype;
      return new c();
    }

    var f : any = function (...args: any[]) {      
      return construct(original, args);
    };
    
    f.prototype = original.prototype;
    
    return f;
  };
}
