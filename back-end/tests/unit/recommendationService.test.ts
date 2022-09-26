import { jest } from "@jest/globals";
import { recommendationRepository } from "../../src/repositories/recommendationRepository.js";
import { recommendationService } from "../../src/services/recommendationsService.js";
import recommendationsToMock from "../factory/createRecommendationsToMock.js";


function mockMathRandom(number: number) {
    const mockMathRandom = Object.create(global.Math);
    mockMathRandom.random = () => number;
    global.Math = mockMathRandom;

    return mockMathRandom;
}


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
        const recommendation = recommendationsToMock();
        jest.spyOn(recommendationRepository, "findByName")
            .mockResolvedValue(recommendation[0]);
        expect(async () => {
            await recommendationService.insert(recommendation[0]);
        }).rejects.toEqual({
            message: "Recommendations names must be unique",
            type: "conflict",
        });
    });



    it("should remove recommendation downvote", async () => {
        const recommendation = recommendationsToMock();
        jest.spyOn(recommendationRepository, "find")
            .mockResolvedValue(recommendation[2]);
        jest.spyOn(recommendationRepository, "updateScore")
            .mockResolvedValue(recommendation[2]);
        const remove = jest
            .spyOn(recommendationRepository, "remove")
            .mockResolvedValue(null);
        await recommendationService.downvote(recommendation[2].id);
        expect(recommendationRepository.updateScore).toBeCalledWith(
            recommendation[2].id,
            "decrement"
        );
        expect(recommendationRepository.remove).toBeCalledWith(
            recommendation[2].id
        );
        expect(remove).toHaveBeenCalledTimes(1);
    });



    it("should not found recommendation getRandom", async () => {
        mockMathRandom(1);
        jest.spyOn(recommendationService, "getScoreFilter").mockReturnValue("lte");
        jest.spyOn(recommendationService, "getByScore").mockResolvedValue([]);
        jest.spyOn(recommendationRepository, "findAll").mockResolvedValue([]);
        expect(async () => {
            await recommendationService.getRandom();
        }).rejects.toEqual({ message: "", type: "not_found" });
    });



    it("should not found recommendation getRandom", async () => {
        mockMathRandom(0.3);
        const recommendation = recommendationsToMock();
        jest.spyOn(recommendationService, "getScoreFilter")
            .mockReturnValueOnce("gt");
        jest.spyOn(recommendationRepository, "findAll")
            .mockResolvedValue(recommendation);
        await recommendationService.getRandom();
        expect(recommendationRepository.findAll).toBeCalledTimes(1);
    });
});