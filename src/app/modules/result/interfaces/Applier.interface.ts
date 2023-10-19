export interface Applier<T>{
    apply(data: T): void
}