export interface Store {
  getState: () => any;
  getStore: () => any;
  setStore: (any: any) => void;
  subscribe: (f: () => any) => any;
  dispatch: Function;
}

export type Action = Function;
export type MapStateToProps = (state: Record<string, any>) => any;
export type Props = Record<string, () => any>;
export type Component = Record<string, any>;
export interface IConnectArgs {
  mapState: MapStateToProps;
  props: Props;
}