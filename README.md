<div align="center">
	<img src="./logo.png" width="400" alt="Laravel + Angular Logo"/>
</div>

# Laravel + Angular Boilerplate
Quick start for Laravel 5.6 + Angular 6.0 projects with JWT auth.

## Includes:

### Front-end:
- Angular CLI boilerplate files
- JWT authentication service
- Login/Register components (Angular Material)  
- Password reset components

### Back-end:
- Composer build file
- Boilerplate files
- JWT authentication
- Password reset functionality

## Server
- Install [PHP](http://fi2.php.net/downloads.php) and one of the following Databases: [MySQL](https://www.mysql.com/downloads/), [PostgreSQL](https://www.postgresql.org/download/), [MS SQL Server](https://www.microsoft.com/en-us/sql-server/sql-server-downloads) or [SQL Lite](https://www.sqlite.org/download.html).

- Install [Composer](https://getcomposer.org/) and [nodeJS](https://nodejs.org).

- Go to `Server` folder and run `composer install` to install dependencies.

- Set your DB connections in `.env`: DB_CONNECTION (mysql, pgsql, sqlsrv, sqlite), DB_DATABASE, DB_PORT, DB_USERNAME, DB_PASSWORD. For email sending make sure that you have in your .env file next keys set: `MAIL_DRIVER`, `MAIL_HOST`, `MAIL_PORT`, `MAIL_USERNAME`, `MAIL_PASSWORD`, `MAIL_ENCRYPTION`. Fou production build change environment to production: `APP_ENV=production`.

- To update your DB to current version go to `Server` folder and run `php artisan migrate`. If you want to rollback old migration use `php artisan migrate:rollback`.
- (OPTIONAL) If you want to change `APP_KEY` run `php artisan key:generate` to generate app key. If you get any error on key generation, check if line `APP_KEY=` exists in `.env`, then rerun command. Make sure that apache has access to write into `Server/bootstrap/cache` and `Server/storage` folders.

- (OPTIONAL) If you want to change JWT secret run `php artisan jwt:generate` to generate secret for API.

- In migrations, the default user is created for which username is **"admin"** and password is **"password"**.

## Client
- Install [nodeJS](https://nodejs.org)

- Globally install [Angular CLI](https://cli.angular.io/) using command `npm install -g @angular/cli@latest`

- Open *Client* folder in terminal/console and run `npm i` to install all dependencies.

- Add URL to your local server to  `/Client/src/environments/environment.ts`.

- Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

- If you want to generate a new component run `ng generate component component-name`. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

- Run `ng build -prod` in `Client` directory to build angular client. The build artifacts will be stored in the `dist/` directory.

![Screenshot](./img1.jpg)

## License: [MIT](https://opensource.org/licenses/MIT)
