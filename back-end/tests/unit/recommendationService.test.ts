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
})