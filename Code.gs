// Created by Rick Viscomi (@rick_viscomi)
// Adapted from https://ithoughthecamewithyou.com/post/automate-google-pagespeed-insights-with-apps-script by Robert Ellison

var scriptProperties = PropertiesService.getScriptProperties();
var pageSpeedApiKey = scriptProperties.getProperty('PSI_API_KEY');
var pageSpeedMonitorUrls = [
  'origin:https://developers.google.com',
  'origin:https://developer.mozilla.org'
];

function monitor() {
  for (var i = 0; i < pageSpeedMonitorUrls.length; i++) {
    var url = pageSpeedMonitorUrls[i];
    var desktop = callPageSpeed(url, 'desktop');
    var mobile = callPageSpeed(url, 'mobile');
    addRow(url, desktop, mobile);
  }
}

function callPageSpeed(url, strategy) {
  var pageSpeedUrl = 'https://www.googleapis.com/pagespeedonline/v4/runPagespeed?url=' + url + '&fields=loadingExperience&key=' + pageSpeedApiKey + '&strategy=' + strategy;
  var response = UrlFetchApp.fetch(pageSpeedUrl);
  var json = response.getContentText();
  return JSON.parse(json);
}

function addRow(url, desktop, mobile) {
  var spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = spreadsheet.getSheetByName('Sheet1');
  sheet.appendRow([
    Utilities.formatDate(new Date(), 'GMT', 'yyyy-MM-dd'),
    url,
    getFastFCP(desktop),
    getFastFCP(mobile)
  ]);
}

function getFastFCP(data) {
  return data.loadingExperience.metrics.FIRST_CONTENTFUL_PAINT_MS.distributions[0].proportion;
}
