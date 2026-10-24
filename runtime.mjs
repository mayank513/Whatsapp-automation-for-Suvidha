export function validateRuntime(env=process.env){
 if(Number(process.versions.node.split('.')[0])<24)throw Error('Node.js 24 or newer is required');
 const port=Number(env.PORT||3080);if(!Number.isInteger(port)||port<1||port>65535)throw Error('PORT must be between 1 and 65535');
 if(env.NODE_ENV!=='production')return;
 let origin;try{origin=new URL(env.PUBLIC_ORIGIN)}catch{throw Error('Production requires PUBLIC_ORIGIN as an HTTPS origin')}
 if(origin.protocol!=='https:'||origin.origin!==env.PUBLIC_ORIGIN||origin.username||origin.password)throw Error('Production PUBLIC_ORIGIN must be an HTTPS origin without a path or trailing slash');
 if(env.SECURE_COOKIES!=='true')throw Error('Production requires SECURE_COOKIES=true');
 if(!/^[a-f0-9]{64}$/i.test(env.TOKEN_ENCRYPTION_KEY||''))throw Error('Production requires a 64-hex TOKEN_ENCRYPTION_KEY');
 if(!env.DATA_DIR)throw Error('Production requires a persistent DATA_DIR');
}
