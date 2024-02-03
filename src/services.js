export function fetchSession() {
  return makeServiceCallWithoutHeaders("/api/auth/v1/session/", "GET");
}

export function fetchLogin(loginParams) {
  return makeServiceCallWithHeaders("/api/v1/session/", "POST", loginParams);
}

export function fetchLogout() {
  return makeServiceCallWithoutHeaders("/api/auth/v1/session/", "DELETE");
}

export function fetchEventDetails({ startDate, endDate }) {
  return makeServiceCallWithoutHeaders(
    `/api/auth/v1/user/event/?startDate=${startDate}&endDate=${endDate}`,
    "GET"
  );
}

export function fetchAddEvent(events) {
  return makeServiceCallWithHeaders("/api/auth/v1/user/event/", "POST", events);
}

export function fetchEventDelete(id) {
  return makeServiceCallWithoutHeaders(
    `/api/auth/v1/user/event/${id}`,
    "DELETE"
  );
}

export function fetchUpdateEvent(id, event) {
  return makeServiceCallWithHeaders(
    `/api/auth/v1/user/event/${id}`,
    "PUT",
    event
  );
}

function makeServiceCallWithHeaders(url, methodType, request) {
  return fetch(url, {
    method: methodType,
    headers: {
      "content-type": "application/json",
    },
    body: JSON.stringify(request),
  })
    .catch(() => Promise.reject({ error: "network-error" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}

function makeServiceCallWithoutHeaders(url, methodType) {
  return fetch(url, {
    method: methodType,
  })
    .catch(() => Promise.reject({ error: "network-error" }))
    .then((response) => {
      if (response.ok) {
        return response.json();
      }

      return response
        .json()
        .catch((error) => Promise.reject({ error }))
        .then((err) => Promise.reject(err));
    });
}
