const codes: { [x: number]: string } = {
  10001: `no valid txhash`,
}

type RPCErrorCode = keyof typeof codes

export class RPCError extends Error {
  constructor(public message: string, public code: number = 10000) {
    super(message)
  }

  static code(code: RPCErrorCode) {
    if (!codes[code]) {
      throw new Error(`Incorrect code ${code}`)
    }
    return new RPCError(codes[code], code)
  }
}
