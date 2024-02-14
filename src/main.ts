// Note that I am ASSUMING that a user will implement unit (construction function)
// Due to type inference you can't extend this with types in TS, sucks.
interface Monad<T> {
  chain<U>(fn: (value: T) => Monad<U>): Monad<U>;
}

type Maybe<T> = {
  chain<U>(fn: (value: T) => Maybe<U>): Maybe<U>;
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

// let DANGEROUS_VALUE: {response?: string};
// setInterval(() => {
//   DANGEROUS_VALUE = Math.random() < 0.3 ? {} : {response: "We happy."};
// }, 1000);

// setInterval(() => {
//   // Note compiler whines that DANGEROUS_VALUE may not have response!
//   // Further note that try/catch will NOT work without certain compiler
//   // flags enabled. See `useUnknownInCatchVaribles`.

//   // Here is one classic approach. In a sense this is a null/undefined check.
//   // if ("response" in DANGEROUS_VALUE)
//   //   console.log("FOUND VALUE:", DANGEROUS_VALUE.response);

//   // USING Maybe monad
//   Maybe(DANGEROUS_VALUE.response)
//     .chain(response => Just(console.log("FOUND VALUE:", response)));

// }, 4000);

// However, it is unfortunate that we cannot add isNothing() to chain,
// as console.log() will return void value. To add this particular
// side-effect, let's implement IO monad.


// type Maybe<T> = Monad<T> & {
//   isNothing:  () => boolean;
//   getData:    () => T | null;
// };

// const Just = <T>(data: T): Maybe<T> => ({
//   chain:     <U>(fn: (data: T) => Maybe<U>): Maybe<U> => fn(data),
//   isNothing: () => false,
//   getData:   () => data,
// });

// Really annoying but TS type inference is interfering... Have to explicitly
// indicate that chain in this case should return IO...
// cannot simply extend Monad<T>!
type IO<T> = {
  chain<U>(fn: (value: T) => IO<U>): IO<U>;
  run: () => T; // where the magical side-effects will happen.
};

const IO = <T>(effect: () => T): IO<T> => ({
    chain: <U>(fn: (value: T) => IO<U>): IO<U> => IO(() => fn(effect()).run()),
    run: effect,
});

const log = <T>(msg: T): IO<T> => IO(() => {
  console.log(msg);
  return msg;
});

IO(() => 10)
  .chain((n) => log(n))
  .chain((n) => IO(() => n + 1))
  .chain((n) => log(n))
  .chain((n) => IO(() => n + 1))
  .chain((n) => log(n))
  .chain((n) => log(n))
  .run();

// LOOK INTO: monad transformers
