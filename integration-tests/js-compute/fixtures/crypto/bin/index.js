/// <reference path="../../../../../types/index.d.ts" />

import { env } from 'fastly:env';
import { pass, fail, assert, assertThrows, assertRejects, assertResolves } from "../../../assertions.js";

addEventListener("fetch", event => {
  event.respondWith(app(event));
});
/**
 * @param {FetchEvent} event
 * @returns {Response}
 */
async function app(event) {
  try {
    const path = (new URL(event.request.url)).pathname;
    console.log(`path: ${path}`)
    console.log(`FASTLY_SERVICE_VERSION: ${env('FASTLY_SERVICE_VERSION')}`)
    if (routes.has(path)) {
      const routeHandler = routes.get(path);
      return await routeHandler();
    }
    return fail(`${path} endpoint does not exist`)
  } catch (error) {
    return fail(`The routeHandler threw an error: ${error.message}` + '\n' + error.stack)
  }
}
const publicJsonWebKeyData = {
  "alg": "RS256",
  "e": "AQAB",
  "ext": true,
  "key_ops": [
    "verify"
  ],
  "kty": "RSA",
  "n": "-PkS7Axd_lf93wJQBVNz0VKcNGF1d0yIoBjo8JTND2tW13orEBh__4ufS6m5orc30hfmiE5nH7R6b8Scbznlikm4qijLE3DhU2ykIcbcIB0JWSovXbu4CqzIIPbEjJO7QeDwhGPbwBH1L4NbMXvPLgtF0UQG9WBhCithfwG9qRG6aneBXRsiGxLQh45fyfdWhlrL1RkHBvnmPtgKxui4-Xz-O_lVSXtlx_tmx46ORmuEFbSXs6bBVJvOUTNgvIVkrd6WIEqbwY6DMYkntLYgsx_gvuCeOjOFqcCkD9DgaQ489Ptpk9B2AEynJ9r0sRrzS3c9S-p56uHJry4H_gC4Qw"
};

const privateJsonWebKeyData = {
  "alg": "RS256",
  "d": "lFle2UeY4Wp5AgX8Rc2u-eNmuaf2GwvhvzR6-kFg2oBpoL_b1TGI67uUzKgZ4MbU3m4kPbE-rWp5__eJPr0FpjkzbM31bgKFyi-i_0IvwAZ5d875zKUNtZ1loe_dyvlPc0BZmZyrjsaG7z7LyOty6ejhToD_Lkncw4E9IIP8uZhHTgml0NCWI-txbPv0w9LnuNs8Jgu5op3rdQ2PCeUJxXXtateSZ7eCnAkO1aiYNABX47rDaCvT1bAd50B7ZVjQTyg3o3G2A6XyyEoAKZnKgg9ggXmiiNxYo_2D33A_6jaR71HqQQVbRqAAKhm3t9NBeBoi8wdbEvmMAfCxLLgp",
  "dp": "8EhrMIt2BOI_5oeA_4nplGk5VRgYnR-Zd0KzlmFMOltYix0LlZub6ctyPV8Aw8Wnbn_rzw90t_P9tVQS81snKoS2L-AK_y2Yc2rwNLjwsslj-kFdtYFC-fm89bzGDYza7enMCHfB9czEV0RpJMm5m4b9kaVJJjfsZfeloIz82AU",
  "dq": "tZ6GeJ45wAlQonf6Qp2OceUWVA6SToYjFgsfdrtSzcJyn4XMTaNATMtLA9uIUcJJYESy6gWK_Y8OvZ8QlWO7JqTROQh6Y1hf1XQnZ1UfAOuoNdi-qJNT0cKTV-jGDhlDAr_pnIh9mYQSI17QNxWFrx5ZkS_ROIa9hO5v8Z_WQbU",
  "e": "AQAB",
  "ext": true,
  "key_ops": [
    "sign"
  ],
  "kty": "RSA",
  "n": "-PkS7Axd_lf93wJQBVNz0VKcNGF1d0yIoBjo8JTND2tW13orEBh__4ufS6m5orc30hfmiE5nH7R6b8Scbznlikm4qijLE3DhU2ykIcbcIB0JWSovXbu4CqzIIPbEjJO7QeDwhGPbwBH1L4NbMXvPLgtF0UQG9WBhCithfwG9qRG6aneBXRsiGxLQh45fyfdWhlrL1RkHBvnmPtgKxui4-Xz-O_lVSXtlx_tmx46ORmuEFbSXs6bBVJvOUTNgvIVkrd6WIEqbwY6DMYkntLYgsx_gvuCeOjOFqcCkD9DgaQ489Ptpk9B2AEynJ9r0sRrzS3c9S-p56uHJry4H_gC4Qw",
  "p": "_l0tnkgvRh66H8epUwYx4x-vrD7LYKrKV6PZQBO6GUv6WnUxENBqWBVSGxcNwrxu66xdXcsgr38j_CdI3L2MBG6svf4JCT6REmLioIErfvoYFvJ1F9fGlcjbsABQOwc3vX54y7G5a5YAWxMX7TBadvPq6eKHPZaoHcGh-hTBdfU",
  "q": "-pME5kwLVGE5wsKIv_xMRAKAdtk4j4dgMvN5BSgHYNn8fzBBHuDDep_uJW_I4sAceA_iEm8GIMyZVqh1S0SWIrpnDWgmQ0BKDt_PK7Ak2hW2x23IHB76wblXlrHbERoOvrr8vIx6EQR4oUBbLLq1jnAfIDPsFUxP3esNI6oz2lc",
  "qi": "GXR5pIAjCNwNmE2DnhLnwN1EnqAgBqw0M6wlu3kovgX4VDBT_lL737v_G-GCYOm6i9zO0-qyuP23lD_B170DKzdZTRPCCePxzZZlcIjcsZyFufFCCcp_hewTtIqPQsWkD7AOFQllLCtCyRAxJC5D34QfJfUglnYo2XhOFuldLV4"
}

const jsonWebKeyAlgorithm = {
  name: "RSASSA-PKCS1-v1_5",
  hash: { name: "SHA-256" },
};



const routes = new Map();
routes.set('/', () => {
  routes.delete('/');
  let test_routes = Array.from(routes.keys())
  return new Response(JSON.stringify(test_routes), { 'headers': { 'content-type': 'application/json' } });
});

let error;
routes.set("/crypto", async () => {
  error = assert(typeof crypto, 'object', `typeof crypto`)
  if (error) { return error; }
  error = assert(crypto instanceof Crypto, true, `crypto instanceof Crypto`)
  if (error) { return error; }
  return pass();
});

routes.set("/crypto.subtle", async () => {
  error = assert(typeof crypto.subtle, 'object', `typeof crypto.subtle`)
  if (error) { return error; }
  error = assert(crypto.subtle instanceof SubtleCrypto, true, `crypto.subtle instanceof SubtleCrypto`)
  if (error) { return error; }
  return pass();
});

// importKey
{
  routes.set("/crypto.subtle.importKey", async () => {
    error = assert(typeof crypto.subtle.importKey, 'function', `typeof crypto.subtle.importKey`)
    if (error) { return error; }
    error = assert(crypto.subtle.importKey, SubtleCrypto.prototype.importKey, `crypto.subtle.importKey === SubtleCrypto.prototype.importKey`)
    if (error) { return error; }
    return pass();
  });
  routes.set("/crypto.subtle.importKey/length", async () => {
    error = assert(crypto.subtle.importKey.length, 5, `crypto.subtle.importKey.length === 5`)
    if (error) { return error; }
    return pass();
  });
  routes.set("/crypto.subtle.importKey/called-as-constructor", async () => {
    error = assertThrows(() => {
      new crypto.subtle.importKey
    }, TypeError, "crypto.subtle.importKey is not a constructor")
    if (error) { return error; }
    return pass();
  });
  routes.set("/crypto.subtle.importKey/called-with-wrong-this", async () => {
    error = await assertRejects(async () => {
      await crypto.subtle.importKey.call(undefined, 'jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
    }, TypeError, "Method SubtleCrypto.importKey called on receiver that's not an instance of SubtleCrypto")
    if (error) { return error; }
    return pass();
  });
  routes.set("/crypto.subtle.importKey/called-with-no-arguments", async () => {
    error = await assertRejects(async () => {
      await crypto.subtle.importKey()
    }, TypeError, "SubtleCrypto.importKey: At least 5 arguments required, but only 0 passed")
    if (error) { return error; }
    return pass();
  });

  // first-parameter
  {
    routes.set("/crypto.subtle.importKey/first-parameter-calls-7.1.17-ToString", async () => {
      const sentinel = Symbol("sentinel");
      const test = async () => {
        const format = {
          toString() {
            throw sentinel;
          }
        }
        await crypto.subtle.importKey(format, publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }
      let error = await assertRejects(test)
      if (error) { return error; }
      try {
        await test()
      } catch (thrownError) {
        let error = assert(thrownError, sentinel, 'thrownError === sentinel')
        if (error) { return error; }
      }
      return pass();
    });
    routes.set("/crypto.subtle.importKey/first-parameter-non-existant-format", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.importKey('jake', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }, Error, "Provided format parameter is not supported. Supported formats are: 'spki', 'pkcs8', 'jwk', and 'raw'")
      if (error) { return error; }
      return pass();
    });
  }

  // second-parameter
  {
    routes.set("/crypto.subtle.importKey/second-parameter-invalid-format", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.importKey('jwk', Symbol(), jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }, Error, "The provided value is not of type JsonWebKey")
      if (error) { return error; }
      return pass();
    });
    // jwk public key
    {
      routes.set("/crypto.subtle.importKey/second-parameter-missing-e-field", async () => {
        let error = await assertRejects(async () => {
          delete publicJsonWebKeyData.e;
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }, Error, "Data provided to an operation does not meet requirements")
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-e-field-calls-7.1.17-ToString", async () => {
        let sentinel = Symbol("sentinel");
        const test = async () => {
          sentinel = Symbol();
          publicJsonWebKeyData.e = {
            toString() {
              throw sentinel;
            }
          }
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }
        let error = await assertRejects(test)
        if (error) { return error; }
        try {
          await test()
        } catch (thrownError) {
          let error = assert(thrownError, sentinel, 'thrownError === sentinel')
          if (error) { return error; }
        }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-invalid-e-field", async () => {
        let error = await assertRejects(async () => {
          publicJsonWebKeyData.e = "`~!@#@#$Q%^%&^*";
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }, Error, "The JWK member 'e' could not be base64url decoded or contained padding")
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-missing-kty-field", async () => {
        let error = await assertRejects(async () => {
          delete publicJsonWebKeyData.kty;
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }, Error, "The required JWK member 'kty' was missing")
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-invalid-kty-field", async () => {
        let error = await assertRejects(async () => {
          publicJsonWebKeyData.kty = "jake";
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }, Error, "The JWK 'kty' member was not 'RSA'")
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-missing-key_ops-field", async () => {
        let error = await assertResolves(async () => {
          const key_ops = Array.from(publicJsonWebKeyData.key_ops);
          delete publicJsonWebKeyData.key_ops;
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, key_ops)
        })
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-non-sequence-key_ops-field", async () => {
        let error = await assertRejects(async () => {
          const key_ops = Array.from(publicJsonWebKeyData.key_ops);
          publicJsonWebKeyData.key_ops = "jake";
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, key_ops)
        }, Error, "Failed to read the 'key_ops' property from 'JsonWebKey': The provided value cannot be converted to a sequence")
        if (error) { return error; }
        return pass();
      });

      routes.set("/crypto.subtle.importKey/second-parameter-empty-key_ops-field", async () => {
        let error = await assertResolves(async () => {
          const key_ops = Array.from(publicJsonWebKeyData.key_ops);
          publicJsonWebKeyData.key_ops = [];
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, key_ops)
        })
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-duplicated-key_ops-field", async () => {
        let error = await assertRejects(async () => {
          const key_ops = Array.from(publicJsonWebKeyData.key_ops);
          publicJsonWebKeyData.key_ops = ["sign", "sign"];
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, key_ops)
        }, Error, "The 'key_ops' member of the JWK dictionary contains duplicate usages")
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-invalid-key_ops-field", async () => {
        let error = await assertRejects(async () => {
          const key_ops = Array.from(publicJsonWebKeyData.key_ops);
          publicJsonWebKeyData.key_ops = ["sign", "jake"];
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, key_ops)
        }, TypeError, "Invalid keyUsages argument")
        if (error) { return error; }
        return pass();
      });

      routes.set("/crypto.subtle.importKey/second-parameter-key_ops-field-calls-7.1.17-ToString", async () => {
        let sentinel = Symbol("sentinel");
        const key_ops = Array.from(publicJsonWebKeyData.key_ops);
        const test = async () => {
          sentinel = Symbol();
          const op = {
            toString() {
              throw sentinel;
            }
          }
          publicJsonWebKeyData.key_ops = ["sign", op];
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, key_ops)
        }
        let error = await assertRejects(test)
        if (error) { return error; }
        try {
          await test()
        } catch (thrownError) {
          let error = assert(thrownError, sentinel, 'thrownError === sentinel')
          if (error) { return error; }
        }
        return pass();
      });

      routes.set("/crypto.subtle.importKey/second-parameter-missing-n-field", async () => {
        let error = await assertRejects(async () => {
          delete publicJsonWebKeyData.n;
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }, Error, "Data provided to an operation does not meet requirements")
        if (error) { return error; }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-n-field-calls-7.1.17-ToString", async () => {
        let sentinel = Symbol("sentinel");
        const test = async () => {
          sentinel = Symbol();
          publicJsonWebKeyData.n = {
            toString() {
              throw sentinel;
            }
          }
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }
        let error = await assertRejects(test)
        if (error) { return error; }
        try {
          await test()
        } catch (thrownError) {
          let error = assert(thrownError, sentinel, 'thrownError === sentinel')
          if (error) { return error; }
        }
        return pass();
      });
      routes.set("/crypto.subtle.importKey/second-parameter-invalid-n-field", async () => {
        let error = await assertRejects(async () => {
          publicJsonWebKeyData.n = "`~!@#@#$Q%^%&^*";
          await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
        }, Error, "The JWK member 'n' could not be base64url decoded or contained padding")
        if (error) { return error; }
        return pass();
      });
    }
    // jwk private key
    // raw AES 
    // raw HMAC secret keys
    // raw Elliptic Curve public keys
    // pkcs8 RSA private keys
    // pkcs8 Elliptic Curve private keys
  }
  // third-parameter 
  {
    routes.set("/crypto.subtle.importKey/third-parameter-undefined", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, undefined, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }, Error, "Algorithm: Unrecognized name")
      if (error) { return error; }
      return pass();
    });
    routes.set("/crypto.subtle.importKey/third-parameter-name-field-calls-7.1.17-ToString", async () => {
      const sentinel = Symbol("sentinel");
      const test = async () => {
        jsonWebKeyAlgorithm.name = {
          toString() {
            throw sentinel;
          }
        }
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }
      let error = await assertRejects(test)
      if (error) { return error; }
      try {
        await test()
      } catch (thrownError) {
        let error = assert(thrownError, sentinel, 'thrownError === sentinel')
        if (error) { return error; }
      }
      return pass();
    });
    routes.set("/crypto.subtle.importKey/third-parameter-invalid-name-field", async () => {
      let error = await assertRejects(async () => {
        jsonWebKeyAlgorithm.name = "`~!@#@#$Q%^%&^*";
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }, Error, "Algorithm: Unrecognized name")
      if (error) { return error; }
      return pass();
    });
    routes.set("/crypto.subtle.importKey/third-parameter-hash-name-field-calls-7.1.17-ToString", async () => {
      const sentinel = Symbol("sentinel");
      const test = async () => {
        jsonWebKeyAlgorithm.hash.name = {
          toString() {
            throw sentinel;
          }
        }
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }
      let error = await assertRejects(test)
      if (error) { return error; }
      try {
        await test()
      } catch (thrownError) {
        let error = assert(thrownError, sentinel, 'thrownError === sentinel')
        if (error) { return error; }
      }
      return pass();
    });
    routes.set("/crypto.subtle.importKey/third-parameter-hash-algorithm-does-not-match-json-web-key-hash-algorithm", async () => {
      let error = await assertRejects(async () => {
        jsonWebKeyAlgorithm.hash.name = "SHA-1";
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops)
      }, Error, "The JWK 'alg' member was inconsistent with that specified by the Web Crypto call")
      if (error) { return error; }
      return pass();
    });
  }

  // fifth-parameter
  {
    routes.set("/crypto.subtle.importKey/fifth-parameter-undefined", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, undefined)
      }, Error, "The provided value cannot be converted to a sequence")
      if (error) { return error; }
      return pass();
    });
    routes.set("/crypto.subtle.importKey/fifth-parameter-invalid", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, ["jake"])
      }, Error, "SubtleCrypto.importKey: Invalid keyUsages argument")
      if (error) { return error; }
      return pass();
    });
    routes.set("/crypto.subtle.importKey/fifth-parameter-duplicate-operations", async () => {
      let error = await assertResolves(async () => {
        const key_ops = publicJsonWebKeyData.key_ops.concat(publicJsonWebKeyData.key_ops);
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, key_ops)
      })
      if (error) { return error; }
      return pass();
    });

    routes.set("/crypto.subtle.importKey/fifth-parameter-operations-do-not-match-json-web-key-operations", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, ["sign"])
      }, Error, "The JWK 'key_ops' member was inconsistent with that specified by the Web Crypto call. The JWK usage must be a superset of those requested")
      if (error) { return error; }
      return pass();
    });

    routes.set("/crypto.subtle.importKey/fifth-parameter-operation-fields-calls-7.1.17-ToString", async () => {
      let sentinel = Symbol("sentinel");
      const test = async () => {
        sentinel = Symbol();
        const op = {
          toString() {
            throw sentinel;
          }
        }
        await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, ["sign", op])
      }
      let error = await assertRejects(test)
      if (error) { return error; }
      try {
        await test()
      } catch (thrownError) {
        let error = assert(thrownError, sentinel, 'thrownError === sentinel')
        if (error) { return error; }
      }
      return pass();
    });
  }

  // happy paths
  {
    routes.set("/crypto.subtle.importKey/JWK-RS256-Public", async () => {
      const key = await crypto.subtle.importKey('jwk', publicJsonWebKeyData, jsonWebKeyAlgorithm, publicJsonWebKeyData.ext, publicJsonWebKeyData.key_ops);
      console.log({key})
      error = await assert(key instanceof CryptoKey, true, `key instanceof CryptoKey`);
      if (error) { return error; }
      error = await assert(key.algorithm, {
        "name": "RSASSA-PKCS1-v1_5", 
        "hash": {
          "name": "SHA-256"
        },
        "modulusLength":2048,
        "publicExponent": new Uint8Array([1,0,1])
      }, `key.algorithm deep equals "carrot"`);
      if (error) { return error; }
      error = await assert(key.extractable, true, `key.extractable === true`);
      if (error) { return error; }
      error = await assert(key.type, "public", `key.type === "public"`);
      if (error) { return error; }
      error = await assert(key.usages, ["verify"], `key.usages deep equals ["verify"]`);
      if (error) { return error; }
      return pass();
    });
  }
}

// digest
{
  const enc = new TextEncoder();
  const data = enc.encode('hello world');
  routes.set("/crypto.subtle.digest", async () => {
    error = assert(typeof crypto.subtle.digest, 'function', `typeof crypto.subtle.digest`)
    if (error) { return error; }
    error = assert(crypto.subtle.digest, SubtleCrypto.prototype.digest, `crypto.subtle.digest === SubtleCrypto.prototype.digest`)
    if (error) { return error; }
    return pass()
  });
  routes.set("/crypto.subtle.digest/length", async () => {
    error = assert(crypto.subtle.digest.length, 2, `crypto.subtle.digest.length === 2`)
    if (error) { return error; }
    return pass()
  });
  routes.set("/crypto.subtle.digest/called-as-constructor", async () => {
    error = assertThrows(() => {
      new crypto.subtle.digest
    }, TypeError, "crypto.subtle.digest is not a constructor")
    if (error) { return error; }
    return pass()
  });
  routes.set("/crypto.subtle.digest/called-with-wrong-this", async () => {
    error = await assertRejects(async () => {
      await crypto.subtle.digest.call(undefined)
    }, TypeError, "Method SubtleCrypto.digest called on receiver that's not an instance of SubtleCrypto")
    if (error) { return error; }
    return pass()
  });
  routes.set("/crypto.subtle.digest/called-with-no-arguments", async () => {
    error = await assertRejects(async () => {
      await crypto.subtle.digest()
    }, TypeError, "SubtleCrypto.digest: At least 2 arguments required, but only 0 passed")
    if (error) { return error; }
    return pass()
  });

  // first-parameter
  {
    routes.set("/crypto.subtle.digest/first-parameter-calls-7.1.17-ToString", async () => {
      const sentinel = Symbol("sentinel");
      const test = async () => {
        await crypto.subtle.digest({
          name: {
            toString() {
              throw sentinel;
            }
          }
        }, data);
      }
      let error = await assertRejects(test);
      if (error) { return error; }
      try {
        await test();
      } catch (thrownError) {
        let error = assert(thrownError, sentinel, 'thrownError === sentinel');
        if (error) { return error; }
      }
      return pass();
    });
    routes.set("/crypto.subtle.digest/first-parameter-non-existant-format", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.digest('jake', data);
      }, Error, "Algorithm: Unrecognized name");
      if (error) { return error; }
      return pass();
    });
  }
  // second-parameter
  {
    routes.set("/crypto.subtle.digest/second-parameter-undefined", async () => {
      let error = await assertRejects(async () => {
        await crypto.subtle.digest("sha-1", undefined);
      }, Error, "SubtleCrypto.digest: data must be of type ArrayBuffer or ArrayBufferView but got \"\"");
      if (error) { return error; }
      return pass();
    });
  }
  // happy paths 
  {
    // "SHA-1"
    routes.set("/crypto.subtle.digest/sha-1", async () => {
      const result = new Uint8Array(await crypto.subtle.digest("sha-1", new Uint8Array));
      const expected = new Uint8Array([218, 57, 163, 238, 94, 107, 75, 13, 50, 85, 191, 239, 149, 96, 24, 144, 175, 216, 7, 9]);
      error = assert(result, expected, "result deep equals expected");
      if (error) { return error; }
      return pass();
    });
    // "SHA-256"
    routes.set("/crypto.subtle.digest/sha-256", async () => {
      const result = new Uint8Array(await crypto.subtle.digest("sha-256", new Uint8Array));
      const expected = new Uint8Array([227, 176, 196, 66, 152, 252, 28, 20, 154, 251, 244, 200, 153, 111, 185, 36, 39, 174, 65, 228, 100, 155, 147, 76, 164, 149, 153, 27, 120, 82, 184, 85]);
      error = assert(result, expected, "result deep equals expected");
      if (error) { return error; }
      return pass();
    });
    // "SHA-384"
    routes.set("/crypto.subtle.digest/sha-384", async () => {
      const result = new Uint8Array(await crypto.subtle.digest("sha-384", new Uint8Array));
      const expected = new Uint8Array([56, 176, 96, 167, 81, 172, 150, 56, 76, 217, 50, 126, 177, 177, 227, 106, 33, 253, 183, 17, 20, 190, 7, 67, 76, 12, 199, 191, 99, 246, 225, 218, 39, 78, 222, 191, 231, 111, 101, 251, 213, 26, 210, 241, 72, 152, 185, 91]);
      error = assert(result, expected, "result deep equals expected");
      if (error) { return error; }
      return pass();
    });
    // "SHA-512"
    routes.set("/crypto.subtle.digest/sha-512", async () => {
      const result = new Uint8Array(await crypto.subtle.digest("sha-512", new Uint8Array));
      const expected = new Uint8Array([207, 131, 225, 53, 126, 239, 184, 189, 241, 84, 40, 80, 214, 109, 128, 7, 214, 32, 228, 5, 11, 87, 21, 220, 131, 244, 169, 33, 211, 108, 233, 206, 71, 208, 209, 60, 93, 133, 242, 176, 255, 131, 24, 210, 135, 126, 236, 47, 99, 185, 49, 189, 71, 65, 122, 129, 165, 56, 50, 122, 249, 39, 218, 62]);
      error = assert(result, expected, "result deep equals expected");
      if (error) { return error; }
      return pass();
    });
  }

}
