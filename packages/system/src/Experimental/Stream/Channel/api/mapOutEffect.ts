// ets_tracing: off

import type * as T from "../../../../Effect"
import * as C from "../core"
import * as ReadWith from "./readWith"
import * as ZipRight from "./zipRight"

const mapOutMReader = <Env, Env1, OutErr, OutErr1, OutElem, OutElem1, OutDone>(
  f: (o: OutElem) => T.Effect<Env1, OutErr1, OutElem1>
): C.Channel<
  Env & Env1,
  OutErr,
  OutElem,
  OutDone,
  OutErr | OutErr1,
  OutElem1,
  OutDone
> =>
  ReadWith.readWith(
    (out) =>
      C.chain_(C.fromEffect(f(out)), (_) =>
        ZipRight.zipRight_(C.write(_), mapOutMReader(f))
      ),
    (e) => C.fail(e),
    (z) => C.end(z)
  )

export function mapOutEffect_<
  Env,
  Env1,
  InErr,
  InElem,
  InDone,
  OutErr,
  OutErr1,
  OutElem,
  OutElem1,
  OutDone
>(
  self: C.Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>,
  f: (o: OutElem) => T.Effect<Env1, OutErr1, OutElem1>
): C.Channel<Env & Env1, InErr, InElem, InDone, OutErr | OutErr1, OutElem1, OutDone> {
  return C.pipeTo_(self, mapOutMReader(f))
}

/**
 * @ets_data_first mapOutEffect_
 */
export function mapOutEffect<Env1, OutErr1, OutElem, OutElem1>(
  f: (o: OutElem) => T.Effect<Env1, OutErr1, OutElem1>
) {
  return <Env, InErr, InElem, InDone, OutErr, OutDone>(
    self: C.Channel<Env, InErr, InElem, InDone, OutErr, OutElem, OutDone>
  ) => mapOutEffect_(self, f)
}