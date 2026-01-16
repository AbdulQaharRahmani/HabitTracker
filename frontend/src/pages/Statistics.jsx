import DayilyConsistency from '../components/DailyConsistency'
import Header from '../components/Header'
import ExportData from '../components/ExportData';
import TotalHabitsStatics from '../components/TotalHabitsStatics';
import CurrentStreakStatics from '../components/CurrentStreakStatics';
import CompletionRateStatics from '../components/CompletionRateStatics';
import useHabitStore from "../store/useHabitStore";

function Statistics() {
  const habits = useHabitStore((state) => state.habits);
  const totalHabits = habits.length;

  return (
    <div className="">
      <div className="grid grid-cols-2 justify-between my-2 items-center mr-9">
        <Header
          title={"Your Progress"}
          subtitle={"Overview of your consistency and growth."}
        />
        <span className="pt-6 ml-auto">
          <ExportData />
        </span>
      </div>

      <div className="my-4 flex items-center gap-6 ml-7 mr-9">
        <TotalHabitsStatics totalHabits={totalHabits}/>
        <CurrentStreakStatics currentStreak='5' />
        <CompletionRateStatics completionRate='75'/>
      </div>
      <div className='mx-7'>
        <DayilyConsistency />
      </div>
    </div>
  );
}

export default Statistics
