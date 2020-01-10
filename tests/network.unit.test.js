const [  writeConfig,
    loadConfiguration,
    matchWildcard,
    enableTLS,
    _load,
    _loadStatus,
    _mergeKeys,
    _merge,
    _mapEdgeProxies,
    _mapEdgeProducts,
    _validateTarget,
    _setDefaults,
    _validateUrls,
    getDefaultProxy] = require('../lib/network.js').allFunctions();

const assert = require('assert');
const path = require('path');

const { load } = require('../index.js');
const fixtureDirectory = path.join(__dirname, 'fixtures');
const defaultOrgEnvFilename = `load-victorshaw-eval-test-config.yaml`;
let customFixtureDirPath = path.join(fixtureDirectory, defaultOrgEnvFilename);
const loadedConfig = load({ source: customFixtureDirPath });


describe('_validateTarget function tests', () => {

    it('_validateTarget should return true for valid data', (done) => {
        let target = {
            base_path: 'hellow',
            url: 'http://localhost:8080'
    }
    assert(_validateTarget(target));
    done();
    });

    it('_validateTarget should return false for null base_path', (done) => {
        let target = {
            base_path: null,
            url: 'http://localhost:8080'
    }
    assert.equal(_validateTarget(target), false);
    done();
    });

    it('_validateTarget should return false for null url', (done) => {
        let target = {
            base_path: 'hellow',
            url: null
    }
    assert.equal(_validateTarget(target), false);
    done();
    });

    it('_validateTarget should return false for null url and null base_path', (done) => {
        let target = {
            base_path: null,
            url: null
    }
    assert.equal(_validateTarget(target), false);
    done();
    });

});
    

describe('getDefaultProxy function tests', () => {

    it('getDefaultProxy should return array', (done) => {
    let config = {
        edgemicro: { 
            max_connections: 100
        }
    }
    let options = {
        localproxy: {
            apiProxyName: 'testProxy',
            revision: 1,
            targetEndpoint: 'http://localhost:8080',
            basePath: 'V1'
        }
    }
    assert(Array.isArray(getDefaultProxy(config, options)));
    done();
    });

    it('getDefaultProxy should return array of lenght 1', (done) => {
        let config = {
            edgemicro: { 
                max_connections: 100
            }
        }
        let options = {
            localproxy: {
                apiProxyName: 'testProxy',
                revision: 1,
                targetEndpoint: 'http://localhost:8080',
                basePath: 'V1'
            }
        }
        let data = getDefaultProxy(config, options);
        assert(Array.isArray(data) && data.length === 1);
        done();
    });

    it('getDefaultProxy should return valid data', (done) => {
        let config = {
            edgemicro: { 
                max_connections: 100
            }
        }
        let options = {
            localproxy: {
                apiProxyName: 'testProxy',
                revision: 1,
                targetEndpoint: 'http://localhost:8080',
                basePath: 'V1'
            }
        }
        let data = getDefaultProxy(config, options)[0];
        assert( data.max_connections === config.edgemicro.max_connections && data.name === options.localproxy.apiProxyName
        && data.proxy_name === "default" && data.target_name === "default" && data.revision === options.localproxy.revision
        && data.base_path === options.localproxy.basePath && data.url === options.localproxy.targetEndpoint );
        done();
    });
});


describe('_validateUrls function tests', () => {
   
    it('_validateUrls should return error', (done) => {
    
        let config = {
            edge_config: {
                bootstrap: 'https://apigee.net/edgemicro/bootstrap/organization/org/environment/env...',
                jwt_public_key: 'http://apigee.net/edgemicro/publicKey...'
            }
        }
        assert( _validateUrls(config) instanceof Error );
        done();
    });

    it('_validateUrls should return null', (done) => {
    
        let config = {
            edge_config: {
                bootstrap: 'https://edgemicroservices.apigee.net/edgemicro/bootstrap/organization/victorshaw-eval/environment/test',
                jwt_public_key: 'https://victorshaw-eval-test.apigee.net/edgemicro-auth/publicKey'
            }
        }
        assert( _validateUrls(config) === null );
        done();
    });

});
    
describe('_setDefaults function tests', () => {
   
    it('_setDefaults should return merged object', (done) => {
        let data = _setDefaults(loadedConfig);
        assert( 
            data.analytics.source === 'microgateway' &&
            data.analytics.proxy === 'dummy' &&
            data.analytics.proxy_revision === 1 &&
            data.analytics.compress === false
        );
        done();
    });
});
    
