export interface IDataSource<K = any, V = any> {
    get(key: K): V;
    has(key: K): boolean;
}
export declare class DataSource<K = any, V = any> extends Map<K, V> implements IDataSource<K, V> {
}
export declare class DataSourceRepository extends Map<string, IDataSource> {
}
