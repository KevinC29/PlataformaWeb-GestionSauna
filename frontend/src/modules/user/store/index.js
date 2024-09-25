import {
    createUser,
    getUsers,
    getUser,
    updateUser,
    deleteUser
} from '@/api/services/userService';
import { updateCredentialStatus } from '@/api/services/credentialService';
import { resetPassword } from '@/api/services/authService';
import { handleError } from '@/middleware/errorHandler';
import { handleSuccess } from '@/middleware/successHandler';

export default {
    namespaced: true,
    state: {
        users: [],
        user: null,
        roles: [],
        error: '',
        success: '',
    },
    mutations: {
        SET_USERS(state, users) {
            state.users = users;
        },
        SET_USER(state, user) {
            state.user = user;
        },
        ADD_USER(state, user) {
            state.users.push(user);
        },
        UPDATE_USER(state, updatedUser) {
            const index = state.users.findIndex(user => user._id === updatedUser._id);
            if (index !== -1) {
                state.users.splice(index, 1, updatedUser);
            }
        },
        DELETE_USER(state, userId) {
            state.users = state.users.filter(user => user._id !== userId);
        },
        SET_ROLES(state, roles) {
            state.roles = roles;
        },
        SET_ERROR(state, error) {
            state.error = error;
        },
        SET_SUCCESS(state, success) {
            state.success = success;
        }
    },
    actions: {
        async fetchUsers({ commit }) {
            try {
                const response = await getUsers();
                commit('SET_USERS', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchUser({ commit }, id) {
            try {
                const response = await getUser(id);
                commit('SET_USER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async createUser({ commit }, userData) {
            try {
                const response = await createUser(userData);
                commit('ADD_USER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async updateUser({ commit }, { id, userData }) {
            try {
                const response = await updateUser(id, userData);
                commit('UPDATE_USER', response.data);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async deleteUser({ commit }, id) {
            try {
                const response = await deleteUser(id);
                commit('DELETE_USER', id);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async fetchAndSetRoles({ dispatch, commit }) {
            try {
                const response = await dispatch('role/fetchRoles', null, { root: true });
                const roles = this.getters['role/roles'];
                commit('SET_ROLES', roles);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async updateCredentialStatus({ commit }, statusData) {
            try {
                const response = await updateCredentialStatus(statusData);
                const successMsg = handleSuccess(response);
                commit('SET_SUCCESS', successMsg);
                return null;
            } catch (error) {
                const errorMsg = handleError(error);
                commit('SET_ERROR', errorMsg);
                throw error;
            }
        },
        async resetPasswordCredential({ commit }, email) {
            try {
                const response = await resetPassword(email);
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
        users: state => state.users,
        user: state => state.user,
        roles: state => state.roles,
        error: state => state.error,
        success: state => state.success,
    }
};
