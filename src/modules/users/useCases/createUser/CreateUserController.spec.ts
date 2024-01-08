import request from "supertest";
import { Connection } from "typeorm";
import createConnection from "../../../../database";
import { app } from "../../../../app";

let connection: Connection;

describe("Create User Controller", () => {
  beforeAll(async () => {
    connection = await createConnection("localhost");
    await connection.runMigrations();
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it("should be able to create a new user", async () => {
    const response = await request(app).post("/api/v1/users").send({
      name: "test user",
      email: "test@example.com",
      password: "0123456",
    });

    expect(response.status).toEqual(201);
  });

  it("should not be able to create user with email exists", async () => {
    await request(app).post("/api/v1/users").send({
      name: "test user",
      email: "test@example.com",
      password: "0123456",
    });

    const response = await request(app).post("/api/v1/users").send({
      name: "test user",
      email: "test@example.com",
      password: "0123456",
    });

    expect(response.status).toEqual(400);
    expect(response.body).toHaveProperty('message', 'User already exists')
  });
});
