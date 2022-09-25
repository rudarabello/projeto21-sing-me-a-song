import { jest } from "@jest/globals";
import { recommendationService } from "../../src/services/recommendationsService.js";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import recommendationsAmount from "../factory/createRecommendationsAmount.js";

describe("Recommendations service test", () => {
    beforeEach(() => {
        jest.clearAllMocks();
        jest.resetAllMocks();
    });
    it("should not found recommendation upvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);
        expect(async () => {
            await recommendationService.upvote(1);
        }).rejects.toEqual({ message: "", type: "not_found" });
    });
    it("should not found recommendation downvote", async () => {
        jest.spyOn(recommendationRepository, "find").mockResolvedValue(null);
        expect(async () => {
            await recommendationService.downvote(1);
        }).rejects.toEqual({ message: "", type: "not_found" });
    });
    it("should conflict recommendation insert", async () => {
        const recommendation = recommendationsAmount();
        jest.spyOn(recommendationRepository, "findByName")
            .mockResolvedValue(recommendation[0]);
        expect(async () => {
            await recommendationService.insert(recommendation[0]);
        }).rejects.toEqual({
            message: "Recommendations names must be unique",
            type: "conflict",
        });
    });


})