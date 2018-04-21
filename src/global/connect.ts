import storeService  from '../services/store-service';
import { IConnectArgs } from './interfaces';

export function connect({mapState, props}: IConnectArgs) {
  return (target: FunctionConstructor) => {
    const  original = target;
    function construct(constructor: FunctionConstructor, args: any) {
      const c: any = function (): Function {
        const instance =  new constructor(args);
        storeService.connect(instance, mapState, props);
        
        return instance;
      };

      c.prototype = constructor.prototype;
      return new c();
    }

    const f : any = function (...args: any[]) {      
      return construct(original, args);
    };
    
    f.prototype = original.prototype;
    
    return f;
  };
}
