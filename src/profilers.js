
/* =========================================
      IMPORTS
-------------------------------------- */

const util = require('util')
const uuid = require('uuid')


/* =========================================
      CONSTANTS
-------------------------------------- */

const DEFAULT_PROFILER_BEGIN = false
const DEFAULT_PROFILER_ENABLED = true
const DEFAULT_PROFILER_VERBOSE = false
const DEFAULT_PROFILER_COLORS = true
const DEFAULT_PROFILER_LOGGER = console

const VOID_LOGGER = Object.keys(console).reduce((logger, key) => {
    return {
        [key]: (...args) => {
            // skip
        },
    }
}, {})


/* =========================================
      ERRORS
-------------------------------------- */

class ProfilerError extends Error {}


/* =========================================
      CLASSES
-------------------------------------- */

class Profiler {

    constructor (options = {}) {
        options = {
            logger: undefined,
            ...options,
        }

        let {
            logger,
        } = options

        if (logger === false) {
            this._logger = VOID_LOGGER

        } else {
            if (logger) {
                if (!logger.info) {
                    logger = DEFAULT_PROFILER_LOGGER
                }

            } else {
                logger = DEFAULT_PROFILER_LOGGER
            }
        }

        this._logger = logger
    }

    get logger () {
        return this._logger
    }

}

// NOTE: `static` class functions not available yet
Profiler.default = function () {
    const klass = this

    if (!klass.instance) {
        klass.instance = new klass()
    }

    return klass.instance
}


class RuntimeProfilerTimer extends Profiler {

    /*
        A timer
    */

    constructor (options = {}) {
        options = {
            key: undefined,
            label: undefined,
            details: undefined,
            begin: undefined,
            logger: undefined,
            enabled: undefined,
            verbose: undefined,
            colors: undefined,
            ...options,
        }

        let {
            key,
            label,
            details,
            begin,
            logger,
            enabled,
            verbose,
            colors,
        } = options

        super({
            logger,
        })

        if ((key || '').includes(' ')) {
            label = key
            key = null
        }

        if (!key && label) {
            key = label.replace(/[^\w\d]/gmi, '_')
            key = label.replace(/_{2,}/gmi, '_')
        }

        this._id = `${uuid.v4()}`.replace('-', '')
        this._label = label
        this._key = key
        this._details = details || {}

        if (begin === false) {
            begin = false

        } else {
            begin = begin || DEFAULT_PROFILER_BEGIN
        }

        if (enabled == false) {
            enabled = false

        } else {
            enabled = enabled || DEFAULT_PROFILER_ENABLED
        }

        if (verbose == false) {
            verbose = false

        } else {
            verbose = verbose || DEFAULT_PROFILER_VERBOSE
        }

        if (colors == false) {
            colors = false

        } else {
            colors = colors || DEFAULT_PROFILER_COLORS
        }

        this._enabled = enabled
        this._verbose = verbose
        this._colors = colors

        this._step = null
        this._steps = []

        if (begin) {
            this.begin()
        }
    }

    begin (options = {}) {
        if (typeof options === 'string') {
            options = {
                key: options,
            }
        }

        options = {
            key: undefined,
            label: undefined,
            details: undefined,
            ...options,
        }

        let {
            key,
            label,
            details,
        } = options

        if ((key || '').includes(' ')) {
            label = key
            key = null
        }

        if (!key && label) {
            key = label.replace(/[^\w\d]/gmi, '_')
            key = label.replace(/_{2,}/gmi, '_')
        }

        details = details || {}

        const now = Date.now() / 1000

        let runtime

        if (this._step) {
            runtime = now - this._step['begin_at']

            if (runtime < 0) {
                runtime = 0
            }

            this._step['end_at'] = now
            this._step['time'] = runtime
        }

        const _id = this._id
        const _index = this._steps.length

        const _begin_at = now
        const _end_at = null

        key = key || `step-${_index}`

        this._step = {
            id: _id,
            index: _index,

            begin_at: _begin_at,
            end_at: _end_at,

            label: label,
            key: key,
            details: details,
        }

        this._steps.push(this._step)

        return this
    }

    end () {
        if (this._step) {
            const now = Date.now() / 1000
            const runtime = now - this._step['begin_at']

            this._step['end_at'] = now
            this._step['time'] = runtime
        }

        let stats

        if (this.verbose) {
            stats = util.inspect(this.stats, {
                depth: null,
                colors: this.colors,
            })

        } else {
            this.stats.steps.map((step) => {
                const key = step.key || `step-${step.index}`

                return {
                    [key]: step.time,
                }
            })

            stats = util.inspect(stats, {
                depth: null,
            })
        }

        this._log(stats)

        return this
    }

    _log (...args) {
        if (this.logger && this.enabled) {
            this.logger.info(...args)
        }
    }

    get enabled () {
        return this._enabled
    }

    get verbose () {
        return this._verbose
    }

    get colors () {
        return this._colors
    }

    get id () {
        return this._id
    }

    get label () {
        return this._label
    }

    get key () {
        return this._key
    }

    get details () {
        return this._details
    }

    get beginAt () {
        if (this._steps.length) {
            const firstStep = this._steps[0]

            return firstStep['end_at']

        } else {
            return null
        }
    }

    get endAt () {
        if (this._steps.length) {
            const lastStep = this._steps[this._steps.length - 1]

            return lastStep['end_at']

        } else {
            return null
        }
    }

    get time () {
        const _endAt = this.endAt || (Date.now() / 1000)
        const _beginAt = this.beginAt || (Date.now() / 1000)
        const _time = _endAt - _beginAt

        return _time
    }

    get step () {
        return this._step
    }

    get steps () {
        return this._steps
    }

    get stats () {
        return {
            type: 'Time',

            id: this.id,
            key: this.key,
            label: this.label,

            begin_at: this.begin_at,
            end_at: this.end_at,
            time: this.time,

            details: this.details,

            steps: this.steps,

            enabled: this.enabled,
        }
    }

    get info () {
        return this.stats
    }

}

// TODO: not yet implemented (tricky to port from Python to JavaScript)
// class RuntimeProfilerDecorator extends Profiler {
//
//     /*
//         A function timer (decorator)
//     */
//
//     constructor (options = {}) {
//         options = {
//             key: undefined,
//             label: undefined,
//             details: undefined,
//             logger: undefined,
//             enabled: undefined,
//             verbose: undefined,
//             colors: undefined,
//             ...options,
//         }
//
//         let {
//             key,
//             label,
//             details,
//             logger,
//             enabled,
//             verbose,
//             colors,
//         } = options
//
//         super({
//             logger: null,
//         })
//
//         if ((key || '').includes(' ')) {
//             label = key
//             key = null
//         }
//
//         this._key = key
//         this._label = label
//         this._details = details || {}
//
//         this._logger = logger
//         this._enabled = enabled
//         this._verbose = verbose
//         this._colors = colors
//
//         this._timer = new RuntimeProfilerTimer({
//             label: this._label,
//             key: this._key,
//             details: this._details,
//             logger: this._logger,
//             enabled: this._enabled,
//             verbose: this._verbose,
//             colors: this._colors,
//         })
//     }
//
//     // REVIEW: "method missing" in JavaScript?
//     // def __call__(this, fn):
//     //     try:
//     //         this.key = this.key or fn.__name__
//     //     except:
//     //         pass
//
//     //     def _function(*args, **kwargs):
//     //         this._timer.begin()
//
//     //         result = fn(*args, **kwargs)
//
//     //         this._timer.end()
//
//     //         return this
//
//     //     return _function
//
//     get timer () {
//         return this._timer
//     }
//
//     get id () {
//         return this.timer.id
//     }
//
//     get beginAt () {
//         return this.timer.beginAt
//     }
//
//     get endAt () {
//         return this.timer.endAt
//     }
//
//     get time () {
//         return this.timer.time
//     }
//
//     get steps () {
//         return this.timer.steps
//     }
//
//     get stats () {
//         return this.timer.stats
//     }
//
//     get info () {
//         return this.stats
//     }
//
// }

class RuntimeProfiler extends Profiler {

    constructor (options = {}) {
        options = {
            logger: undefined,
            ...options,
        }

        const {
            logger,
        } = options

        super({
            logger,
        })
    }

    // TODO: not yet implemented (tricky to port from Python to JavaScript)
    // decorator (fn, ...args) {
    //     const profiler = new RuntimeProfilerDecorator(...args)
    //
    //     return profiler
    // }

    timer (...args) {
        const profiler = new RuntimeProfilerTimer(...args)

        return profiler
    }

}


/* =========================================
      FUNCTIONS
-------------------------------------- */

function decorator (...args) {
    return RuntimeProfiler.default().decorator(...args)
}

function timer (...args) {
    return RuntimeProfiler.default().timer(...args)
}


/* =========================================
      EXPORTS
-------------------------------------- */

module.exports = {
    RuntimeProfilerTimer,
    // RuntimeProfilerDecorator,
    RuntimeProfiler,

    decorator,
    timer,
}
