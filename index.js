import get from 'lodash/get';

// returns type of provided value: string, array, number, object, null, boolean
export const getType = value => {
  let type = typeof value;
  if (type === 'object') {
    // array, object or null
    if (value === null) {
      type = 'null';
    } else if (Array.isArray(value)) {
      type = 'array';
    }
  }
  return type;
};

export default class StateModel {
  constructor(definition) {
    this.definition = definition;
  }
  // returns a patch to be applied to state
  set(state, modifier, statePath = [], modifierPath = [], definitionPath = ['__value']) {
    const patch = {};

    let modifierKeys = new Set();
    let stateKeys = new Set();
    const definitionKeys = new Set(Object.keys(get(this.definition, definitionPath, {})));

    // const stateKeys =
    //   statePath.length > 0 ? new Set(Object.keys(get(state, statePath, {}))) : new Set(Object.keys(state || {}));
    if (statePath.length > 0) {
      const valueAtPath = get(state, statePath, {});
      if (valueAtPath) {
        stateKeys = new Set(Object.keys(valueAtPath));
      }
    } else if (state) {
      stateKeys = new Set(Object.keys(state));
    }

    if (modifier) {
      modifierKeys =
        modifierPath.length > 0
          ? new Set(Object.keys(get(modifier, modifierPath, {}) || {}))
          : new Set(Object.keys(modifier));
    }

    // run through definition keys, and remove relevant keys for modifier and state
    // if modifier contains *, almost everything may pass
    for (const defKey of definitionKeys) {
      const attrParams = get(this.definition, [...definitionPath, defKey]);
      if (defKey === '*') {
        for (const modKey of modifierKeys) {
          if (!definitionKeys.has(modKey)) {
            const modifierValue = get(modifier, [...modifierPath, modKey]);
            const modifierType = getType(modifierValue);
            if (
              (attrParams.__type !== 'object' && attrParams.__type === modifierType) ||
              (modifierType === 'null' && attrParams.__nullable) ||
              attrParams.__type === '*'
            ) {
              patch[modKey] = modifierValue;
            } else if (attrParams.__type === 'object') {
              patch[modKey] = this.set(
                state,
                modifier,
                [...statePath, modKey],
                [...modifierPath, modKey],
                [...definitionPath, '*', '__value']
              );
            } else {
              throw new Error(
                `Type mismatch at "${[...modifierPath, modKey].join('.')}" ("${attrParams.__type}" expected, but "${
                  modifierType
                }" received)`
              );
            }
            modifierKeys.delete(modKey);
            // stateKeys.delete(modKey);
          }
        }
        // remove all state keys, that match *
        // iterate over definition keys, number of them is less than state keys
        // for (const stateKey of stateKeys) {
        //   if (!definitionKeys.has(stateKey)) {
        //     stateKeys.delete(stateKey);
        //   }
        // }
        const nextStateKeys = new Set();
        for (const defKey of definitionKeys) {
          if (stateKeys.has(defKey)) {
            nextStateKeys.add(defKey);
          }
        }
        stateKeys = nextStateKeys;
      } else if (!modifierKeys.has(defKey) && !stateKeys.has(defKey)) {
        if (attrParams.__type !== 'object' && attrParams.__value !== undefined) {
          // both modifier and state don't have values, use __value if __type is not object
          patch[defKey] = attrParams.__value;
        } else if (attrParams.__type === 'object') {
          // if __type is object, dive in
          patch[defKey] = this.set(
            state,
            modifier,
            [...statePath, defKey],
            [...modifierPath, defKey],
            [...definitionPath, defKey, '__value']
          );
        }
      } else if (modifierKeys.has(defKey)) {
        const modifierValue = get(modifier, [...modifierPath, defKey]);
        const modifierType = getType(modifierValue);
        // check if types match
        if (attrParams.__type !== 'object' && attrParams.__type === modifierType) {
          patch[defKey] = modifierValue;
        } else if (attrParams.__type === 'object' && modifierType === 'object') {
          patch[defKey] = this.set(
            state,
            modifier,
            [...statePath, defKey],
            [...modifierPath, defKey],
            [...definitionPath, defKey, '__value']
          );
        } else if ((modifierType === 'null' && attrParams.__nullable) || attrParams.__type === '*') {
          // check if definition allows null as a value
          patch[defKey] = modifierValue;
        } else {
          throw new Error(
            `Type mismatch at "${[...modifierPath, defKey].join('.')}" ("${attrParams.__type}" expected, but "${
              modifierType
            }" received)`
          );
        }
      }

      // remove key from modifier
      modifierKeys.delete(defKey);
      stateKeys.delete(defKey);
    }

    if (stateKeys.size > 0) {
      throw new Error(
        `Provided state doesn't match definition at "${[...statePath, stateKeys.keys().next().value].join('.')}"`
      );
    }

    if (modifierKeys.size > 0) {
      throw new Error(
        `Provided modifier doesn't match definition at "${[...modifierPath, modifierKeys.keys().next().value].join(
          '.'
        )}"`
      );
    }

    return patch;
  }
}
