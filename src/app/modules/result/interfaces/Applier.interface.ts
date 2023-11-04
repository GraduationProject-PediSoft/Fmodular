/**
 * This interface is for any type tag that wants something to be applied or executed on top of a result tag
 * @example The visualizer tag for example wants a polydata to be applied in top of the image
 */
export interface Applier<T>{
    apply(data: T): void
}