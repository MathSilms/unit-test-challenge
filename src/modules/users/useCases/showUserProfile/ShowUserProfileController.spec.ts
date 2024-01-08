import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Show User Profile Controller", () => {
  beforeAll(async () => {
    connection = await createConnection("localhost");
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to show a user profile", async () => {

    await request(app).post("/api/v1/users").send({
      name: "test",
      email: "test@example.com",
      password: "1234578",
    });

    const responseSessions = await request(app).post("/api/v1/sessions").send({
      email: "test@example.com",
      password: "1234578",
    });

    const { token } = responseSessions.body;

    const response = await request(app)
      .get("/api/v1/profile")
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toEqual(200);
    expect(response.body).toHaveProperty("id");
  });
});
