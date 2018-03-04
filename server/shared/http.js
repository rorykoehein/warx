import { Observable } from 'rxjs/Observable';
import request from 'request-promise-native';

export const fetch = (url) =>
    Observable.create(observer => {
        request({ url, method: 'GET', json: true })
            .then(data => observer.next(data))
            .catch(error => observer.error(error, url))
            .finally(() => observer.complete())
    });

export const post = (url, data) =>
    Observable.create(observer => {
        request({ url, method: 'POST', json: data })
            .then(data => observer.next(data))
            .catch(error => observer.error(error, url, data))
            .finally(() => observer.complete())
    });