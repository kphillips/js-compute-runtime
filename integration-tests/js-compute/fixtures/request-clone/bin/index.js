/* eslint-env serviceworker */
import { env } from 'fastly:env';
import { pass, fail, assert, assertThrows } from "../../../assertions.js";

addEventListener("fetch", event => {
    event.respondWith(app(event))
})
/**
 * @param {FetchEvent} event
 * @returns {Response}
 */
function app(event) {
    try {
        const path = (new URL(event.request.url)).pathname;
        console.log(`path: ${path}`)
        console.log(`FASTLY_SERVICE_VERSION: ${env('FASTLY_SERVICE_VERSION')}`)
        if (routes.has(path)) {
            const routeHandler = routes.get(path);
            return routeHandler()
        }
        return fail(`${path} endpoint does not exist`)
    } catch (error) {
        return fail(`The routeHandler threw an error: ${error.message}` + '\n' + error.stack)
    }
}

const routes = new Map();
routes.set('/', () => {
    routes.delete('/');
    let test_routes = Array.from(routes.keys())
    return new Response(JSON.stringify(test_routes), { 'headers': { 'content-type': 'application/json' } });
});
routes.set("/request/clone/called-as-constructor", () => {
    let error = assertThrows(() => {
        new Request.prototype.clone()
    }, TypeError, `Request.prototype.clone is not a constructor`)
    if (error) { return error }
    return pass()
});
routes.set("/request/clone/called-unbound", () => {
    let error = assertThrows(() => {
        Request.prototype.clone.call(undefined)
    }, TypeError, "Method clone called on receiver that's not an instance of Request")
    if (error) { return error }
    return pass()
});
routes.set("/request/clone/valid", async () => {
    const request = new Request('https://httpbin.org/post', {
        headers: {
            hello: 'world'
        },
        body: 'te',
        method: 'post',
        backend: "httpbin"
    })
    const newRequest = request.clone();
    let error = assert(newRequest instanceof Request, true, 'newRequest instanceof Request')
    if (error) { return error }
    error = assert(newRequest.method, request.method, 'newRequest.method === request.method')
    if (error) { return error }
    error = assert(newRequest.url, request.url, 'newRequest.url === request.url')
    if (error) { return error }
    error = assert(newRequest.headers, request.headers, 'newRequest.headers === request.headers')
    if (error) { return error }
    error = assert(request.bodyUsed, false, 'request.bodyUsed === false')
    if (error) { return error }
    error = assert(newRequest.bodyUsed, false, 'newRequest.bodyUsed === false')
    if (error) { return error }
    return pass()
});
routes.set("/request/clone/invalid", async () => {
    const request = new Request('https://httpbin.org/post', {
        headers: {
            hello: 'world'
        },
        body: 'te',
        method: 'post',
        backend: "httpbin"
    })
    await request.text()
    let error = assertThrows(() => request.clone())
    if (error) { return error }
    return pass()
});
routes.set("/request/clone/fetch-with-body", async () => {
    let error;
    const request = new Request('https://httpbin.org/post', {
        headers: {
            hello: 'world',
        },
        body: 'te',
        method: 'post',
        backend: "httpbin",
    })
    const newRequest = request.clone();
    // let error = assert(newRequest instanceof Request, true, 'newRequest instanceof Request')
    // if (error) { return error }
    // error = assert(newRequest.method, request.method, 'newRequest.method === request.method')
    // if (error) { return error }
    // error = assert(newRequest.url, request.url, 'newRequest.url === request.url')
    // if (error) { return error }
    // error = assert(newRequest.headers, request.headers, 'newRequest.headers === request.headers')
    // if (error) { return error }
    // error = assert(request.bodyUsed, false, 'request.bodyUsed === false')
    // if (error) { return error }
    // error = assert(newRequest.bodyUsed, false, 'newRequest.bodyUsed === false')
    // if (error) { return error }

    // await the request body for a cloned request, after sending on the original
    // this ensures that we're keeping around the correct state after the original request has been sent.
    const response = await fetch(request);
    console.log(response)
    console.log(await response.text())

    error = assert(request.bodyUsed, true, 'request.bodyUsed === true')
    if (error) { return error }
    // error = assert(newRequest.bodyUsed, false, 'newRequest.bodyUsed === false')
    // if (error) { return error }
    // error = assert(await newRequest.text(), 'te', 'await newRequest.text() === "te"')
    // if (error) { return error }

    return pass()
});
routes.set("/request/clone/fetch-without-body", async () => {
    let error;
    const request = new Request('https://httpbin.org/get', {
        headers: {
            hello: 'world',
        },
        method: 'get',
        backend: "httpbin",
    });
    request.headers.forEach((value, key) => {
        console.log({value, key})
    })
    const newRequest = request.clone();
    request.headers.forEach((value, key) => {
        console.log({value, key})
    })
    newRequest.headers.forEach((value, key) => {
        console.log({value, key})
    })
    // let error = assert(newRequest instanceof Request, true, 'newRequest instanceof Request')
    // if (error) { return error }
    // error = assert(newRequest.method, request.method, 'newRequest.method === request.method')
    // if (error) { return error }
    // error = assert(newRequest.url, request.url, 'newRequest.url === request.url')
    // if (error) { return error }
    // error = assert(newRequest.headers, request.headers, 'newRequest.headers === request.headers')
    // if (error) { return error }
    // error = assert(request.bodyUsed, false, 'request.bodyUsed === false')
    // if (error) { return error }
    // error = assert(newRequest.bodyUsed, false, 'newRequest.bodyUsed === false')
    // if (error) { return error }

    // await the request body for a cloned request, after sending on the original
    // this ensures that we're keeping around the correct state after the original request has been sent.
    const response = await fetch(request);
    console.log(response)
    console.log(await response.text())

    error = assert(request.bodyUsed, true, 'request.bodyUsed === true')
    if (error) { return error }
    // error = assert(newRequest.bodyUsed, false, 'newRequest.bodyUsed === false')
    // if (error) { return error }
    // error = assert(await newRequest.text(), 'te', 'await newRequest.text() === "te"')
    // if (error) { return error }

    return pass()
});
