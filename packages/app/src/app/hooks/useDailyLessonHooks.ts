// packages/app/src/app/hooks/useDailyLessonHooks.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { useAccount } from 'wagmi';
import { API_URL } from '../config';

// Types
export interface DailyLessonRecord {
    id: string;
    userId: string;
    date: Date;
    lessonsCompleted: number;
    createdAt?: Date;
    updatedAt?: Date;
    user?: {
        username: string;
        walletAddress: string;
    };
}

export interface CreateDailyLessonPayload {
    userId: string;
    date: string; // ISO date string
    lessonsCompleted: number;
}

export interface UpdateDailyLessonPayload {
    lessonsCompleted: number;
}

export interface IncrementDailyLessonPayload {
    amount?: number; // defaults to 1
}

export interface DailyLessonFilters {
    userId?: string;
    startDate?: string;
    endDate?: string;
    sortBy?: 'date' | 'lessonsCompleted' | 'createdAt' | 'updatedAt';
    order?: 'asc' | 'desc';
    limit?: number;
    page?: number;
}

export interface DailyLessonResponse {
    data: DailyLessonRecord[];
    page: number;
    limit: number;
    totalPages: number;
    totalRecords: number;
}

const DAILY_LESSON_QUERY_KEY = 'dailyLessons';

// Axios instance for API calls
const apiClient = axios.create({
    baseURL: API_URL,
});

// GET /api/daily-lessons - Get daily lesson records (filterable by date range and user)
export const useGetDailyLessons = (filters?: DailyLessonFilters) => {
    const { address, isConnected } = useAccount();

    return useQuery<DailyLessonResponse, Error>({
        queryKey: [DAILY_LESSON_QUERY_KEY, filters],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/daily-lessons', {
                params: filters,
            });
            return data;
        },
        enabled: isConnected, // Only fetch if user is connected
    });
};

// GET /api/daily-lessons/:id - Get a specific daily lesson record by its ID
export const useGetDailyLessonById = (id: string | undefined) => {
    const { isConnected } = useAccount();

    return useQuery<DailyLessonRecord, Error>({
        queryKey: [DAILY_LESSON_QUERY_KEY, id],
        queryFn: async () => {
            if (!id) throw new Error('Daily lesson record ID is required');
            const { data } = await apiClient.get(`/api/daily-lessons/${id}`);
            return data;
        },
        enabled: isConnected && !!id, // Only fetch if connected and id is provided
    });
};

// GET /api/daily-lessons/user/:userId/date/:date - Get a specific record by user and date
export const useGetDailyLessonByUserAndDate = (userId: string | undefined, date: string | undefined) => {
    const { isConnected } = useAccount();

    return useQuery<DailyLessonRecord, Error>({
        queryKey: [DAILY_LESSON_QUERY_KEY, 'user', userId, 'date', date],
        queryFn: async () => {
            if (!userId || !date) throw new Error('User ID and date are required');
            const { data } = await apiClient.get(`/api/daily-lessons/user/${userId}/date/${date}`);
            return data;
        },
        enabled: isConnected && !!userId && !!date, // Only fetch if connected and both params are provided
    });
};

// GET current user's today's lesson record
export const useGetTodayLessonRecord = () => {
    const { address, isConnected } = useAccount();
    const today = new Date().toISOString().split('T')[0]; // YYYY-MM-DD format

    return useQuery<DailyLessonRecord, Error>({
        queryKey: [DAILY_LESSON_QUERY_KEY, 'user', address, 'date', today],
        queryFn: async () => {
            if (!address) throw new Error('User not connected');
            const { data } = await apiClient.get(`/api/daily-lessons/user/${address}/date/${today}`);
            return data;
        },
        enabled: isConnected && !!address,
        retry: (failureCount, error) => {
            // Don't retry if it's a 404 (record doesn't exist yet)
            if ((error as any)?.response?.status === 404) return false;
            return failureCount < 3;
        },
    });
};

// GET current user's lesson records for a date range
export const useGetUserLessonHistory = (startDate?: string, endDate?: string) => {
    const { address, isConnected } = useAccount();

    const filters: DailyLessonFilters = {
        userId: address,
        startDate,
        endDate,
        sortBy: 'date',
        order: 'desc',
    };

    return useQuery<DailyLessonResponse, Error>({
        queryKey: [DAILY_LESSON_QUERY_KEY, 'history', address, startDate, endDate],
        queryFn: async () => {
            const { data } = await apiClient.get('/api/daily-lessons', {
                params: filters,
            });
            return data;
        },
        enabled: isConnected && !!address,
    });
};

// POST /api/daily-lessons - Add or update a daily lesson record
export const useCreateOrUpdateDailyLesson = () => {
    const queryClient = useQueryClient();
    const { address, isConnected } = useAccount();

    return useMutation<DailyLessonRecord, Error, CreateDailyLessonPayload>({
        mutationFn: async (payload) => {
            if (!isConnected || !address) {
                throw new Error('User not connected');
            }
            const { data } = await apiClient.post('/api/daily-lessons', payload);
            return data;
        },
        onSuccess: (newRecord, variables) => {
            // Invalidate all daily lesson queries
            queryClient.invalidateQueries({ queryKey: [DAILY_LESSON_QUERY_KEY] });

            // Update specific cache entries
            queryClient.setQueryData(
                [DAILY_LESSON_QUERY_KEY, newRecord.id],
                newRecord
            );

            // Update today's record cache if it's for today
            const today = new Date().toISOString().split('T')[0];
            const recordDate = new Date(variables.date).toISOString().split('T')[0];
            if (recordDate === today) {
                queryClient.setQueryData(
                    [DAILY_LESSON_QUERY_KEY, 'user', address, 'date', today],
                    newRecord
                );
            }

            // Invalidate user data as it might include daily limits
            queryClient.invalidateQueries({ queryKey: ['users', address] });
        },
    });
};

// PUT /api/daily-lessons/:id - Update a daily lesson record's lessons completed
export const useUpdateDailyLesson = () => {
    const queryClient = useQueryClient();
    const { address, isConnected } = useAccount();

    return useMutation<DailyLessonRecord, Error, { id: string; payload: UpdateDailyLessonPayload }>({
        mutationFn: async ({ id, payload }) => {
            if (!isConnected || !address) {
                throw new Error('User not connected');
            }
            const { data } = await apiClient.put(`/api/daily-lessons/${id}`, payload);
            return data;
        },
        onSuccess: (updatedRecord, variables) => {
            // Invalidate all daily lesson queries
            queryClient.invalidateQueries({ queryKey: [DAILY_LESSON_QUERY_KEY] });

            // Update specific cache entry
            queryClient.setQueryData(
                [DAILY_LESSON_QUERY_KEY, variables.id],
                updatedRecord
            );

            // Invalidate user data
            queryClient.invalidateQueries({ queryKey: ['users', address] });
        },
    });
};

// PATCH /api/daily-lessons/:id/increment - Increment lessons completed count
export const useIncrementDailyLesson = () => {
    const queryClient = useQueryClient();
    const { address, isConnected } = useAccount();

    return useMutation<DailyLessonRecord, Error, { id: string; payload?: IncrementDailyLessonPayload }>({
        mutationFn: async ({ id, payload = { amount: 1 } }) => {
            if (!isConnected || !address) {
                throw new Error('User not connected');
            }
            const { data } = await apiClient.patch(`/api/daily-lessons/${id}/increment`, payload);
            return data;
        },
        onSuccess: (updatedRecord, variables) => {
            // Invalidate all daily lesson queries
            queryClient.invalidateQueries({ queryKey: [DAILY_LESSON_QUERY_KEY] });

            // Update specific cache entry
            queryClient.setQueryData(
                [DAILY_LESSON_QUERY_KEY, variables.id],
                updatedRecord
            );

            // Update today's record if this is today's record
            const today = new Date().toISOString().split('T')[0];
            const recordDate = new Date(updatedRecord.date).toISOString().split('T')[0];
            if (recordDate === today) {
                queryClient.setQueryData(
                    [DAILY_LESSON_QUERY_KEY, 'user', address, 'date', today],
                    updatedRecord
                );
            }

            // Invalidate user data and progress
            queryClient.invalidateQueries({ queryKey: ['users', address] });
            queryClient.invalidateQueries({ queryKey: ['userProgress', address] });
        },
    });
};

// DELETE /api/daily-lessons/:id - Delete a daily lesson record
export const useDeleteDailyLesson = () => {
    const queryClient = useQueryClient();
    const { address, isConnected } = useAccount();

    return useMutation<void, Error, string>({
        mutationFn: async (id) => {
            if (!isConnected || !address) {
                throw new Error('User not connected');
            }
            await apiClient.delete(`/api/daily-lessons/${id}`);
        },
        onSuccess: (data, deletedId) => {
            // Invalidate all daily lesson queries
            queryClient.invalidateQueries({ queryKey: [DAILY_LESSON_QUERY_KEY] });

            // Remove from cache
            queryClient.removeQueries({ queryKey: [DAILY_LESSON_QUERY_KEY, deletedId] });

            // Invalidate user data
            queryClient.invalidateQueries({ queryKey: ['users', address] });
        },
    });
};

// Utility hook to track today's lesson progress
export const useTodayLessonProgress = () => {
    const { data: todayRecord, isLoading, error } = useGetTodayLessonRecord();
    const incrementMutation = useIncrementDailyLesson();
    const createMutation = useCreateOrUpdateDailyLesson();
    const { address } = useAccount();

    const incrementTodayLessons = async (amount: number = 1) => {
        const today = new Date().toISOString().split('T')[0];

        if (todayRecord) {
            // Record exists, increment it
            return incrementMutation.mutateAsync({
                id: todayRecord.id,
                payload: { amount }
            });
        } else {
            // No record exists, create one
            if (!address) throw new Error('User not connected');
            return createMutation.mutateAsync({
                userId: address,
                date: today,
                lessonsCompleted: amount
            });
        }
    };

    return {
        todayRecord,
        isLoading: isLoading || incrementMutation.isPending || createMutation.isPending,
        error: error || incrementMutation.error || createMutation.error,
        incrementTodayLessons,
        lessonsCompletedToday: todayRecord?.lessonsCompleted || 0,
    };
};