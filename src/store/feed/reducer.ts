import { Reducer } from "redux";
import { IFeedState, FeedActionTypes } from "./types";
import { UserActionTypes } from "../user/types";
import { PluginInstance } from "@fnndsc/chrisapi";

// Type-safe initialState
export const initialState: IFeedState = {
  feed: undefined,
  feeds: undefined,
  feedsCount: 0,
  pluginInstances: [],
  selected: undefined,
  deleteNodeSuccess: false,
  testStatus: {},
};

const reducer: Reducer<IFeedState> = (state = initialState, action) => {
  switch (action.type) {
    case FeedActionTypes.GET_ALL_FEEDS_SUCCESS: {
      return {
        ...state,
        feeds: action.payload.data,
        feedsCount: action.payload.totalCount,
      };
    }
    case FeedActionTypes.GET_FEED_SUCCESS: {
      return { ...state, feed: action.payload };
    }
    case FeedActionTypes.GET_PLUGIN_INSTANCES_SUCCESS: {
      return {
        ...state,
        selected: action.payload.selected,
        pluginInstances: action.payload.pluginInstances,
      };
    }
    case FeedActionTypes.RESET_FEED_STATE: {
      return {
        ...state,
        pluginInstances: [],
        feed: undefined,
        selected: undefined,
      };
    }
    case FeedActionTypes.ADD_FEED: {
      if (state.feeds && state.feedsCount) {
        return {
          ...state,
          feeds: [action.payload, ...state.feeds],
          feedsCount: state.feedsCount + 1,
        };
      } else {
        return {
          ...state,
          feeds: [action.payload],
          feedsCount: state.feedsCount
            ? state.feedsCount + 1
            : state.feedsCount,
        };
      }
    }
    case FeedActionTypes.GET_SELECTED_PLUGIN: {
      return {
        ...state,
        selected: action.payload,
      };
    }
    case FeedActionTypes.ADD_NODE_SUCCESS: {
      if (state.pluginInstances) {
        const sortedPluginList = [
          ...state.pluginInstances,
          action.payload,
        ].sort((a: PluginInstance, b: PluginInstance) => {
          return b.data.id - a.data.id;
        });
        return {
          ...state,
          pluginInstances: sortedPluginList,
        };
      } else
        return {
          ...state,
          pluginInstances: [action.payload],
        };
    }

    case FeedActionTypes.DELETE_NODE_SUCCESS: {
      return {
        ...state,
        deleteNodeSuccess: !state.deleteNodeSuccess,
      };
    }

    case UserActionTypes.LOGOUT_USER: {
      return {
        ...state,
        feed: undefined,
        feeds: undefined,
        feedsCount: 0,
        pluginInstances: [],
        selected: undefined,
      };
    }

    case FeedActionTypes.GET_TEST_STATUS: {
      const instance = action.payload;

      return {
        ...state,
        testStatus: {
          ...state.testStatus,
          [instance.data.id]: action.payload.data.status,
        },
      };;
    }

    case FeedActionTypes.STOP_FETCHING_PLUGIN_RESOURCES:{
      const id=`${action.payload}` 
      let newObject = Object.entries(state.testStatus)
        .filter(([key, value]) => {
          return key !== id;
        })
        .reduce((acc:{[key:string]:string}, [key, value]) => {
          acc[key] = value;
          return acc;
        }, {});
        
      return {
        ...state,
        testStatus: newObject,
      };
    }

    default: {
      return state;
    }
  }
};

export { reducer as feedReducer };




