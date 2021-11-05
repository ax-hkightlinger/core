// ets_tracing: off

import * as CH from "../Channel"
import * as C from "./core"

export function dropLeftover<R, InErr, In, OutErr, L, Z>(
  self: C.Sink<R, InErr, In, OutErr, L, Z>
): C.Sink<R, InErr, In, OutErr, unknown, Z> {
  return new C.Sink(CH.drain(self.channel))
}