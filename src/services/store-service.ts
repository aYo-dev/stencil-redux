class StoreService {
  private _store;

  private queue: any[] = [];

  public setStore(store) {
    this._store = store;
    this.clearTheQueue();
  }

  public getStore() {
    return this._store;
  }

  public getState() {
    return this._store && this._store.getState();
  }

  public connect(component, mapState, props) {
    if (!this._store) {
      this.queue.push({component, mapState, props});

      return;
    }

    console.log(component);
    this.mapStateToProps(component, mapState);
    this.mapDispatchToProps(component, props);
  }

  private clearTheQueue(): void {
    if(this.queue && this.queue.length) {
      this.queue.forEach((el) => this.connect(el.component, el.mapState, el.props));
    }
  }

  private mapDispatchToProps(component, props) {
    Object.keys(props).forEach(actionName => {
      const action = props[actionName];
      Object.defineProperty(component, actionName, {
        get: () => (...args) => action(...args)(this._store.dispatch, this._store.getState),
        configurable: true,
        enumerable: true
      });
    });
    console.log('mapDispatchToProps', component, props);    
  }

  private mapStateToProps(component, mapState) {
    // TODO: Don't listen for each component
    const _mapStateToProps = (_component, _mapState) => {
      const mergeProps = mapState(this._store.getState());
      if(!mergeProps) {
        return;
      }
      Object.keys(mergeProps).forEach(newPropName => {
        let newPropValue = mergeProps[newPropName];
        component[newPropName] = newPropValue;
        // TODO: can we define new props and still have change detection work?
      });
    };

    this._store.subscribe(() => _mapStateToProps(component, mapState));

    _mapStateToProps(component, mapState);
  }
}

export default new StoreService();