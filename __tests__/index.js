import ObjectStateStorage from 'object-state-storage';

import StateModel from '..';

describe('StateModel', () => {
  describe('.set()', () => {
    it('handles simple default value assignment (1)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'string',
            __value: 'attr-1-value',
          },
        },
      });
      const patch = sm.set({}, {});
      expect(patch).toEqual({ 'attr-1': 'attr-1-value' });
    });
    it('handles simple default value assignment (2)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'string',
          },
        },
      });
      const patch = sm.set({}, {});
      expect(patch).toEqual({});
    });
    it('handles simple default value assignment (3)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'string',
            __value: 'attr-1-value',
          },
        },
      });
      const patch = sm.set({ 'attr-1': 'attr-1' }, {});
      expect(patch).toEqual({});
    });
    it('handles deep default value assignment (1)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              'attr-2': {
                __type: 'string',
                __value: 'attr-2-value',
              },
            },
          },
        },
      });
      const patch = sm.set({}, {});
      expect(patch).toEqual({ 'attr-1': { 'attr-2': 'attr-2-value' } });
    });
    it('handles deep default value assignment (2)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              'attr-2': {
                __type: 'string',
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'string',
                __value: 'attr-3-value',
              },
            },
          },
        },
      });
      const patch = sm.set({}, {});
      expect(patch).toEqual({ 'attr-1': { 'attr-2': 'attr-2-value', 'attr-3': 'attr-3-value' } });
    });
    it('handles deep default value assignment (3)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              'attr-2': {
                __type: 'string',
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'string',
              },
            },
          },
        },
      });
      const patch = sm.set({}, {});
      expect(patch).toEqual({ 'attr-1': { 'attr-2': 'attr-2-value' } });
    });
    it('handles deep default value assignment (4)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              'attr-2': {
                __type: 'string',
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'string',
                __value: 'attr-3-value',
              },
              'attr-4': {
                __type: 'string',
                __value: 'attr-4-value',
              },
              'attr-5': {
                __type: 'string',
              },
            },
          },
        },
      });
      const patch = sm.set({ 'attr-1': { 'attr-2': 'attr-2' } }, { 'attr-1': { 'attr-3': 'attr-3' } });
      expect(patch).toEqual({ 'attr-1': { 'attr-3': 'attr-3', 'attr-4': 'attr-4-value' } });
    });
    it('handles simple value assignment (1)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'string',
            __value: 'attr-1-value',
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': 'attr-1' });
      expect(patch).toEqual({ 'attr-1': 'attr-1' });
    });
    it('handles simple value assignment (2)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'boolean',
            __value: false,
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': true });
      const patch2 = sm.set({}, { 'attr-1': false });
      expect(patch).toEqual({ 'attr-1': true });
      expect(patch2).toEqual({ 'attr-1': false });
    });
    it('handles simple value assignment (nullable)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'string',
            __nullable: true,
            __value: 'attr-1-value',
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': null });
      expect(patch).toEqual({ 'attr-1': null });
    });
    it('handles simple value assignment ("*" type)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: '*',
          },
        },
      });
      const patch1 = sm.set({}, { 'attr-1': null });
      const patch2 = sm.set({}, { 'attr-1': 'attr-1' });
      const patch3 = sm.set({}, { 'attr-1': ['attr-1'] });
      const patch4 = sm.set({}, { 'attr-1': { 'attr-1': 'attr-1' } });
      expect(patch1).toEqual({ 'attr-1': null });
      expect(patch2).toEqual({ 'attr-1': 'attr-1' });
      expect(patch3).toEqual({ 'attr-1': ['attr-1'] });
      expect(patch4).toEqual({ 'attr-1': { 'attr-1': 'attr-1' } });
    });
    it('handles deep value assignment (one change, one default)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              'attr-2': {
                __type: 'string',
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'string',
                __value: 'attr-3-value',
              },
            },
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': { 'attr-2': 'attr-2' } });
      expect(patch).toEqual({ 'attr-1': { 'attr-2': 'attr-2', 'attr-3': 'attr-3-value' } });
    });
    it('handles deep value assignment (object without def)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              'attr-2': {
                __type: 'string',
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'object',
              },
            },
          },
        },
      });
      try {
        const patch = sm.set({}, { 'attr-1': { 'attr-3': { 'attr-4': 'attr-4' } } });
      } catch (e) {
        // expect(patch).toEqual({ 'attr-1': { 'attr-2': 'attr-2-value', 'attr-3': { 'attr-4': 'attr-4' } } });
        expect(e.toString()).toEqual('Error: Provided modifier doesn\'t match definition at "attr-1.attr-3.attr-4"');
      }
    });
    it('handles deep value assignment (nullable-1)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              'attr-2': {
                __type: 'string',
                __nullable: true,
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'string',
                __value: 'attr-3-value',
              },
            },
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': { 'attr-2': null } });
      expect(patch).toEqual({ 'attr-1': { 'attr-2': null, 'attr-3': 'attr-3-value' } });
    });
    it('handles deep value assignment (nullable-2)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __nullable: true,
            __value: {
              'attr-2': {
                __type: 'string',
                __nullable: true,
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'string',
                __value: 'attr-3-value',
              },
            },
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': null });
      expect(patch).toEqual({ 'attr-1': null });
    });
    it('handles deep value assignment ("*" type)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: '*',
            __value: {
              'attr-2': {
                __type: 'string',
                __nullable: true,
                __value: 'attr-2-value',
              },
              'attr-3': {
                __type: 'string',
                __value: 'attr-3-value',
              },
            },
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': 'attr-1' });
      expect(patch).toEqual({ 'attr-1': 'attr-1' });
    });
    it('handles deep value assignment (arrays)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'object',
            __value: {
              '*': {
                __type: '*',
              },
              'attr-2': {
                __type: 'array',
                __value: [],
              },
            },
          },
        },
      });
      const patch = sm.set({}, { 'attr-1': { 'attr-2': [1, 2], 'attr-3': 'attr-3-value' } });
      expect(patch).toEqual({ 'attr-1': { 'attr-2': [1, 2], 'attr-3': 'attr-3-value' } });
    });
    it('handles "*"-key in definition (1)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          'attr-1': {
            __type: 'string',
            __value: 'attr-1-value',
          },
          '*': {
            __type: 'string',
          },
        },
      });
      const patch = sm.set({}, { 'attr-2': 'attr-2-value' });
      expect(patch).toEqual({ 'attr-1': 'attr-1-value', 'attr-2': 'attr-2-value' });
    });
    it('handles "*"-key in definition (2)', () => {
      const sm = new StateModel({
        __type: 'object',
        __value: {
          '*': {
            __type: 'object',
            __value: {
              'attr-1': {
                __type: 'string',
                __value: 'attr-1-value',
              },
              'attr-2': {
                __type: 'string',
              },
            },
          },
        },
      });
      const patch1 = sm.set({}, { 'any-key-1': {} });
      // const patch2 = sm.set({}, { 'any-key-1': { 'attr-3': 'attr-3-value' } });
      expect(patch1).toEqual({ 'any-key-1': { 'attr-1': 'attr-1-value' } });
    });
  });
});

describe('Readme example', () => {
  it('runs as expected', () => {
    const store = new ObjectStateStorage({ error: null });
    // for example a list of items
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
    expect(store.state).toEqual({
      id_1: { title: 'Hello world', timestamp: 1510737513759, display: false },
      error: null,
    });

    store.setState(state => {
      try {
        return sm.set(state, { id_1: { timestamp: '1510737513759' } });
      } catch (err) {
        return {
          error: 'Error: Type mismatch at "id_1.timestamp" ("number" expected, but "string" received)',
        };
      }
    });

    expect(store.state).toEqual({
      error: 'Error: Type mismatch at "id_1.timestamp" ("number" expected, but "string" received)',
      id_1: { title: 'Hello world', timestamp: 1510737513759, display: false },
    });
  });
});

describe('Other usecases', () => {
  it('fix-1', () => {
    const model = new StateModel({
      __type: 'object',
      __value: {
        user: {
          __type: 'object',
          __nullable: true,
          __value: {
            a: {
              __type: 'string',
              __value: 'a-value',
            },
            b: {
              __type: 'string',
              __value: 'b-value',
            },
          },
        },
      },
    });
    expect(model.set({ user: null }, { user: { a: 'a', b: 'b' } })).toEqual({ user: { a: 'a', b: 'b' } });
  });
  it('fix-2', () => {
    const model = new StateModel({
      __type: 'object',
      __value: {
        '*': {
          __type: 'string',
        },
        a: {
          __type: 'string',
          __value: 'b',
        },
      },
    });
    expect(model.set({ a: 'a' }, { c: 'c' })).toEqual({ c: 'c' });
  });
});
