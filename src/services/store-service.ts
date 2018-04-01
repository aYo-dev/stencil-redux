import {
  Store,
  MapStateToProps,
  Props,
  Action
} from '../global/interfaces';

class StoreService {
  private _store: Store;

  private queue: any[] = [];

  public setStore(store: Store) {
    this._store = store;
    this.clearTheQueue();
  }

  public getStore() {
    return this._store;
  }

  public getState() {
    return this._store && this._store.getState();
  }

  public connect(component, mapState: MapStateToProps, props: Props) {
    if (!this._store) {
      this.queue.push({component, mapState, props});

      return;
    }

    this.mapStateToProps(component, mapState);
    this.mapDispatchToProps(component, props);
  }

  private clearTheQueue(): void {
    if(this.queue && this.queue.length) {
      this.queue.forEach((el) => this.connect(el.component, el.mapState, el.props));
    }
  }

  private mapDispatchToProps(component, props: Props) {
    Object.keys(props).forEach(actionName => {
      const action: Action = props[actionName];
      Object.defineProperty(component, actionName, {
        get: () => (...args: any[]) => action(...args)(this._store.dispatch, this._store.getState),
        configurable: true,
        enumerable: true
      });
    });
  }

  private mapStateToProps(component, mapState: MapStateToProps) {
    const _mapStateToProps = (_component, _mapState: MapStateToProps) => {
      const mergeProps = _mapState(this._store.getState());
      if(!mergeProps) {
        return;
      }
      Object.keys(mergeProps).forEach(newPropName => {
        let newPropValue = mergeProps[newPropName];
        _component[newPropName] = newPropValue;
      });
    };

    this._store.subscribe(() => _mapStateToProps(component, mapState));

    _mapStateToProps(component, mapState);
  }
}

export default new StoreService();