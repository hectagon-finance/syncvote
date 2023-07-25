/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable no-param-reassign */
import { createSlice } from '@reduxjs/toolkit';
import { IOrgInfo, IProfile } from './interface';

const initialState: {
  orgs: IOrgInfo[];
  lastFetch: number;
  user: IProfile;
} = {
  orgs: [],
  lastFetch: -1,
  user: {
    id: '',
    email: '',
    full_name: '',
    avatar_url: '',
    about_me: '',
  },
};

const orgInfoSlice = createSlice({
  name: 'orginfo',
  initialState,
  reducers: {
    setLastFetch: (state, action) => {
      state.lastFetch = new Date().getTime();
    },
    changeOrgInfo: (state, action) => {
      const index = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === action.payload.id
      );
      if (index === -1) {
        state.orgs.push({ ...structuredClone(action.payload) });
      } else {
        state.orgs[index] = { ...state.orgs[index], ...action.payload };
      }
    },
    changeWorkflowInOrg: (state, action) => {
      const { orgId, workflow } = action.payload;
      const orgIndex = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === orgId
      );
      if (orgIndex !== -1) {
        const workflows = state.orgs[orgIndex].workflows;
        if (workflows !== undefined) {
          const workflowIndex = workflows.findIndex(
            (wf: any) => wf.id === workflow.id
          );
          if (workflowIndex !== undefined && workflowIndex !== -1) {
            workflows[workflowIndex] = {
              ...workflows[workflowIndex],
              ...workflow,
            };
          } else {
            workflows.push(workflow);
          }
        } else {
          state.orgs[orgIndex].workflows = [workflow];
        }
      }
    },
    deleteWorkflowInOrg: (state, action) => {
      const { workflowId } = action.payload;
      state.orgs.map((org: any) => {
        const workflows = org.worfklows;
        if (workflows) {
          const idx = workflows.findIndex((wf: any) => wf.id === workflowId);
          workflows.splice(idx, 1);
        }
      });
    },
    setOrgsInfo: (state, action) => {
      state.orgs = [...action.payload];
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    reset: (state, action) => {
      state.orgs = [];
      state.lastFetch = -1;
    },
    addUserToOrg: (state, action) => {
      const { orgId, user } = action.payload;
      const orgIndex = state.orgs.findIndex(
        (org: IOrgInfo) => org.id === orgId
      );
      if (orgIndex !== -1) {
        state.orgs[orgIndex].profile.push(user);
      }
    },
  },
});

export const {
  setLastFetch,
  changeOrgInfo,
  setOrgsInfo,
  reset,
  setUser,
  addUserToOrg,
  changeWorkflowInOrg,
  deleteWorkflowInOrg,
} = orgInfoSlice.actions;
export default orgInfoSlice.reducer;
