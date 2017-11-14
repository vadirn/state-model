import Promise from 'bluebird';
import { injectDeps, useDeps } from 'components-di';
import React from 'react';
import routingService from 'routing-service';
import { Controller, Session } from 'session-controller';

let controllers = {};
// window.session = new SessionController(document.getElementById('mount-point'), {});

// console.log(window.session);
const createController = (name, actions, view) => {
  return class ControllerClass extends Controller {
    get name() {
      return name;
    }
    constructor(context) {
      super(context);
      this.view = injectDeps(this.context, actions)(view);
    }
    controllerWillMount(payload) {
      this.context.store.resetState(payload);
    }
    dispose() {}
  };
};

export const addController = (name, ControllerClass, payload = {}) => {
  Object.assign(controllers, {
    [name]: {
      controller: () => {
        return Promise.resolve({ default: ControllerClass });
      },
      payload,
    },
  });
};

export const addComponent = (name, actions = {}, view, payload = {}) => {
  Object.assign(controllers, {
    [name]: {
      controller: () => {
        return Promise.resolve({ default: createController(name, actions, view) });
      },
      payload,
    },
  });
};

const mapper = (context, actions) => {
  const state = context.store.state;
  return {
    items: state.items,
    actions,
  };
};
const view = ({ items, actions }) => {
  return (
    <div>
      <ul>
        {items.map(item => {
          return (
            <li key={item}>
              <a
                href={actions.composeURL('component', { name: item })}
                onClick={evt => {
                  evt.preventDefault();
                  actions.setLocation('component', { name: item });
                }}
              >
                {item}
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
const defaultView = useDeps(mapper)(view);

export const start = () => {
  addComponent(
    'default',
    {
      setLocation: (context, locationName, params) => {
        routingService.setLocation(locationName, { params });
      },
      composeURL: (context, locationName, params) => {
        return routingService.composeURL(locationName, { params });
      },
    },
    defaultView,
    {
      items: Object.keys(controllers).reduce((accum, item) => {
        accum.push(item);
        return accum;
      }, []),
    }
  );

  window.session = new Session(
    document.getElementById('mount-point'),
    Object.keys(controllers).reduce((accum, item) => {
      accum[item] = controllers[item].controller;
      return accum;
    }, {})
  );
  routingService
    .addRoute('component', '/c/:name', ({ params }) => {
      window.session.mountController(params.name, controllers[params.name].payload);
    })
    .addRoute('default', '/', () => {
      window.session.mountController('default', controllers.default.payload);
    });
  routingService.onLocationChange(window.location);
};
