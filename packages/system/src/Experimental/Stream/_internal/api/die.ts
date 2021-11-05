// ets_tracing: off

import * as CH from "../../Channel"
import * as C from "../core"

/**
 * Halt a stream with the specified exception
 */
export function die(u: unknown): C.UIO<never> {
  return new C.Stream(CH.die(u))
}