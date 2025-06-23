import { submitEssayResponseT } from "@/types/ai-evaluation";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface IAiEvaluationState {
  evaluationResult: submitEssayResponseT | null;
  evaluationError: string | null;
  isLoading: boolean;
}

const initialState: IAiEvaluationState = {
  evaluationResult: null,
  evaluationError: null,
  isLoading: false,
};

export const aiEvaluationSlice = createSlice({
  name: "aiEvaluation",
  initialState,
  reducers: {
    setEvaluationError: (state, action: PayloadAction<string>) => {
      state.evaluationError = action.payload;
    },
    clearEvaluationError: (state) => {
      state.evaluationError = null;
    },
    startEvaluation: (state) => {
      state.isLoading = true;
    },
    finishEvaluation: (state) => {
      state.isLoading = false;
    },
    setEvaluationResult: (
      state,
      action: PayloadAction<submitEssayResponseT>
    ) => {
      state.evaluationResult = action.payload;
      state.isLoading = false;
      state.evaluationError = null;
    },
    clearEvaluationResult: (state) => {
      state.evaluationResult = null;
      state.evaluationError = null;
      state.isLoading = false;
    },
  },
});
export const aiEvaluationActions = aiEvaluationSlice.actions;
export default aiEvaluationSlice.reducer;
