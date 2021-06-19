const app = require("../app");

const request = require("supertest");
const httpStatus = require("http-status");

describe("Sample Integration Test", function() {
  describe("POST /", function() {
    it("Should return OK status for an existing URL",
        function() {
          return new Promise((done) => {
            request(app)
                .post("/")
                .send({
                  longUrl: "www.google.com",
                })
                .expect(httpStatus.OK, done);
          });
        });
  });
});
