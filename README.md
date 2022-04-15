# Next JS + JWT Auth - The best strategy for storing access token inside browser memory

source : https://jakeowen-ex.medium.com/secure-api-authentication-with-nextjs-access-tokens-refresh-tokens-dff873a7ed94

## Main concept

when we log in, the API send back user with the accessToken and sets refreshToken (http-only) and accessTokenLife cookie.

- 🔑 **accessToken** : Use for user authorization. Short lives. Store it on browser memory
- 🔃 **refreshToken** : Use for creating new accessToken when its expired. Long lives. Store it on http-only cookie that only accessible on server. Returns `{ accessToken, accessTokenLife }`
- 🔑⌚ **accessTokenLife** : Use for checking if accessToken is expired or not, lives same as accessToken. Store it on public cookie so we can access it on client side before fetching

To use that tokens, we can use `document.cookie` on client-side, or `req.cookies` on server-side

- **On every request that needs user authorization**, check if `cookie.accessTokenLife` is not expired yet => then continue fetching

  otherwise (if `cookie.accessTokenLife` expired) => refresh the token, use our new accessToken and accessTokenLife, then continue fetching

- **On first render**
  ```ts
  useEffect(() => {
    refreshToken() // attach new accessTokenLife cookie
    // then
    // store user and accessToken into variable
  }, [])
  ```
