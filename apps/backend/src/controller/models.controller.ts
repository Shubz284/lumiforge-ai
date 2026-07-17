import { listImageModels, type MediaModel } from "../lib/openrouter"
import type { Request, Response } from "express";
import { ErrorResponse, SuccessResponse } from "../utility/ApiResponse";

export function modelsHandler(list: () => Promise<unknown>) {
  return async (_req: Request, res: Response) => {
    try {
        const modelLists = (await list()) as MediaModel[];
        const result = {
            length:modelLists.length,
            modelLists
        }

      res.status(200).json(SuccessResponse(result));
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to load models";
      res.status(502).json(ErrorResponse(`error: ${message}`));
    }
  };
}
