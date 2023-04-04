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

// NOTE - need to change all 'validInput' to create a new user each time, otherwise .skip this test
describe.skip("POST /api/users", () => {
  const validInput = {
    googleId: "fred_id777",
    displayName: "fred777",
    email: "fred@gmail777.com",
    photo: "www.fred777.com",
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

describe.skip("POST /api/exchange_public_token", () => {
  // NOTE - TO TEST YOU NEED TO GET A NEW PUBLIC TOKEN EACH TIME - THE TOKEN EXPIRES IN 30 MINUTES
  // OTHERWISE '.skip' THIS TEST
  // const public_token = "public-sandbox-d514a8eb-a4f8-4bbc-9d4e-5d1facbc0699";
  // const public_token = "public-sandbox-d68eb183-a7dc-4b64-81ab-6c0347234c9d"; //MIke's
  // const public_token = "0679e97f-38fb-48a7-9848-4e08ce4831cf"; // mike new 2nd one
  // const public_token = "public-sandbox-da79485a-e97f-4e10-a892-f2c2a2ddda5a"; //mike 3rd one
  const public_token = "public-sandbox-f3f2becf-52e1-480d-add9-43e1ffb4d710";
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
          // WE DON'T DO THIS ANY LONGER
          // expect(response.body).toHaveProperty(
          //   "access_token",
          //   expect.any(String)
          // );
          expect(response.body).toEqual({
            message: "access token added to User DB",
          });
        })
    );
  });
});

describe("POST /api/plaid/accounts", () => {
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
        // console.log(response.body);
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body.length).toBeGreaterThan(0);
      });
  });
});

describe("post /api/plaid/transactions", () => {
  const obj = {
    googleId: "108971830262728991643",
  };
  it("return 200 and get array transactions ", () => {
    return request(app)
      .post("/api/plaid/transactions")
      .send(obj)
      .expect(200)
      .then((response) => {
        expect(Array.isArray(response.body)).toEqual(true);
        expect(response.body.length).toBeGreaterThan(0);
        // console.log(response.body);
      });
  });
});

describe("GET /api/users/:googleId", () => {
  test("200 - GET: returns array of users with the correct properties", () => {
    return request(app)
      .get("/api/users/103483413108620628802")
      .expect(200)
      .then((response) => {
        response.body[0];
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

//NOTE - need to change this test each time to delete a user in the curent mongoDB, or else '.skip' this test
describe.skip("Delete /api/users/:googleId", () => {
  test("204 - Delete: returns array of users with the correct properties", () => {
    return (
      request(app)
        // .delete("/api/users/112481449490803492799")
        .delete("/api/users/fred_id")
        .expect(204)
        .then((response) => {
          console.log(response.body);
          expect(response.body).toEqual({
            message: "User is Deleted",
          });
        })
    );
  });
});

describe.skip("", () => {
  const obj = {
    body: { credential: null },
  };
  test("", () => {
    return request(app)
      .post("/api/signup")
      .send(obj)
      .expect(201)
      .then((res) => {
        console.log("result is");
        console.log(res);
      });
  });
});

describe.skip("", () => {
  const obj = {
    body: { credential: null },
  };
  test("", () => {
    return request(app)
      .post("/api/login")
      .send(obj)
      .expect(201)
      .then((res) => {
        console.log("result is");
        console.log(res);
      });
  });
});

describe("POST /api/notes/:transaction_id", () => {
  test("A note is added to the DB for the given user and stored alongside the transaction_id supplied", () => {
    const obj = {
      googleId: "103483413108620628802",
      note: "Note One (again as expected): reminder AGAIN! - I need to make an expense claim for this.",
    };
    return request(app)
      .post("/api/notes/bE8D7y4yaGiMNkVxzWkBhEdmApoWyKSmP1Qk7")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test("A 2nd note for the same transaction_id will also be added", () => {
    const obj = {
      googleId: "12",
      note: "Note Two: DONT FORGET - I still need to make an expense claim for this!!!",
    };
    return request(app)
      .post("/api/notes/bE8D7y4yaGiMNkVxzWkBhEdmApoWyKSmP1Qk7")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test("A note to a different transaction_id will also be added", () => {
    const obj = {
      googleId: "103483413108620628802",
      note: "Note Three: I should send a thank you message to Fred for paying this so quickly.",
    };
    return request(app)
      .post("/api/notes/myrMEApAeGI5JxvQ7VxkSpzwnel84Ntgknzml")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test("Add multiple notes to test above further..., but with user who has no notes to start with", () => {
    const obj = {
      googleId: "105784672668267029665",
      note: "first one - should be added",
    };
    return request(app)
      .post("/api/notes/myrMEApAeGI5JxvQ7VxkSpzwnel84Ntgknzml")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });
  test(".....", () => {
    const obj = {
      googleId: "105784672668267029665",
      note: "second one - should be added",
    };
    return request(app)
      .post("/api/notes/bE8D7y4yaGiMNkVxzWkBhEdmApoWyKSmP1Qk7")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test(".....", () => {
    const obj = {
      googleId: "105784672668267029665",
      note: "Third one: should be added",
    };
    return request(app)
      .post("/api/notes/jEwLo7M7e9i3wxvV6dxDh6qNgDjz19u698q4L")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test(".....", () => {
    const obj = {
      googleId: "105784672668267029665",
      note: "Fourth one: should be added",
    };
    return request(app)
      .post("/api/notes/GZjn1dadGgSk41dowa1QU9RnjdGXxPh6wXyB9")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test(".....", () => {
    const obj = {
      googleId: "105784672668267029665",
      note: "Fifth one: should be added",
    };
    return request(app)
      .post("/api/notes/EeaVZ3x3zpCZ1oazvJoNHX74dNlj6rf4zPJRy")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test(".....", () => {
    const obj = {
      googleId: "105784672668267029665",
      note: "Sixth one: should be added",
    };
    return request(app)
      .post("/api/notes/ANqwjKrKlZhgkplqbEp7hM9xzmXgq7T9MlEjj")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test(".....", () => {
    const obj = {
      googleId: "105784672668267029665",
      note: "Seventh one: should be added",
    };
    return request(app)
      .post("/api/notes/WNKXrkEko7heVDXr7JDAIRmJaZPX63u6x7K9b")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
      });
  });

  test.only(".....", () => {
    const obj = {
      googleId: "108971830262728991643",
      note: "Priority:1, Date Created: 04/04/2023: Don't forget to cancel this to avoid it recrruring",
    };
    return request(app)
      .post("/api/notes/DezVVpLgNKHNEWMj9ykLtgMxDqDZqeCE1ylER")
      .send(obj)
      .expect(201)
      .then((res) => {
        expect(res.body).toEqual({ message: "Note added to DB" });
        console.log(res.body);
      });
  });
});

describe.only("POST /api/transactions/:transaction_id", () => {
  const obj = {
    googleId: "108971830262728991643",
  };
  test("returns full transaction object, including the note, for a transaction_id supplied", () => {
    return request(app)
      // .post("/api/transactions/DezVVpLgNKHNEWMj9ykLtgMxDqDZqeCE1ylER")
      .post("/api/transactions/RP6y68qaj9Ud3LmL4o3jh4KNbzgoVWuPArQKl")
      .send(obj)
      .expect(200)
      .then((res) => {
        console.log(res.body);
      })
    });
    
});

describe('DELETE /api/accounts/:account_id', () => {
    const obj = {
      googleId: "103483413108620628802",
    };
    test('removes given account from the given user in mongoDB', () => {
      return request(app)
      .delete('/api/accounts/Jvoe9375wnUEAe6MwWRkiRbM3rmzb3CQ6KL6D')
      .send(obj)
      .expect(204)
      .then((res) => {
        // console.log(res.body);
      });
});
});
    
describe("DELETE /api/accounts/:account_id", () => {
  const obj = {
    googleId: "103483413108620628802",
  };
  test("removes given account from the given user in mongoDB", () => {
    return request(app)
      .delete("/api/accounts/qPnV9z8xJKI87abNGyqMt7wNBoDQwBT6rvqra")
      .send(obj)
      .expect(204)
      .then((res) => {
        // expect(response.body[0]).toHaveProperty("TBD notes array", expect.any(String));
        console.log(res.body);
      });
  });
});
