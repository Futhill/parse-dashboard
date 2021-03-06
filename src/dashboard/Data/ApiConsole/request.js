/*
 * Copyright (c) 2016-present, Parse, LLC
 * All rights reserved.
 *
 * This source code is licensed under the license found in the LICENSE file in
 * the root directory of this source tree.
 */
import Parse from 'parse';

export default function request(app, method, path, body, options) {
  let xhr = new XMLHttpRequest();
  let promise = new Parse.Promise();
  if (path.startsWith('/') && app.serverURL.endsWith('/')) {
    path = path.substr(1);
  }
  if (!path.startsWith('/') && !app.serverURL.endsWith('/')) {
    path = '/' + path;
  }
  xhr.open(method, app.serverURL + path, true);
  xhr.setRequestHeader('X-Parse-Application-Id', app.applicationId);
  if (options.useMasterKey) {
    xhr.setRequestHeader('X-Parse-Master-Key', app.masterKey);
  } else if (app.restKey) {
    xhr.setRequestHeader('X-Parse-REST-API-Key', app.restKey);
  }
  if (options.sessionToken) {
    xhr.setRequestHeader('X-Parse-Session-Token', options.sessionToken);
  }
  xhr.onload = function(e) {
    let response = xhr.responseText;
    try {
      response = JSON.parse(response);
    } catch (e) {}
    promise.resolve(response);
  }
  xhr.send(body);
  return promise;
}
