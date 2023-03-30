const request = require("supertest");
const app = require("../server");
const mongoose = require("mongoose");
const User = require("../db/model/UserModel");
const db = require("../db/db");

// beforeEach(() => {
//   db();
// });

afterAll(() => {
  // User.deleteMany().then(() => {
  //   User.insertMany({
  //     googleId: "1",
  //     displayName: "Test 1",
  //     email: "tes1@gmail.com",
  //     photo: "www.111.com",
  //   }).then(() => {
  mongoose.disconnect();
  //   });
  // });
});

describe("GET /api/users", () => {
  test("200 - GET: returns array of users with the correct properties", () => {
    return request(app)
      .get("/api/users")
      .expect(200)
      .then((response) => {
        expect(response.body[0]).toHaveProperty("googleId", expect.any(String));
        expect(response.body[0]).toHaveProperty(
          "displayName",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("photo", expect.any(String));
      });
  });
  test("404 -GET: returns Not found status when given an invalid endpoint ", () => {
    return request(app)
      .get("/api/userz")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe.skip("POST /api/users", () => {
  const validInput = {
    googleId: "11211",
    displayName: "Test 11121",
    email: "test11211@gmail.com",
    photo: "www.1111.com",
  };

  test("201 status code received when calling api correctly", () => {
    return request(app)
      .post("/api/users")
      .send(validInput)
      .expect(201)
      .then((response) => {
        expect(response.body.message).toHaveProperty(
          "googleId",
          expect.any(String)
        );
        expect(response.body.message).toHaveProperty(
          "displayName",
          expect.any(String)
        );
        expect(response.body.message).toHaveProperty(
          "email",
          expect.any(String)
        );
        expect(response.body.message).toHaveProperty(
          "photo",
          expect.any(String)
        );
        expect(response.body.message).toHaveProperty("_id", expect.any(String));
        expect(response.body.message).toHaveProperty("__v", expect.any(Number));
      });
  });
});

describe("POST /api/create_link_token", () => {
  test("return 200 and we get a link token", () => {
    return request(app)
      .post("/api/create_link_token")
      .send("")
      .expect(200)
      .then((response) => {
        expect(response.body).toHaveProperty("expiration", expect.any(String));
        expect(response.body).toHaveProperty("link_token", expect.any(String));
        expect(response.body).toHaveProperty("request_id", expect.any(String));
      });
  });
});

let access_token = "";

describe.skip("POST /api/exchange_public_token", () => {
  // const public_token = "public-sandbox-d514a8eb-a4f8-4bbc-9d4e-5d1facbc0699";
  // const public_token = "public-sandbox-d68eb183-a7dc-4b64-81ab-6c0347234c9d"; //MIke's
  // const public_token = "0679e97f-38fb-48a7-9848-4e08ce4831cf"; // mike new 2nd one
  // const public_token = "public-sandbox-da79485a-e97f-4e10-a892-f2c2a2ddda5a"; //mike 3rd one
  // NOTE - TO TEST YOU NEED TO GET A NEW PUBLIC TOKEN THAT EXPIRES IN 30 MINUTES
  const public_token = "public-sandbox-1f92a528-0a3b-4b28-a5a6-b264fe25805e";
  const sendObj = { token: public_token, googleId: "103483413108620628802" };
  test("return 200 and we get a access token", () => {
    return (
      request(app)
        .post("/api/exchange_public_token")
        // .send(public_token)
        .send(sendObj)
        .expect(200)
        .then((response) => {
          console.log(response.body);
          expect(response.body).toHaveProperty(
            "access_token",
            expect.any(String)
          );
          expect(response.body).toEqual({
            message: "access token added to User DB",
          });
        })
    );
  });
});

describe.only("POST /api/plaid/accounts", () => {
  // const public_token = "public-sandbox-59490658-86c3-46f7-861f-b6a0e54f405c";
  // const sendObj = {token: public_token};
  const sendObj = {
    googleId: "103483413108620628802",
  };
  // console.log(sendObj);
  test("return 200 and we get an array of accounts", () => {
    return request(app)
      .post("/api/plaid/accounts")
      .send(sendObj)
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });
});

describe("post /api/plaid/transactions", () => {
  const obj = {
    googleId: "103483413108620628802",
  };
  it("return 200 and get array transactions ", () => {
    return request(app)
      .post("/api/plaid/transactions")
      .send(obj)
      .expect(200)
      .then((response) => {
        console.log(response.body);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });
});

describe("GET /api/users/:googleId", () => {
  test("200 - GET: returns array of users with the correct properties", () => {
    return request(app)
      .get("/api/users/103483413108620628802")
      .expect(200)
      .then((response) => {
        expect(response.body[0]).toHaveProperty(
          "googleId",
          "103483413108620628802"
        );
        expect(response.body[0]).toHaveProperty(
          "displayName",
          expect.any(String)
        );
        expect(response.body[0]).toHaveProperty("email", expect.any(String));
        expect(response.body[0]).toHaveProperty("photo", expect.any(String));
      });
  });
  test("404 -GET: returns Not found status when given an invalid endpoint ", () => {
    return request(app)
      .get("/api/userz/103483413108620628802")
      .expect(404)
      .then((body) => {
        expect(body.res.statusMessage).toBe("Not Found");
      });
  });
});

describe.only("Delete /api/users/:googleId", () => {
  test("204 - Delete: returns array of users with the correct properties", () => {
    return request(app)
      .delete("/api/users/112481449490803492799")
      .expect(204)
      .then((response) => {
        expect(response.body).toEqual({
          message: "User is Deleted",
        });
      });
  });
});
