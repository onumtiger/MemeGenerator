import apis from './index.js'

describe("user controller test", () => {
    let userId
    let token
    it('should successfully sign up', async () => {
        const cred = {
            signupEmail: "doeTest@test.de",
            signupUsername: "doetest",
            signupPassword: "doe"
        }
        expect(await apis.signup(cred).then((res) =>{
            userId = res.data.id
            return res.status
        })).toBe(201);
      });

    it('should indicate unsuccessful sign up', async () => {
        const cred = {
            signupEmail: "doeTest@test.de",
            signupUsername: "doetest",
            signupPassword: "doe"
        }

        expect(await apis.signup(cred).then((res) =>{
            return res.status
        })).toBe(409);
      });

    it('should successfully login with username', async () => {
        const cred = {
            loginCred: "doetest",
            loginPassword: "doe"
        }
        expect(await apis.login(cred).then((res) =>{
            token = res.data.token
            return res.status
        })).toBe(200);
      });

      it('should indicate unsuccessfully login with username', async () => {
        const cred = {
            loginCred: "doetest1",
            loginPassword: "doe"
        }
        expect(await apis.login(cred).then((res) =>{
            return res.status
        })).toBe(401);
      });

      it('should indicate unsuccessfully login with email', async () => {
        const cred = {
            loginCred: "doetest1@test.de",
            loginPassword: "doe"
        }
        expect(await apis.login(cred).then((res) =>{
            return res.status
        })).toBe(401);
      });

    it('should successfully login with email', async () => {
        const cred = {
            loginCred: "doeTest@test.de",
            loginPassword: "doe"
        }
        expect(await apis.login(cred).then((res) =>{ return res.status})).toBe(200);
    });

    it('should successfully delete user', async () => {
        console.log(userId)
        console.log(token)
        const config = {
            headers: {
                Authorization: `Bearer ${token}`,
            }
          }
        expect(await apis.deleteUser(userId, config).then((res) =>{
           return res.status
        })).toBe(200);
      });
})
