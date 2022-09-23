import supertest from "supertest";
import app from "../../src/app";
import { prisma } from "../../src/database";
import recommendationFactory from "../factory/createRecomendation";

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

    it("should return 422 given an empty body", async () => {
        const musics = {};
        const response = await supertest(app).post("/recommendations").send(musics);
        expect(response.status).toEqual(422);
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

describe("POST /:id/upvote tests", () => {
    beforeEach(async () => {
        await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
    });
    afterAll(async () => {
        await prisma.$disconnect();
    });

});

// describe("POST /:id/downvote tests", () => {
//     beforeEach(async () => {
//         await prisma.$executeRaw`TRUNCATE TABLE recommendations;`;
//     });
//     afterAll(async () => {
//         await prisma.$disconnect();
//     });

// });
