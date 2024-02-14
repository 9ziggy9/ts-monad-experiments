type Frame = {
  id: `frame-${number}`;
  ref: {name: string, value: number};
}

type FrameCollection = {[id: Frame["id"]]: Frame};

interface Endofunctor<T> {
  map(fn: (element: T) => T): Endofunctor<T>;
  log(): void;
}

const toFrames = (...fs: Frame[]): Endofunctor<Frame> => {
  const __frames: FrameCollection = fs
    .reduce<FrameCollection>((collection, frame) => ({
      ...collection,
      [frame.id]: frame,
    }), {});
  return {
    map: (fn) => toFrames(...Object.values(
      Object.entries(__frames)
      .reduce<FrameCollection>((collection, [id, frame]) => ({
        ...collection,
        [id]: fn(frame)
      }), {})
    )),
    log: () => console.log(JSON.stringify(__frames, null, 2))
  };
};

const xs = toFrames(
  {id: "frame-1", ref: {name: "hello", value: 10}},
  {id: "frame-2", ref: {name: "goodbye", value: 99}},
)

xs.log();

xs.map(frame => ({
  ...frame,
  ref: {name: frame.ref.name + "new", value: frame.ref.value * (-1)}
})).log()
