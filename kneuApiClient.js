'use strict';

class KneuApi {
    #accessToken;

    #contentRange;

    constructor(accessToken) {
        this.#accessToken = accessToken
    }

    async getFaculties() {
        return this.#getEntityList('faculty', ...arguments)
    }

    async getDepartments() {
        return this.#getEntityList('department', ...arguments)
    }

    async getTeachers() {
        return this.#getEntityList('teacher', ...arguments)
    }

    async getSpecialties() {
        return this.#getEntityList('specialty', ...arguments)
    }

    async getGroups() {
        return this.#getEntityList('group', ...arguments)
    }

    async getStudents() {
        return this.#getEntityList('student', ...arguments)
    }

    async getFaculty() {
        return this.#getEntity('faculty', ...arguments)
    }

    async getDepartment() {
        return this.#getEntity('department', ...arguments)
    }

    async getTeacher() {
        return this.#getEntity('teacher', ...arguments)
    }

    async getSpecialty() {
        return this.#getEntity('specialty', ...arguments)
    }

    async getGroup() {
        return this.#getEntity('group', ...arguments)
    }

    async getStudent() {
        return this.#getEntity('student', ...arguments)
    }

    async getUser() {
        return this.#request('user/me');
    }

    async #getEntity(entityName, entityId) {
        if (!entityId) {
            throw new Error('Wrong ' + entityName + ' id: ' + entityId);
        }

        return this.#request(entityName + '/' + entityId);
    }

    async #getEntityList(entityName, filters, offset, limit) {
        let params = filters instanceof Object ? filters : {};

        if (limit === undefined && offset === undefined) { // 1 args: limit or filter
            limit = filters instanceof Object ? undefined : filters;
            offset = undefined;
        } else if (limit === undefined) { // 2 args,
            // 2 args: filters and limit
            // 2 args: offset and limit
            limit = offset;
            offset = filters instanceof Object ? undefined : filters;
        }

        if (params.hasOwnProperty('limit')) {
            if (!isNaN(params.limit) && isNaN(limit)) {
                limit = params.limit;
            }
            delete params.limit;
        }

        if (params.hasOwnProperty('offset')) {
            if (!isNaN(params.offset) && isNaN(limit)) {
                offset = params.offset;
            }
            delete params.offset;
        }

        let urlParams = new URLSearchParams(params);

        let entitiesResultList = [];
        let entities, total;
        offset = offset || 0;
        do {
            urlParams.set('offset', offset);
            if (limit) {
                urlParams.set('limit', limit);
            }
            entities = await this.#request(entityName + '?' + urlParams.toString())
            entitiesResultList = entitiesResultList.concat(entities);

            offset = this.getContentRange('end') + 1;
            total = this.getContentRange('total');

            if (limit) {
                limit -= entities.length;
                if (limit <= 0) {
                    break;
                }
            }
        } while (offset < total);

        return entitiesResultList;
    }

    async #request(uri, postParams) {
        let url = 'https://auth.kneu.edu.ua/api/' + uri;
        let init = {
            mode: 'cors',
            headers: {
                Authorization: 'Bearer ' + this.#accessToken,
            }
        }
        if (postParams) {
            init.method = 'POST';
            init.headers['Content-Type'] = 'application/json';
            init.body = JSON.stringify(postParams);
        }
        let response = await fetch(url, init)

        this.#contentRange = this.#parseContentRange(response.headers.get('Content-Range'));
        return response.json();
    }

    #parseContentRange(contentRangeHeader) {
        let matches = /items\s*(\d+)-(\d+)\/(\d+)/.exec(contentRangeHeader);
        return matches ? {
            start: parseInt(matches[1]),
            end: parseInt(matches[2]),
            total: parseInt(matches[3]),
        } : {};
    }

    getContentRange(key) {
        return key === undefined ? this.#contentRange : (this.#contentRange[key] || null);
    }
}

module.exports = KneuApi;
