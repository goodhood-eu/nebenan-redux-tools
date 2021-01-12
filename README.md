nebenan-redux-tools
====================

A set of redux helpers.

- [Promise Middleware](#promise-middleware)
- [Network Middleware](#network-middleware)
  - [Trustworthy Endpoints](#trustworthy-endpoints)
  - [API Token](#api-token)
  - [X-Translations-Lang Header](#x-translations-lang-header)
  - [Should Request](#should-request)
  - [Abort Callback](#abort-callback)
  - [Request Types](#request-types)
  - [Pagination](#pagination)
  - [Mock Responses](#mock-response)
  - [Standalone Request](#standalone-request)
  - [Customize](#customize)
  
# Promise Middleware
The promise middleware gets triggered by dispatching actions with `promise` in payload. The middleware will dispatch resolved or rejected actions when the promise is fulfilled.

```js
dispatch({
  type: types.GET_USERS,
  promise: getUsersFromStorageAsync()
})
```

```js
// reducer
import { resolved, rejected } from 'nebenan-redux-tools/lib/promise';

export default (state = getDefaultState(), action) => {
  switch(action.type) {
    case resolved(types.GET_USERS): {
      const usersFromStorage = action.payload;

      return { ...state, users: usersFromStorage };
    }

    case rejected(types.GET_USERS): {
      const usersFromStorage = [];

      return { ...state, users: usersFromStorage };
    }

    default: {
      return state;
    }
  }
} 
```

# Network Middleware

The network middleware gets triggered by dispatching actions with `request` in payload. The middleware will fire the request and dispatches resolved or rejected actions when the request is finished.

Example:

```js
dispatch({
  type: types.GET_USERS,
  request: {
    url: "/users"
  }
})
```

```js
import { resolved, rejected } from 'nebenan-redux-tools/lib/network/types';

export default (state = getDefaultState(), action) => {
  switch(action.type) {
    case resolved(types.GET_USERS): {
      const usersFromResponse = action.payload;
      
      return { ...state, users: usersFromResponse };
    }
    
    case rejected(types.GET_USERS): {
      const usersFromResponse = [];
      
      return { ...state, users: usersFromResponse };
    }
    
    default: {
      return state;
    }
  }
} 
```

## Trustworthy Endpoints

Requests to trustworthy endpoints will enable the [X-Translations-Lang Header](#x-translations-lang-header) and [API Token](#api-token) features.

Set trusted domain via global config:
```js
import { configureNetwork } from 'nebenan-redux-tools/lib/network';

configureNetwork({
  trustedDomain: "nebenan.de",
  ...otherSettings
})
```

## API Token

Requests to [trustworthy endpoints](#trustworthy-endpoints) will have the `X-AUTH-TOKEN` header set, containing the api token configured in request options or through token middleware. 

Default: `state.token` (see token middleware)

Overwrite:
```js
dispatch({
  type: "some-type", 
  request: {
    url: "/some/endpoint",
    token: "special-api-token"
  }
})
```

## X-Translations-Lang Header

Requests to [trustworthy endpoints](#trustworthy-endpoints) will have the `X-Translations-Lang` header set, containing the locale configured in request options or through global config.

Default via global config: 
```js
import { configureNetwork } from 'nebenan-redux-tools/lib/network';

configureNetwork({
  locale: 'de-DE',
  ...otherSettings
})
```

Overwrite:
```js
dispatch({
  type: "some-type",
  request: {
    url: "/some/endpoint",
    locale: "en-US"  
  }
})
```

## Should Request

Prevents unnecessary requests by checking state beforehand. 

```js
dispatch({
  type: "some-type",
  request: {
    url: "/some/endpoint",
    shouldRequest(state) {
     return !state.isFetched;
    }
  }
})
```

## Abort Callback

Allows to cancel running requests. You receive the cancel function by providing `getAbortCallback` in request options.

```js
let cancelRequest;

dispatch({
  type: "some-type",
  request: {
    url: "/some/endpoint",
    getAbortCallback: (callback) => {
      cancelRequest = callback;
    }
  }
})


// later in app
cancelRequest();

```

## Request Types

`request.type` determines used HTTP method

### `query`

Sends out GET request. Collects parameters from `request.query` and applies [pagination](#pagination) query options if there are any.

```js
dispatch({
  type: "some-type",
  request: {
     url: "/users",
     type: 'query',
     query: { q: 'Peter' } 
  }
})
```


### `delete` / `head` / `options` / `post` / `put` / `patch`

```js
dispatch({
  type: "some-type",
  request: {
    url: "/some/endpoint/123",
    type: 'put',
    payload: { user: { email, password }}
  }  
})
```


## Pagination

There is some boilerplate needed to fully support paginated lists loaded over the network. These helpers help with managing state and sending pagination params over the network.

The endpoint you are accessing needs to fulfill following requirements:
- Parameters
  - `per_page`
  - `lower` / `higher`
- Response
  - `total_count` (`state.total` needs to be updated manually if field does not exist)

### `assignPaginationDefaults` / `paginationGenerator` helpers

```js
import { paginationGenerator, assignPaginationDefaults } from 'nebenan-redux-tools/lib/network/pagination';

const getDefaultState = () => assignPaginationDefaults({ entities: {} });
const getPaginationUpdates = paginationGenerator(types.BOOKMARKS_FETCH);

export const reducer = (state = getDefaultState(), action) => {
  let newState = state;
  
  const update = getPaginationUpdates(newState, action);
  if (update) newState = updeep(update, newState);
  
  switch (action.type) {
    case resolved(types.BOOKMARKS_FETCH): {
      const { result, entities } = parse(action.payload);

      const collection = newState.collection.concat(result.bookmarks);

      return updeep({ collection, entities }, newState);
    }
    
    default: {
      return newState;
    }
  }
}
```

The state now holds the following information
```js
{
  // (managed by paginationGenerator)
  currentPage: 0, 
  // datetime of last fetch (managed by paginationGenerator)
  lastFetched: 0,
  // request in progress (managed by paginationGenerator)
  isFetching: false,
  // request failed (managed by paginationGenerator) 
  isFailed: false,  
  // total amount of items over all pages (managed by paginationGenerator)
  total: null,
  // item ids for current page  
  collection: [],
}
```

### Actions

Pagination query params will be added for `query` requests with either `request.pagination.first` or `request.pagination.last` set.

*Only works for endpoints supporting `lower`/`higher` params.*

```js
dispatch({
  type: types.GET_USERS,
  request: {
    url: "/users",
    type: 'query',
    pagination: {
      per_page: 10, // optional
      first: firstUserId, // optional
      last: lastUserId // optional
    }
  }
})
```

## Mock Response

Responses can be mocked by using the [promise middleware](#promise-middleware). You can keep all of your request options in the action and don't need to modify reducers. Quite useful during development if you are waiting for backend to support new endpoints.


```js
dispatch({
  type: types.GET_USERS,
  promise: Promise.resolve([
    {
      id: 1,
      name: "Peter"
    },
    {
      id: 2,
      name: "Christina"
    }
  ]),
  request: {
    url: "/users",
    type: 'query'
  }
})
```

```js
// reducer
import { resolved } from 'nebenan-redux-tools/lib/network/types';

export default (state = getDefaultState(), action) => {
  switch(action.type) {
    case resolved(types.GET_USERS): {
      const usersFromResponse = action.payload;
      
      return { ...state, users: usersFromResponse };
    }
    
    default: {
      return state;
    }
  }
} 
```

## Standalone Request

Requests can be created programmatically too.

```js
import { createRequest } from 'nebenan-redux-tools/lib/network';

const sendFile = (file, token) => (
  createRequest({
    token,
    payload: { file },
    url: '/file-upload',
    type: 'post',
    multipart: true,
  }) 
)

const handleSuccess = (payload) => {
  // same as action.payload
  console.log(payload);
}

sendFile(newFile, token).then(handleSuccess);
```

## Customize

The network layer uses [axios](https://github.com/axios/axios) under the hood. To access axios specific features or extend functionality you can hook into request / response generation on a global or local scale.

Hooks:
- `requestHook(requestConfig, requestOptions)`
  - `requestConfig` the [axios request config](https://github.com/axios/axios#request-config) to be mutated
  - `requestOptions` the `request` object provided inside the action
- `responseHook(body, requestConfig, requestOptions)`
  - `body` response data to be mutated
  - `requestConfig` the [axios request config](https://github.com/axios/axios#request-config)
  - `requestOptions` the `request` object provided inside the action
  
### Setup global hooks

```js
import { configureNetwork } from 'nebenan-redux-tools/lib/network';

configureNetwork({
  requestHook: (requestConfig, requestOptions) => {
    // ...
  },
  responseHook: (body, requestConfig, requestOptions) => {
    // ...
  },
  ...networkSettings
})
```

### Action level request hook

```js
import { createRequest } from 'nebenan-redux-tools/lib/network';

const sendFile = (file, token, onProgress) => (
  createRequest({
    token,
    payload: { file },
    url: '/file-upload',
    type: 'post',
    multipart: true,
    // same as requestHook
    customize: (requestConfig) => {
      requestConfig.onUploadProgress = onProgress;
    }
  })
)
```

