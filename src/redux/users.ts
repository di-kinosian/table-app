import { createSlice, PayloadAction, createAsyncThunk } from "@reduxjs/toolkit";
import { User } from "../types";

interface UsersState {
  users: User[];
  filteredUsers: User[];
  loading: boolean;
  error: string | null;
  searchValue: string;
  searchBy: string;
}

const initialState: UsersState = {
  users: [],
  filteredUsers: [],
  loading: false,
  error: null,
  searchValue: "",
  searchBy: "name",
};

export const fetchUsers = createAsyncThunk<User[]>(
  "users/fetchUsers",
  async () => {
    const response = await fetch("https://jsonplaceholder.typicode.com/users");
    const data = await response.json();
    return data;
  },
);

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    onChangeSearchBy: (state, action: PayloadAction<string>) => {
      state.searchBy = action.payload;
      state.searchValue = "";
      state.filteredUsers = state.users;
    },
    onSearch: (state, action: PayloadAction<string>) => {
      state.searchValue = action.payload;
      const searchValueLower = action.payload.toLowerCase();

      state.filteredUsers = state.users.filter((user) => {
        const fieldToSearch = user[state.searchBy as keyof User];
        return fieldToSearch.toLowerCase().includes(searchValueLower);
      });
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsers.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload;
        state.filteredUsers = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch users";
      });
  },
});

export const { onChangeSearchBy, onSearch } = usersSlice.actions;
export default usersSlice.reducer;
