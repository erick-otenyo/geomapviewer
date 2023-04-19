import { trackEvent } from '@/utils/analytics';
import * as actions from './actions';

const isServer = typeof window === 'undefined';

const showDashboardPrompts =
  !isServer && JSON.parse(localStorage.getItem('showPrompts'));
const dashboardPromptsViewed =
  !isServer && JSON.parse(localStorage.getItem('dashboardPromptsViewed'));

export const initialState = {
  showPrompts: showDashboardPrompts === null || showDashboardPrompts,
  promptsViewed: dashboardPromptsViewed || [],
  settings: {
    open: false,
    stepIndex: 0,
    stepsKey: '',
  },
};

const setShowDashboardPrompts = (state, { payload }) => {
  if (!isServer) {
    localStorage.setItem('showPrompts', payload);
  }
  trackEvent({
    category: 'User prompts',
    action: 'User prompt is hidden/shown',
    label: payload ? 'User enables prompts' : 'User hides prompts'
  })

  return {
    ...state,
    showPrompts: payload,
  };
};

const setShowPromptsViewed = (state, { payload }) => {
  const { promptsViewed } = state;
  const newPromptsViewed =
    promptsViewed && promptsViewed.length && promptsViewed.includes(payload)
      ? promptsViewed
      : promptsViewed.concat([payload]);
  if (!isServer) {
    localStorage.setItem(
      'dashboardPromptsViewed',
      JSON.stringify(newPromptsViewed)
    );
  }

  return {
    ...state,
    promptsViewed: newPromptsViewed,
  };
};

const setDashboardPrompts = (state, { payload }) => ({
  ...state,
  settings: {
    ...state,
    ...payload,
  },
});

export default {
  [actions.setShowDashboardPrompts]: setShowDashboardPrompts,
  [actions.setDashboardPrompts]: setDashboardPrompts,
  [actions.setShowPromptsViewed]: setShowPromptsViewed,
};
