export const LOGIN_STATUS = {
    PENDING: 'pending',
    NOT_LOGGED_IN: 'notLoggedIn',
    IS_LOGGED_IN: 'loggedIn',
};
  
export const SERVER = {
    AUTH_MISSING: 'auth-missing',
    AUTH_INSUFFICIENT: 'auth-insufficient',
    REQUIRED_USERNAME: 'required-username',
    INVALID_USERNAME: 'invalid-username',
    MAX_EVENTS: 'max-events',
    REQUIRED_TITLE: 'required-title',
    REQUIRED_EVENT: 'required-event',
    INVALID_DATE_FORMAT: 'invalid-date-format',
    EXCEED_CHAR: 'exceed-character',
}

export const CLIENT = {
    NETWORK_ERROR: 'network-error',
    NO_SESSION: 'no-session',
}

export const MESSAGES = {
    [CLIENT.NETWORK_ERROR]: 'Trouble connecting to the network.  Please try again',
    [SERVER.AUTH_INSUFFICIENT]: 'Your username/password combination does not match any records, please try again.',
    [SERVER.REQUIRED_USERNAME]: 'Username is required, please enter',
    [SERVER.INVALID_USERNAME]: 'Please enter a valid username, it should contain only letters or numbers',
    [SERVER.REQUIRED_TITLE]: 'Title is required',
    [SERVER.REQUIRED_EVENT]: 'Event is empty please add event',
    [SERVER.MAX_EVENTS]: 'Only upto 5 events are allowed for a day',
    [SERVER.INVALID_DATE_FORMAT]: 'Invalid date date format',
    [SERVER.EXCEED_CHAR]: 'Title can not exceed 40 characters',
    default: 'Something went wrong.  Please try again',
  };

export const DATE_FORMATS = {
    SERVER_DATE: 'dd-MM-yyyy',
    CLIENT_DATE: 'EEE MMM dd yyyy'
}