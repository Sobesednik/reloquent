const { createInterface } = require('readline');
let promto = require('promto'); if (promto && promto.__esModule) promto = promto.default;

/**
 * Ask user a question and wait for an answer.
 * @param {string} question Question to present to the user.
 * @param {{ password: (boolean| undefined), timeout: (number|undefined), input: (stream.Readable|NodeJS.ReadStream|undefined), output: (stream.Writable|NodeJS.WriteStream|undefined) }} options The options.
 */
               function ask(question, options = {}) {
  const {
    timeout,
    password = false,
    output = process.stdout,
    input = process.stdin,
    ...rest
  } = options
  const rl = createInterface(/** @type {!readline.ReadLineOptions} */ ({
    input,
    output,
    ...rest,
  }))
  if (password) {
    /**
     * Undocumented API.
     * @type {!NodeJS.WriteStream}
     * @suppress {checkTypes}
     */
    const o = rl['output']
    /**
     * Undocumented API.
     * @suppress {checkTypes}
     */
    rl['_writeToOutput'] = (s) => {
      if (['\r\n', '\n', '\r'].includes(s))
        return o.write(s)

      const v = s.split(question)
      if (v.length == '2') {
        o.write(question)
        o.write('*'.repeat(v[1].length))
      } else {
        o.write('*')
      }
    }
  }
  const p = new Promise(rl.question.bind(rl, question))

  const promise = timeout
    ? promto(p, timeout, `reloquent: ${question}`)
    : p
  /**
   * @suppress {checkTypes}
   */
  rl['promise'] = tryPromise(promise, rl)
  return rl
}

const tryPromise = async (promise, rl) => {
  try {
    const res = await promise
    return res
  } finally {
    rl.close()
  }
}

/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Readable} stream.Readable
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('stream').Writable} stream.Writable
 */
/**
 * @suppress {nonStandardJsDocs}
 * @typedef {import('readline').ReadLineOptions} readline.ReadLineOptions
 */

module.exports = ask