export interface ProviderValue<T> {
  value?: T;
}
export const Provider = {
  defaultValue<T>(): ProviderValue<T> {
    return { value: undefined };
  },
  setValue<T>(source: ProviderValue<T>, value: T): void {
    Object.defineProperty(source, "value", {
      get() {
        return value;
      }
    });
  }
};
