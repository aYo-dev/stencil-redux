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
    this.walkAroundTheQueue();
  }

  public getStore() {
    return this._store;
  }

  public getState() {
    return this._store && this._store.getState();
  }

  public connect(component: Component, mapState: MapStateToProps, props: Props) {
    if (!this._store) {
      this.queue.push({component, mapState, props});

      return;
    }

    this.mapStateToProps(component, mapState);
    this.mapDispatchToProps(component, props);
  }

  private walkAroundTheQueue(): void {
    if(this.queue && this.queue.length) {
      // this.queue.forEach((el) => this.connect(el.component, el.mapState, el.props));
      const { component, mapState, props } = this.queue.pop();
      this.connect(component, mapState, props);
      this.walkAroundTheQueue();
    }
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
    const _mapStateToProps = (_component: Component, _mapState: MapStateToProps) => {
      const mergeProps = _mapState(this._store.getState());
      if(!mergeProps) {
        return;
      }
      Object.keys(mergeProps).forEach(newPropName => {
        let newPropValue = mergeProps[newPropName];
        _component[newPropName] = newPropValue;
      });
    };

    this._store.subscribe(() => _mapStateToProps(component, mapFn));

    _mapStateToProps(component, mapFn);
  }
}

export default new StoreService();