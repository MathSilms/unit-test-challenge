import exp from "constants";

import { AppError } from '../../../../shared/errors/AppError';

import { CreateUserUseCase } from "./CreateUserUseCase";
import { InMemoryUsersRepository } from './../../repositories/in-memory/InMemoryUsersRepository';
import { CreateUserError } from "./CreateUserError";

let createUserUseCase: CreateUserUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;

describe("Create user", () => {

  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(
      inMemoryUsersRepository,
    );
  });

  it("should create a new user", async () => {
    const user = {
      name: 'test user',
      email: 'test@gmail.com',
      password:"1234567"
    };

    await createUserUseCase.execute(user);

    const categoryCreated = await inMemoryUsersRepository.findByEmail(user.email);

    expect(categoryCreated).toHaveProperty("id");
  })

  it("should net create a new user with email exists", async () => {
    expect(async ()=>{
      const user = {
        name: 'test user',
        email: 'test@gmail.com',
        password:"1234567"
      };

      await createUserUseCase.execute(user);

      await createUserUseCase.execute(user);

      await inMemoryUsersRepository.findByEmail(user.email);

    }).rejects.toBeInstanceOf(CreateUserError);


  })
})
