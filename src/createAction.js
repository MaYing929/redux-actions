import identity from 'lodash/identity';
import isFunction from 'lodash/isFunction';
import isUndefined from 'lodash/isUndefined';
import invariant from 'invariant';

export default function createAction(type, payloadCreator = identity, metaCreator) {
  invariant(
    isFunction(payloadCreator),
    'Expected payloadCreator to be a function or undefined'
  );

  const actionCreator = (...args) => {
    const hasError = args[0] instanceof Error;

    const action = {
      type
    };

    const payload = hasError ? args[0] : payloadCreator(...args);
    if (!isUndefined(payload)) {
      action.payload = payload;
    }

    if (hasError || payload instanceof Error) {
      // Handle FSA errors where the payload is an Error object. Set error.
      action.error = true;
    }

    if (isFunction(metaCreator)) {
      action.meta = metaCreator(...args);
    }

    return action;
  };

  actionCreator.toString = () => type.toString();

  return actionCreator;
}
