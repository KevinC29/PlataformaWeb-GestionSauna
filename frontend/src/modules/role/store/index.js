import {
  createRole,
  getRoles,
  getRole,
  updateRole,
  deleteRole
} from '@/api/services/roleService';
import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';

export default {
  namespaced: true,
  state: {
    roles: [],
    role: null,
    error: '',
    success: '',
  },
  mutations: {
    SET_ROLES(state, roles) {
      state.roles = roles;
    },
    SET_ROLE(state, role) {
      state.role = role;
    },
    ADD_ROLE(state, role) {
      state.roles.push(role);
    },
    UPDATE_ROLE(state, updatedRole) {
      const index = state.roles.findIndex(role => role._id === updatedRole._id);
      if (index !== -1) {
        state.roles.splice(index, 1, updatedRole);
      }
    },
    DELETE_ROLE(state, roleId) {
      state.roles = state.roles.filter(role => role._id !== roleId);
    },
    SET_ERROR(state, error) {
      state.error = error;
    },
    SET_SUCCESS(state, success) {
      state.success = success;
    }
  },
  actions: {
    async fetchRoles({ commit }) {
      try {
        const response = await getRoles();
        commit('SET_ROLES', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async fetchRole({ commit }, id) {
      try {
        const response = await getRole(id);
        commit('SET_ROLE', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async createRole({ commit }, roleData) {
      try {
        const response = await createRole(roleData);
        commit('ADD_ROLE', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async updateRole({ commit }, { id, roleData }) {
      try {
        const response = await updateRole(id, roleData);
        commit('UPDATE_ROLE', response.data);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    },
    async deleteRole({ commit }, id) {
      try {
        const response = await deleteRole(id);
        commit('DELETE_ROLE', id);
        const successMsg = handleSuccess(response);
        commit('SET_SUCCESS', successMsg);
        return null;
      } catch (error) {
        const errorMsg = handleError(error);
        commit('SET_ERROR', errorMsg);
        throw error;
      }
    }
  },
  getters: {
    roles: state => state.roles,
    role: state => state.role,
    error: state => state.error,
    success: state => state.success,
  }
};
