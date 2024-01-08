import { User } from "./../../entities/User";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { InMemoryUsersRepository } from "./../../repositories/in-memory/InMemoryUsersRepository";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import { ShowUserProfileError } from './ShowUserProfileError';

let showUserProfileUseCase: ShowUserProfileUseCase;
let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe("Show User Profile", () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    showUserProfileUseCase = new ShowUserProfileUseCase(
      inMemoryUsersRepository
    );

    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it("should be able to show a user profile", async () => {
    const user = await createUserUseCase.execute({
      name: "user",
      email: "test@test.com",
      password: "1234567",
    });

    const userProfile = await showUserProfileUseCase.execute(user.id);

    expect(userProfile).toBeInstanceOf(User);
  });

  it("should not be able to show profile an nonexistent user", async () => {
    await createUserUseCase.execute({
      name: "user",
      email: "test@test.com",
      password: "1234567",
    });

    const userProfile = showUserProfileUseCase.execute('1234');

    await expect(userProfile).rejects.toBeInstanceOf(ShowUserProfileError);
  });
});

