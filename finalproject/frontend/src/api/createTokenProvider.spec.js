import apis from './index.js'
import createTokenProvider from './createTokenProvider.js'

describe("create token test", () => {
    it('should successfully sign up and store token', async () => {
        let userId
        let token

        const cred = {
            signupEmail: "doeTest@test.de",
            signupUsername: "doetest",
            signupPassword: "doe"
        }
        expect(await apis.signup(cred).then((res) =>{
            createTokenProvider.setToken(res.data.token)
            userId = res.data.id
            token = res.data.token
            return res.data.token
        })).toBe(JSON.parse(localStorage.getItem('REACT_TOKEN_AUTH')))

        // delte created user
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          }
        await apis.deleteUser(userId, config)
    });

    it('should return true is token is available', async () => {
        let userId
        let token

        const cred = {
            signupEmail: "doeTest@test.de",
            signupUsername: "doetest",
            signupPassword: "doe"
        }
        await apis.signup(cred).then((res) =>{
            createTokenProvider.setToken(res.data.token)
            userId = res.data.id
            token = res.data.token
        })

        expect(await createTokenProvider.isLoggedIn()).toBe(true)

        // delte created user
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          }
        await apis.deleteUser(userId, config)
    })

    it('should return token if token is available', async () => {
        let userId
        let token

        const cred = {
            signupEmail: "doeTest@test.de",
            signupUsername: "doetest",
            signupPassword: "doe"
        }
        await apis.signup(cred).then((res) =>{
            createTokenProvider.setToken(res.data.token)
            userId = res.data.id
            token = res.data.token
        })

        expect(await createTokenProvider.getToken()).toBe(token)

        // delte created user
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          }
        await apis.deleteUser(userId, config)
    })

    it('should return userid if token is available', async () => {
        let userId
        let token

        const cred = {
            signupEmail: "doeTest@test.de",
            signupUsername: "doetest",
            signupPassword: "doe"
        }
        await apis.signup(cred).then((res) =>{
            createTokenProvider.setToken(res.data.token)
            userId = res.data.id
            token = res.data.token
        })

        expect(createTokenProvider.userIdFromToken()).toBe(userId)

        // delte created user
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          }
        await apis.deleteUser(userId, config)
    })

    it('should set token to null', () => {
        createTokenProvider.setToken(null);
        expect(localStorage.getItem('REACT_TOKEN_AUTH')).toBe(null)
    })

    it('should return -1 no if token is available', async () => {
        expect(createTokenProvider.userIdFromToken()).toBe(-1)
    })

    it('should return false is no token is available', async () => {
        expect(await createTokenProvider.isLoggedIn()).toBe(false)
    })

    it('should return null if no token is available', async () => {
        expect(await createTokenProvider.getToken()).toBe(null)
    })
}) 
