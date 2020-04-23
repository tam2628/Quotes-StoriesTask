const fetch = require('isomorphic-fetch');

async function getUserAsPromise(access_token){
    let user;
    try {
        user = await fetch('https://www.googleapis.com/userinfo/v2/me', {
            headers: { 'Authorization': `Bearer ${access_token}`, },
        });
    }catch(err){
        console.log(err);
        throw new Error(err);
    }
    return user; 
}

module.exports = {getUserAsPromise};