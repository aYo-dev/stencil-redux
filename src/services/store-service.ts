import {
  Store,
  MapStateToProps,
  Props,
  Action,
  Component,
} from '../global/interfaces';

class StoreService {
  private _store: Store;

  private queue: any[] = [];

  public setStore(store: Store) {
    this._store = store;
    this.apply(this.curry(this.connect));
  }

  public getStore() {
    return this._store;
  }

  public getState() {
    return this._store && this._store.getState();
  }

  public connect(component: Component, mapState: MapStateToProps, props: Props): void {
    if (!this._store) {
      this.queue.push({component, mapState, props});

      return;
    }

    this.mapStateToProps(component, mapState);
    this.mapDispatchToProps(component, props);
  }

  private apply(curriedFn: Function): void {
    if(this.queue && this.queue.length) {
      const { component, mapState, props } = this.queue.pop();
      curriedFn(component, mapState, props);
      this.apply(curriedFn);
    }
  }

  private curry(fn: Function): Function {
    return (component: Component, mapFn: MapStateToProps, props: Props) => fn(component, mapFn, props);
  }

  private mapDispatchToProps(component: Component, props: Props) {
    Object.keys(props).forEach(actionName => {
      const action: Action = props[actionName];
      Object.defineProperty(component, actionName, {
        get: () => (...args: any[]) => action(...args)(this._store.dispatch, this._store.getState),
        configurable: true,
        enumerable: true
      });
    });
  }

  private mapStateToProps(component: Component, mapFn: MapStateToProps) {
      const mergeProps = mapFn(this._store.getState());
      if(!mergeProps) {
        return;
      }

      Object.keys(mergeProps).forEach(newPropName => {
        let newPropValue = mergeProps[newPropName];
        component[newPropName] = newPropValue;
      });

    this._store.subscribe(() => this.mapStateToProps(component, mapFn));
  }
}

export default new StoreService();