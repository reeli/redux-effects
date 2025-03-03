/**
 * Imports
 */

import isPromise from 'is-promise'

/**
 * Action Types
 */

const EFFECT_COMPOSE = 'EFFECT_COMPOSE'

/**
 * Effects
 */

function effects ({dispatch, getState}) {
  return next => action =>
    action.type === EFFECT_COMPOSE
      ? composeEffect(action)
      : next(action)


  function composeEffect (action) {
    const q = promisify(maybeDispatch(action.payload))
    return action.meta && applyPromises(action.meta.steps, q)
  }

  function applyPromises (steps = [], q) {
    return steps.reduce((q, [success = noop, failure = noop]) => q.then(val => maybeDispatch(success(val)), err => maybeDispatch(failure(err))), q)
  }

  function maybeDispatch (action) {
    return action && dispatch(action)
  }
}

function promisify (val) {
  return Array.isArray(val)
    ? Promise.all(val)
    : Promise.resolve(val)
}

function noop () {}

/**
 * Action creator
 */

function bind (action, ...args) {
  return {
    type: EFFECT_COMPOSE,
    payload: action,
    meta: {
      steps: [args]
    }
  }
}

/**
 * Exports
 */

export default effects
export {
  bind
}
