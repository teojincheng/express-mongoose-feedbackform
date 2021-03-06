const request = require("supertest");
const app = require("./app");

describe("/", () => {
  it("GET should return a list of endpoints", async () => {
    const { body } = await request(app)
      .get("/")
      .expect(200);
    expect(body).toEqual({
      "0": "GET /",
      "1": "GET /user",
      "2": "GET /companies",
      "3": "GET /companies/:id",
      "4": "POST /companies/:id/reviews",
      "5": "POST /user/login",
      "6": "POST /user/logout"
    });
  });
});
