// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,
  dateFormatCreate: 'dd/mm/yy',
  dateFormatEdit: 'dd/mm/yy',
  dateFormatView: 'dd/mm/yy',
  dateFormatList: 'dd/MM/yyyy',
  trueValue: 'Vrai',
  falseValue: 'Faux',
  emptyForExport: '-----',

  apiUrlRentalmanagementms1: 'http://localhost:8036/api/',
  loginUrl: 'http://localhost:8036/',
  registerUrl: 'http://localhost:8036/register',
  apiUrl: 'http://localhost:8036/',

  uploadMultipleUrl: 'http://localhost:8036/api/cloud/upload-multiple/bucket/ana',

  stripeUrl: "http://localhost:8036/api/payment/create-payment-intent/",
  stripePublicKey: "pk_test_51PVbvFRxVNBDrAcwfSz21b6EtPSpl6Fw3gUoKpIGWZN5whhSfS67W4hbtk95OMF1JSpxgYPyp9AmkNOAPLNFR7St00tDXFRjuV",


  rootAppUrl:'app',

};

