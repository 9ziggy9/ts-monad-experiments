type Frame = {
  id: `frame-${number}`;
  ref: {name: string, value: number};
}

type FrameCollection = {[id: Frame["id"]]: Frame};

const xs: FrameCollection = {
  "frame-1": {
    id: "frame-1",
    ref: {name: "hello", value: 10},
  },
  "frame-2": {
    id: "frame-2",
    ref: {name: "goodbye", value: 99},
  },
}
