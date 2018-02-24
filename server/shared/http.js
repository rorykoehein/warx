import { Observable } from 'rxjs/Observable';
import request from 'request-promise-native';

export const fetch = (url, data) =>
    Observable.create(observer => {
        request({ url, method: 'GET', json: true })
            .then(data => observer.next(data))
            .catch(error => observer.error(error, url, data))
            .finally(() => observer.complete())
    });

export const post = (url, data) =>
    Observable.create(observer => {
        request({ url, method: 'POST', json: data })
            .then(data => observer.next(data))
            .catch(error => console.log('SERVERS_HUB_CHECK_ERROR?') || observer.error(error, url, data))
            .finally(() => observer.complete())
    });