import request from "/http/request";

export function login(params) {
    try {
        return request.post("/login", params);
    } catch (error) {
        console.log(error);
    }
}

export function getVersion(params) {
    try {
        // return request.post("/login", params);
    } catch (error) {
        console.log(error);
    }
}
