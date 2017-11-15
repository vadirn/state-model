**state-model** helps to define application state structure, default values and validate modifications. E.g. if app
state is too complex to remember it.

This is a es6 module. No compiled version is provided. Install via `npm install state-model` or `yarn add state-model`

## API

* `const sm = new StateModel(definition: Object)` - create new state model instance. Definition has a specific format
* `sm.set(state: Object, modifier: Object) => Object` - validates modifier against definition, extends with default
  values if state doesn't have them. Returns valid modifier or throws an error if modifier is invalid

## Definition format

Every attribute of definition can have the following parameters:

* `__type` - required. Possible values: "\*" - any type; "string"; "array"; "number"; "object"; "null"; "boolean"
* `__nullable` - optional. If true, the attribute could have "null" value
* `__value` - optional. Used as default value of the attribute (if `__type` is not "object"). If `__type` is "object",
  but doesn't have default value, it will throw an error. To assign any object set `__type: '*'`

* PLANNED: `__required` - optional. Throw an error if modifier doesn't contain required key

For example:

```javascript
{
  // root object should always be of object type
  __type: 'object',
  __value: {
    'attr-1': {
      __type: '*',
      __value: {
        'attr-2': {
          __type: 'string',
          __nullable: true
        }
      }
    },
    'attr-3': {
      __type: '*',
    }
  }
}
```

## How to use?

```javascript
// In case you are using object-state-storage for state management
import StateModel from 'state-model';
const store = new ObjectStateStorage({ error: null });

// for example store contains a list of items
const sm = new StateModel({
  __type: 'object',
  __value: {
    '*': {
      __type: 'object',
      __value: {
        title: {
          __type: 'string',
        },
        timestamp: {
          __type: 'number',
        },
        display: {
          __type: 'boolean',
          __value: false,
        },
      },
    },
    error: {
      __type: 'string',
      __nullable: true,
      __value: null,
    },
  },
});

store.setState(state => sm.set(state, { id_1: { title: 'Hello world', timestamp: 1510737513759 } }));
// store.state is going to be
// {
//   id_1: { title: 'Hello world', timestamp: 1510737513759, display: false },
//   error: null,
// }

store.setState(state => {
  try {
    return sm.set(state, { id_1: { timestamp: '1510737513759' } });
  } catch (err) {
    return {
      error: 'Error: Type mismatch at "id_1.timestamp" ("number" expected, but "string" received)',
    };
  }
});
// store.state is going to be
// {
//   error: 'Error: Type mismatch at "id_1.timestamp" ("number" expected, but "string" received)',
//   id_1: { title: 'Hello world', timestamp: 1510737513759, display: false },
// }
```
