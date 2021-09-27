function formatParameters(parameters) {
  return (
    "?" +
    Object.keys(parameters)
      .map(function (key) {
        return `${key}=${encodeURIComponent(parameters[key])}`;
      })
      .join("&")
  );
}

function request(path, parameters, callback) {
  path += formatParameters(parameters);

  let xhr = new XMLHttpRequest();
  xhr.open("GET", path);

  xhr.addEventListener("readystatechange", event => {
    if (event.target.readyState !== 4) {
      return;
    }

    const responseObject = event.target.response;
    callback(responseObject);
  });

  xhr.send();
}
