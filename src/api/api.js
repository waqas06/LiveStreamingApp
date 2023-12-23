const API_BASE_URL = 'https://api.videosdk.live/v2';
const SHOPIFY_API_BASE_URL = 'https://c29141-2.myshopify.com/admin';
let ACCESS_TOKEN = "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";

export const getToken = async () => {
  return 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiJkM2NhM2Y3Zi1iNGU1LTQ0NzUtYjJhZC00MDVlMjI3YTk4YzciLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMjk4MjczNiwiZXhwIjoxNzA1NTc0NzM2fQ.9NaBFzKMijuH8ZqUYa27K8ie9_0I4yc0e1aTFCCRy2E';
};

export const createMeeting = async ({token}) => {
  const url = `${API_BASE_URL}/rooms`;
  const options = {
    method: 'POST',
    headers: {Authorization: token, 'Content-Type': 'application/json'},
  };

  const {roomId} = await fetch(url, options)
    .then(response => response.json())
    .catch(error => console.error('error', error));

  console.log('room', roomId);
 // const {roomId}="admin-123";
  console.log( roomId);

  return roomId;
};

export const adminLogin = (access_token) => {
  // API_URL = "https://"+site_url+"/wp-json/queenssize/v1/";
   console.log("+++++++++++++++++++++++++++++++++++++++++++++");
   console.log(access_token);
   console.log("+++++++++++++++++++++++++++++++++++++++++++++");
   var headers = new Headers();
   headers.append("Content-Type", "application/json");
   headers.append("Accept", "application/json");
   headers.append("X-Shopify-Access-Token", access_token);

   var requestOptions = {
       method: 'GET',
       headers: headers,
   }

   return new Promise((resolve, reject) => {
       console.log(SHOPIFY_API_BASE_URL+'/oauth/access_scopes.json');
       console.log(requestOptions);
      fetch(SHOPIFY_API_BASE_URL+'/oauth/access_scopes.json', requestOptions)
       .then(response => response.json()).catch(error => {
           console.log("error raised", error);
           reject(error);
       })
       .then(result => {
           console.log('User Authorization received : ', result);
           if(result.hasOwnProperty('access_scopes')){
                ACCESS_TOKEN = access_token;
                const data = {
                   result: result,
                    success: true,
                  }
                  resolve(data)
            }
            else{
              const data = {
                result: result,
                 success: false,
               }
               resolve(data)
            }
           
       }).catch(error => {
           console.log("error raised", error);
           reject(error);
       })
     
   })
}

export const addProduct = (formData) => {

  console.log("API function called addProduct");
  console.log("------------------");
  console.log(formData);
  console.log("------------------");
  
  var headers = new Headers();
  
  headers.append("Content-Type", "application/json");
  headers.append("X-Shopify-Access-Token", ACCESS_TOKEN);
  headers.append("Accept", "application/json");

  var requestOptions = {
      method: 'POST',
      headers: headers,
      body: formData, 
  }
  
  return new Promise((resolve, reject) => {
      fetch(SHOPIFY_API_BASE_URL+'/api/2023-10/products.json', requestOptions)
      .then(response => response.json())
      .then(result => {
          console.log('Product added : ', result);
          console.log(requestOptions);
          console.log(ACCESS_TOKEN);
          resolve(result)
      }).catch(error => {
          console.log("error raised", error);
          reject(error);
      })
  })

}

export const fetchProducts = () => {

  console.log("API function called fetchProducts");
  console.log("------------------");
  console.log(ACCESS_TOKEN);
  console.log("------------------");
  
  var headers = new Headers();
  
  headers.append("Content-Type", "application/json");
  headers.append("X-Shopify-Access-Token", ACCESS_TOKEN);
  headers.append("Accept", "application/json");

  var requestOptions = {
      method: 'GET',
      headers: headers,
  }
  
  return new Promise((resolve, reject) => {
      fetch(SHOPIFY_API_BASE_URL+'/api/2023-10/products.json', requestOptions)
      .then(response => response.json())
      .then(result => {
          console.log('Products Recieved : ', result);
        //  console.log(requestOptions);
          console.log(ACCESS_TOKEN);
          resolve(result)
      }).catch(error => {
          console.log("error raised", error);
          reject(error);
      })
  })

}

export const fetchProductDetails = (product_id) => {

  console.log("API function called fetchProduct");
  console.log("------------------");
  console.log(ACCESS_TOKEN);
  console.log(product_id);
  console.log("------------------");
  
  var headers = new Headers();
  
  headers.append("Content-Type", "application/json");
  headers.append("X-Shopify-Access-Token", ACCESS_TOKEN);
  headers.append("Accept", "application/json");

  var requestOptions = {
      method: 'GET',
      headers: headers,
  }
  
  return new Promise((resolve, reject) => {
      fetch(SHOPIFY_API_BASE_URL+'/api/2023-10/products/'+product_id+'.json', requestOptions)
      .then(response => response.json())
      .then(result => {
          console.log('Product Recieved : ', result);
          console.log(result);
          resolve(result)
      }).catch(error => {
          console.log("error raised", error);
          reject(error);
      })
  })

}
