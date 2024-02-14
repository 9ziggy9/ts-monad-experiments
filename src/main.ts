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

// Classic definition, but this can be augmented for any desired Nothing();
const Maybe = <T>(data: T | null | undefined): Maybe<T> => data == null
  ? Nothing()
  : Just(data);

let DANGEROUS_VALUE: {response?: string};
setInterval(() => {
  DANGEROUS_VALUE = Math.random() < 0.3 ? {} : {response: "We happy."};
}, 1000);

setInterval(() => {
  // Note compiler whines that DANGEROUS_VALUE may not have response!
  // Further note that try/catch will NOT work without certain compiler
  // flags enabled. See `useUnknownInCatchVaribles`.

  // Here is one classic approach. In a sense this is a null/undefined check.
  // if ("response" in DANGEROUS_VALUE)
  //   console.log("FOUND VALUE:", DANGEROUS_VALUE.response);

  // USING Maybe monad
  Maybe(DANGEROUS_VALUE.response)
    .chain(response => Just(console.log("FOUND VALUE:", response)));

}, 4000);

// However, it is unfortunate that we cannot add isNothing() to chain,
// as console.log() will return void value. To add this particular
// side-effect, let's implement IO monad.

type IO<T> = Monad<T> & {
  run: () => T; // where the magical side-effects will happen.
};

const IO = <T>(effect: () => T): IO<T> => {
  return {
    run: effect,
    chain: <U>(fn: (value: T) => IO<U>): IO<U> =>
      IO(() => fn(effect()).run())
  };
};

const log = <T>(msg: T): IO<T> => IO(() => {
  console.log(msg);
  return msg;
});

IO(() => 5)
  .chain(n => IO(() => n + 1))
  .chain(n => log(`Value: ${n}`))
  .run();
