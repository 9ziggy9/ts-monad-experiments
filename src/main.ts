// Note that I am ASSUMING that a user will implement unit (construction function)
interface Monad<T> {
  chain<U>(fn: (value: T) => Monad<U>): Monad<U>;
}

type Maybe<T> = Monad<T> & {
  isNothing:  () => boolean;
  getData:    () => T | null;
};

const Just = <T>(data: T): Maybe<T> => ({
  chain:     <U>(fn: (data: T) => Maybe<U>): Maybe<U> => fn(data),
  isNothing: () => false,
  getData:   () => data,
});

const Nothing = <T>(): Maybe<T> => ({
  chain:     <U>(): Maybe<U> => Nothing(),
  isNothing: () => true,
  getData:   () => null,
});

const Maybe = <T>(data: T | null | undefined): Maybe<T> => data == null
  ? Nothing()
  : Just(data);
