import DayilyConsistency from '../components/DailyConsistency'
import Header from '../components/Header'
import ExportData from '../components/ExportData';
import TotalHabitsStatics from '../components/TotalHabitsStatics';
import CurrentStreakStatics from '../components/CurrentStreakStatics';
import CompletionRateStatics from '../components/CompletionRateStatics';
import useHabitStore from "../store/useHabitStore";
import i18n from '../utils/i18n';
import { useTranslation } from "react-i18next";
import { useEffect } from 'react';

function Statistics() {
  const habits = useHabitStore((state) => state.habits);
  const fetchHabits = useHabitStore((state) => state.fetchHabits);
  const totalHabits = habits.length;
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";

  useEffect(() => {
  fetchHabits();
  }, [fetchHabits]);

  return (
    <div className="">
      <div className="grid grid-cols-2 justify-between my-2 items-center mr-9">
        <Header
          title={t("Your Progress")}
          subtitle={t("Overview of your consistency and growth.")}
        />
        <span className={`pt-6 ml-auto ${isRTL ? "mr-[26rem]" : "ml-auto"}`}>
          <ExportData />
        </span>
      </div>

      <div className="my-4">
        <div className="flex items-center lg:gap-6 ml-7  mr-9 md:gap-2 sm:gap-2 md:flex xxs:grid xxs:grid-rows-3 xxs:gap-4 xxs:ml-7">
          <TotalHabitsStatics totalHabits={totalHabits} />
          <CurrentStreakStatics currentStreak="5" />
          <CompletionRateStatics completionRate="75" />
        </div>
      </div>
      <div className="ml-7 ">
        <DayilyConsistency />
      </div>
    </div>
  );
}

export default Statistics
