// Example component using daily lesson hooks
import React from 'react';
import {
    useTodayLessonProgress,
    useGetUserLessonHistory,
    useGetDailyLessons
} from '@/app/hooks/useDailyLessonHooks';

const LessonTracker = () => {
    const {
        todayRecord,
        lessonsCompletedToday,
        incrementTodayLessons,
        isLoading
    } = useTodayLessonProgress();

    // Get last 7 days of lesson history
    const lastWeek = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];
    const today = new Date().toISOString().split('T')[0];

    const { data: weekHistory } = useGetUserLessonHistory(lastWeek, today);

    // Get all lesson records with pagination
    const { data: allLessons } = useGetDailyLessons({
        sortBy: 'date',
        order: 'desc',
        limit: 10,
        page: 1
    });

    const handleCompleteLesson = async () => {
        try {
            await incrementTodayLessons(1);
            console.log('Lesson completed!');
        } catch (error) {
            console.error('Failed to complete lesson:', error);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-xl font-bold mb-4">Daily Lesson Tracker</h2>

            {/* Today's Progress */}
            <div className="bg-slate-800 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Today's Progress</h3>
                <p>Lessons completed: {lessonsCompletedToday}</p>
                <button
                    onClick={handleCompleteLesson}
                    disabled={isLoading}
                    className="mt-2 bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
                >
                    {isLoading ? 'Loading...' : 'Complete Lesson'}
                </button>
            </div>

            {/* Week History */}
            <div className="bg-slate-800 p-4 rounded-lg mb-4">
                <h3 className="font-semibold mb-2">This Week ({weekHistory?.totalRecords || 0} days)</h3>
                {weekHistory?.data.map(record => (
                    <div key={record.id} className="flex justify-between py-1">
                        <span>{new Date(record.date).toLocaleDateString()}</span>
                        <span>{record.lessonsCompleted} lessons</span>
                    </div>
                ))}
            </div>

            {/* Recent Activity */}
            <div className="bg-slate-800 p-4 rounded-lg">
                <h3 className="font-semibold mb-2">Recent Activity</h3>
                {allLessons?.data.map(record => (
                    <div key={record.id} className="flex justify-between py-1">
                        <span>{record.user?.username || 'Unknown'}</span>
                        <span>{record.lessonsCompleted} lessons on {new Date(record.date).toLocaleDateString()}</span>
                    </div>
                ))}
                <div className="mt-2 text-sm text-slate-400">
                    Page {allLessons?.page} of {allLessons?.totalPages}
                    ({allLessons?.totalRecords} total records)
                </div>
            </div>
        </div>
    );
};

export default LessonTracker;