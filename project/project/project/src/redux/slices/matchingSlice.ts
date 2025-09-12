import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

interface Match {
  id: string;
  opportunity: any;
  score: number;
  explanation: string[];
  status: 'pending' | 'applied' | 'accepted' | 'rejected';
}

interface MatchingState {
  matches: Match[];
  loading: boolean;
  error: string | null;
  matchingProgress: number;
  batchMatching: boolean;
}

const initialState: MatchingState = {
  matches: [],
  loading: false,
  error: null,
  matchingProgress: 0,
  batchMatching: false,
};

export const runMatching = createAsyncThunk(
  'matching/runMatching',
  async ({ userId, batchSize }: { userId?: string; batchSize?: number }) => {
    const response = await fetch('/api/matching/run', {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ userId, batchSize }),
    });
    
    if (!response.ok) {
      throw new Error('Matching failed');
    }
    
    return response.json();
  }
);

export const getMatches = createAsyncThunk(
  'matching/getMatches',
  async () => {
    const response = await fetch('/api/matching/matches', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch matches');
    }
    
    return response.json();
  }
);

const matchingSlice = createSlice({
  name: 'matching',
  initialState,
  reducers: {
    updateMatchingProgress: (state, action: PayloadAction<number>) => {
      state.matchingProgress = action.payload;
    },
    setBatchMatching: (state, action: PayloadAction<boolean>) => {
      state.batchMatching = action.payload;
    },
    updateMatchStatus: (state, action: PayloadAction<{ matchId: string; status: string }>) => {
      const match = state.matches.find(m => m.id === action.payload.matchId);
      if (match) {
        match.status = action.payload.status as any;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(runMatching.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.batchMatching = true;
      })
      .addCase(runMatching.fulfilled, (state, action) => {
        state.loading = false;
        state.batchMatching = false;
        state.matches = action.payload.matches;
      })
      .addCase(runMatching.rejected, (state, action) => {
        state.loading = false;
        state.batchMatching = false;
        state.error = action.error.message || 'Matching failed';
      })
      .addCase(getMatches.fulfilled, (state, action) => {
        state.matches = action.payload;
      });
  },
});

export const { updateMatchingProgress, setBatchMatching, updateMatchStatus } = matchingSlice.actions;
export default matchingSlice.reducer;