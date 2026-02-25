import React from 'react';
import { useStoreWithEqualityFn } from 'zustand/traditional'; // if needed
import useHabitStore from '../store/useHabitStore';
import { useTaskCardStore } from '../store/useTaskCardStore';

export const DebugUndo = () => {
  // ✅ Access the temporal store correctly via .temporal
  const habitPastLength = useHabitStore.temporal(
    (state) => state.pastStates.length
  );
  const habitFutureLength = useHabitStore.temporal(
    (state) => state.futureStates.length
  );
  const taskPastLength = useTaskCardStore.temporal(
    (state) => state.pastStates.length
  );
  const taskFutureLength = useTaskCardStore.temporal(
    (state) => state.futureStates.length
  );

  return (
    <div
      style={{
        position: 'fixed',
        bottom: 10,
        right: 10,
        background: 'black',
        color: 'white',
        padding: 10,
        zIndex: 9999,
      }}
    >
      <div>Habit Past: {habitPastLength}</div>
      <div>Habit Future: {habitFutureLength}</div>
      <div>Task Past: {taskPastLength}</div>
      <div>Task Future: {taskFutureLength}</div>
    </div>
  );
};
