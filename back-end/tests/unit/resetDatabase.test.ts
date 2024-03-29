import request from "supertest";
import { prisma } from "../../src/database";
import app from "../../src/app";

describe("DELETE /e2e/reset", () => {
  beforeEach(async () => {
    await prisma.$executeRaw`TRUNCATE TABLE recommendations`;
  });
  afterAll(() => {
    prisma.$disconnect();
  });

  it("Should be able to reset database and return 200", async () => {
    await request(app).del("/e2e/reset").expect(200);
  });
});
