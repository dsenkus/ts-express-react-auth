# TypeScript React/Express boilerplate with authentication

Work in progress...

## TODO

- [x] needs better config/env solution 
- [x] extract auth into services/
- [x] extract users queries/validators to entities/users
- [x] refactor tests
- [x] better error handling, restart server when error code 500, catch unhandled promise rejections
  - build wrapper for DB errors
- [x] integrate PM2
- [x] integrate logger
- [x] rename anonymous arrow functions to regular named functions
- [ ] add rate limiter for auth
- [ ] add size limiter for body-parser
- [ ] remove `X-Powered-By` header
- [ ] restructure `devDependencies` and `dependencies`

## Reset database

```
docker-compose down
docker volume rm ts-auth_ts_auth
docker-compose build
```
