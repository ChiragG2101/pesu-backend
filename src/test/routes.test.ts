import { expect } from "chai";
import request from "supertest";
import app from "../app";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const generateToken = () => {
  const user = {};
  return jwt.sign(user, process.env.JWT_SECRET as string, { expiresIn: "1h" });
};

describe("API Routes", () => {
  let token: string;

  before((done) => {
    mongoose
      .connect(
        process.env.MONGODB_URI as string,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
        } as mongoose.ConnectOptions
      )
      .then(() => {
        token = generateToken();
        done();
      })
      .catch((err) => done(err));
  });

  after((done) => {
    mongoose.connection
      .close()
      .then(() => done())
      .catch((err) => done(err));
  });

  describe("GET /api/people", () => {
    it("should return all people", (done) => {
      request(app)
        .get("/api/people")
        .set("Authorization", `Bearer ${token}`)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("totalCount");
          expect(res.body).to.have.property("people").that.is.an("array");
          done();
        });
    });

    it("should return 401 if no token is provided", (done) => {
      request(app)
        .get("/api/people")
        .expect(401)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property(
            "error",
            "No token, authorization denied"
          );
          done();
        });
    });
  });

  describe("POST /api/people", () => {
    it("should create new people entries", (done) => {
      const people = [
        { type: "man", count: 10 },
        { type: "woman", count: 15 },
        { type: "boy", count: 5 },
        { type: "girl", count: 8 },
      ];

      request(app)
        .post("/api/people")
        .set("Authorization", `Bearer ${token}`)
        .send(people)
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("totalCount");
          expect(res.body).to.have.property("people").that.is.an("array");
          done();
        });
    });

    it("should return 400 for invalid data", (done) => {
      const invalidPeople = [{ type: "alien", count: 10 }];

      request(app)
        .post("/api/people")
        .set("Authorization", `Bearer ${token}`)
        .send(invalidPeople)
        .expect(400)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("errors").that.is.an("array");
          done();
        });
    });
  });

  describe("POST /api/auth/login", () => {
    it("should return a JWT token", (done) => {
      request(app)
        .post("/api/auth/login")
        .send({})
        .expect("Content-Type", /json/)
        .expect(200)
        .end((err, res) => {
          if (err) return done(err);
          expect(res.body).to.have.property("token");
          done();
        });
    });
  });
});
