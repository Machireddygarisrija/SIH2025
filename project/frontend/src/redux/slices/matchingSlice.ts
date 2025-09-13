import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Match {
  id: string;
  opportunityId: string;
  applicantId: string;
  score: number;
  explanation: Array<{
    factor: string;
    score: number;
    explanation: string;
  }>;
}

interface MatchingState {
  matches: Match[];
  matchingProgress: number;
  batchMatching: boolean;
  isLoading: boolean;
  error: string | null;
}

const initialState: MatchingState = {
  matches: [],
  matchingProgress: 0,
  batchMatching: false,
  isLoading: false,
  error: null,
};

export const runMatching = createAsyncThunk(
  'matching/runMatching',
  async (params: { batchSize: number }) => {
    // Simulate batch matching process
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    // Mock successful matching
    return {
      totalMatches: params.batchSize * 0.8,
      processedApplicants: params.batchSize,
      averageMatchScore: 78.5,
    };
  }
);

export const getMatches = createAsyncThunk(
  'matching/getMatches',
  async (userId: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Mock matches data
    const mockMatches: Match[] = Array.from({ length: 10 }, (_, i) => ({
      id: `match-${i}`,
      opportunityId: `opp-${i}`,
      applicantId: userId,
      score: Math.floor(Math.random() * 40) + 60, // 60-100
      explanation: [
        { factor: 'Skills Match', score: Math.floor(Math.random() * 30) + 70, explanation: 'Strong alignment with required skills' },
        { factor: 'Location', score: Math.floor(Math.random() * 40) + 60, explanation: 'Good location match' },
        { factor: 'Experience', score: Math.floor(Math.random() * 35) + 65, explanation: 'Relevant experience level' },
      ]
    }));
    
    return mockMatches;
  }
);

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    updateMatchingProgress: (state, action: PayloadAction<number>) => {
      state.matchingProgress = action.payload;
    },
    clearMatches: (state) => {
      state.matches = [];
    },
    setBatchMatching: (state, action: PayloadAction<boolean>) => {
      state.batchMatching = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Run Matching
      .addCase(runMatching.pending, (state) => {
        state.batchMatching = true;
        state.matchingProgress = 0;
        state.error = null;
      })
      .addCase(runMatching.fulfilled, (state) => {
        state.batchMatching = false;
        state.matchingProgress = 100;
        state.error = null;
      })
      .addCase(runMatching.rejected, (state, action) => {
        state.batchMatching = false;
        state.matchingProgress = 0;
        state.error = action.error.message || 'Matching failed';
      })
      // Get Matches
      .addCase(getMatches.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getMatches.fulfilled, (state, action) => {
        state.isLoading = false;
        state.matches = action.payload;
        state.error = null;
      })
      .addCase(getMatches.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to get matches';
      });
  },
});

export const { updateMatchingProgress, clearMatches, setBatchMatching } = matchingSlice.actions;
export default matchingSlice.reducer;