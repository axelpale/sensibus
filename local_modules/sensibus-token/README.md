# sensibus-token

This module provides an easy access to JWT token and its contents. At start up, the module reads the token from localStorage if available and stores the token there when set.

Usage:

```
> const sbtoken = require('sensibus-token')
> sbtoken.hasToken()
false
> sbtoken.setToken("eyJhbGciOiJIUzI1NiIsInR5c...)
> sbtoken.hasToken()
true
> sbtoken.getToken()
"eyJhbGciOiJIUzI1NiIsInR5c...
> sbtoken.getUser()
{
  id: '161803398874',
  name: 'Von Himbaldt',
  email: 'alexander.von@himbaldt.org',
  admin: false
}
> sbtoken.removeToken()
> sbtoken.getUser()
null
> sbtoken.getToken()
null
```

See API details in the source code.

## Development

Input `$ npm test` to lint and run unit tests.
