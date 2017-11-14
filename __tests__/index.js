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
      const newState = sm.set({}, {});
      expect(newState).toEqual({ 'attr-1': 'attr-1-value' });
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
      const newState = sm.set({}, {});
      expect(newState).toEqual({});
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
      const newState = sm.set({}, {});
      expect(newState).toEqual({ 'attr-1': { 'attr-2': 'attr-2-value' } });
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
      const newState = sm.set({}, {});
      expect(newState).toEqual({ 'attr-1': { 'attr-2': 'attr-2-value', 'attr-3': 'attr-3-value' } });
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
      const newState = sm.set({}, {});
      expect(newState).toEqual({ 'attr-1': { 'attr-2': 'attr-2-value' } });
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
      const newState = sm.set({}, { 'attr-1': 'attr-1' });
      expect(newState).toEqual({ 'attr-1': 'attr-1' });
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
      const newState = sm.set({}, { 'attr-1': null });
      expect(newState).toEqual({ 'attr-1': null });
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
      const state1 = sm.set({}, { 'attr-1': null });
      const state2 = sm.set({}, { 'attr-1': 'attr-1' });
      const state3 = sm.set({}, { 'attr-1': ['attr-1'] });
      const state4 = sm.set({}, { 'attr-1': { 'attr-1': 'attr-1' } });
      expect(state1).toEqual({ 'attr-1': null });
      expect(state2).toEqual({ 'attr-1': 'attr-1' });
      expect(state3).toEqual({ 'attr-1': ['attr-1'] });
      expect(state4).toEqual({ 'attr-1': { 'attr-1': 'attr-1' } });
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
      const newState = sm.set({}, { 'attr-1': { 'attr-2': 'attr-2' } });
      expect(newState).toEqual({ 'attr-1': { 'attr-2': 'attr-2', 'attr-3': 'attr-3-value' } });
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
      const newState = sm.set({}, { 'attr-1': { 'attr-2': null } });
      expect(newState).toEqual({ 'attr-1': { 'attr-2': null, 'attr-3': 'attr-3-value' } });
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
      const newState = sm.set({}, { 'attr-1': null });
      expect(newState).toEqual({ 'attr-1': null });
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
      const newState = sm.set({}, { 'attr-1': 'attr-1' });
      expect(newState).toEqual({ 'attr-1': 'attr-1' });
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
      const newState = sm.set({}, { 'attr-2': 'attr-2-value' });
      expect(newState).toEqual({ 'attr-1': 'attr-1-value', 'attr-2': 'attr-2-value' });
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
      const state1 = sm.set({}, { 'any-key-1': {} });
      // const state2 = sm.set({}, { 'any-key-1': { 'attr-3': 'attr-3-value' } });
      expect(state1).toEqual({ 'any-key-1': { 'attr-1': 'attr-1-value' } });
    });
  });
});
