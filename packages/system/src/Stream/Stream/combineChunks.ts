import type * as A from "../../Chunk"
import type * as Ex from "../../Exit"
import { pipe } from "../../Function"
import type * as Option from "../../Option"
import * as T from "../_internal/effect"
import * as M from "../_internal/managed"
import { Stream } from "./definitions"
import { unfoldChunkM } from "./unfoldChunkM"

/**
 * Combines the chunks from this stream and the specified stream by repeatedly applying the
 * function `f` to extract a chunk using both sides and conceptually "offer"
 * it to the destination stream. `f` can maintain some internal state to control
 * the combining process, with the initial state being specified by `s`.
 */
export function combineChunks<R1, E1, O2, Z, R, E, O, O3>(
  that: Stream<R1, E1, O2>,
  z: Z,
  f: (
    z: Z,
    s: T.Effect<R, Option.Option<E>, A.Chunk<O>>,
    t: T.Effect<R1, Option.Option<E1>, A.Chunk<O2>>
  ) => T.Effect<
    R & R1,
    never,
    Ex.Exit<Option.Option<E | E1>, readonly [A.Chunk<O3>, Z]>
  >
) {
  return (self: Stream<R, E, O>): Stream<R & R1, E1 | E, O3> =>
    new Stream(
      pipe(
        M.do,
        M.bind("left", () => self.proc),
        M.bind("right", () => that.proc),
        M.bind(
          "pull",
          ({ left, right }) =>
            unfoldChunkM(z)((z) =>
              pipe(
                f(z, left, right),
                T.chain((ex) => T.optional(T.done(ex)))
              )
            ).proc
        ),
        M.map(({ pull }) => pull)
      )
    )
}
