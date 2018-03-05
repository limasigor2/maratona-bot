const request = require('request').defaults({ encoding: null })

class AzureApi{
    constructor(enpoint, key) {
        this._endpoint = endpoint;
        this._key = key;
    }

    findFromStream(stream){
        return new Promise((resolve,reject)=>{
            const payload = {
                url: this._endpoint,
                endpoint: 'binary',
                json: true,
                headers:{
                    'Ocp-Apim-Subscription-Key': this._key,
                    'content-type': 'application/octet-stream'
                }
            }
            stream.pipe(request.post(payload, (error, response, body) => {
                if(error)
                    return reject(error);
                if(response.statusCode !== 200)
                    return reject(body);
                resolve(body);
            }));
        });
    }

    findFromUrl(url){
        return new Promise((resolve, reject) => {
            const payload = {
                url: this._endpoint,
                json: {'url':url},
                headers: {
                    'Ocp-Apim-Subscription-Key': this._key,
                    'content-type': 'application/json'
                }
            }
            request.post(payload, (error, response, body)=>{
                if(error)
                    return reject(error);
                if(response.statusCode !== 200)
                    return reject(body);
                return resolve(body);
            })
        });
    }
}

module.exports = AzureApi;