// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
    production: false,
    // apiUrl: 'https://mirecall-admin-enterprise-api.ctoninja.tech',
    apiUrl :'http://localhost:5002',
    // qrUrl: 'https://mirecall-frontend-new.vercel.app',
    qrUrl: 'http://localhost:4200',
    version: '/api/v1',
    pageTitle: ' | mi-Recall-organizer',
  };
  