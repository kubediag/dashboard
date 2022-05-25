export interface OperationSetItem {
  name: string;
  ready: boolean;
  age: string;
  operations: string;
  adjacency: Adjacency[];
}

export interface Adjacency {
  to?: number[];
  id?: number;
  operation?: string;
  temp?: string;
}

export interface OperationSetRes {
  items: OperationSet[];
  [key: string]: any;
}

export interface OperationSet {
  metadata: {
    name: string;
    creationTimestamp: string;
  };
  status: {
    paths: string;
    ready: boolean;
  };
  spec: {
    adjacencyList: Adjacency[];
  };
}
