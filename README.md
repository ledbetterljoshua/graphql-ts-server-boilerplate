# Awesome Project Build with TypeORM

Steps to run this project:

1. Run `npm i` command
2. Setup database settings inside `ormconfig.json` file
3. Run `npm start` command

## common issues

https://github.com/typeorm/typeorm/issues/4573
If you try running tests and get `""QueryFailedError: column cnst.consrc does not exist""` -- this is an issue with postgres 12 and typeorm. Try using postgres 11
