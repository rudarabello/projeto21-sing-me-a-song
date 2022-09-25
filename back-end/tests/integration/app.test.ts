import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import recommendationFactory from "../factory/createRecomendation";
import recommendationsAmount from "../factory/createRecommendationsAmount";

describe("POST /recommendations tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should return 201 and persist the music given a valid body", async () => {
        const recommendations = recommendationFactory();
        const response = await supertest(app)
            .post("/recommendations")
            .send(recommendations[0]);
        expect(response.status).toEqual(201);
    });
    it("should return 422 given an empty body", async () => {
        const recommendations = recommendationFactory();
        const response = await supertest(app).post("/recommendations").send({
            youtubeLink: recommendations[0].youtubeLink,
        });
        expect(response.status).toEqual(422);
    });
    it("should return 422 given a body with no youtubeLink", async () => {
        const recommendations = recommendationFactory();
        const response = await supertest(app).post("/recommendations").send({
            name: recommendations[0].name,
        });
        expect(response.status).toEqual(422);
    });

    it("should return 409: conflict with unique constraint", async () => {
        const recommendations = recommendationFactory();
        await supertest(app)
            .post("/recommendations/")
            .send(recommendations[0]);
        const result = await supertest(app)
            .post("/recommendations/")
            .send(recommendations[0]);
        expect(result.status).toBe(409);
    });
});

describe("POST /recommendations/:id/upvote tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 200 given a valid recommendation", async () => {
        const recommendations = recommendationFactory();

        const createdRecommendation = await prisma.recommendation.create({
            data: { ...recommendations[0] },
        });

        const response = await supertest(app).post(
            `/recommendations/${createdRecommendation.id}/upvote`
        );
        expect(response.status).toEqual(200);
    });
});

describe("POST /recommendations/:id/downvote tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 200 given a valid recommendation", async () => {
        const recommendations = recommendationFactory();

        const createdRecommendation = await prisma.recommendation.create({
            data: { ...recommendations[0] },
        });

        const response = await supertest(app).post(
            `/recommendations/${createdRecommendation.id}/downvote`
        );
        expect(response.status).toEqual(200);
    });
});

describe("GET /recommendations tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 200 given a recommendations array", async () => {
        const recommendations = recommendationFactory();
        await prisma.recommendation.create({
            data: { ...recommendations[0] },
        });
        const response = await supertest(app).get("/recommendations");
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.length).not.toBeNull();
    });
    it("should pick a random song", async () => {
        const result = await supertest(app).get("/recommendations/random");
        expect(result.status).toBe(404);
    });
});

describe("GET /recommendations/:id tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 200 given a valid recommendation", async () => {
        const recommendations = recommendationFactory();

        const createdRecommendation = await prisma.recommendation.create({
            data: { ...recommendations[0] },
        });

        const response = await supertest(app).get(
            `/recommendations/${createdRecommendation.id}`
        );
        expect(response.body).toEqual(createdRecommendation);
    });
});

describe("GET /recommendations/random tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });

    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 200 given a score more or equal than 10", async () => {
        const recommendations = recommendationFactory();

        const createdMusic = await prisma.recommendation.create({
            data: { ...recommendations[0], score: 245 },
        });

        const response = await supertest(app).get("/recommendations/random");
        expect(response.body).toEqual(createdMusic);
    });
});

describe("GET /top/:amount tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should return 200 given a recommendations array", async () => {
        const recommendations = recommendationFactory();

        await prisma.recommendation.create({
            data: { ...recommendations[0] },
        });

        const response = await supertest(app).get("/recommendations");
        expect(response.body.length).toBeGreaterThan(0);
        expect(response.body.length).not.toBeNull();
    });

});

describe("GET /:id tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });
    it("should return 200 given a valid recommendation", async () => {
        const recommendations = recommendationFactory();
        const createdRecommendation = await prisma.recommendation.create({
            data: { ...recommendations[0] },
        });
        const response = await supertest(app).get(
            `/recommendations/${createdRecommendation.id}`
        );
        expect(response.body).toEqual(createdRecommendation);
    });

});

describe("GET /recommendations/top/:amount tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

    it("should return 200 given a set amount musics", async () => {
        const recommendations = recommendationsAmount();
        const amount = 2;

        await prisma.recommendation.createMany({
            data: [
                { ...recommendations[0] },
                { ...recommendations[1] },
            ],
        });

        const response = await supertest(app).get(`/recommendations/top/${amount}`);
        expect(response.body.length).toBeGreaterThanOrEqual(amount);
    });
});
