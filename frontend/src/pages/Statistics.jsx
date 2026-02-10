import {useEffect} from 'react';
import DayilyConsistency from '../components/DailyConsistency'
import Header from '../components/Header'
import ExportData from '../components/ExportData';
import TotalHabitsStatics from '../components/TotalHabitsStatics';
import CurrentStreakStatics from '../components/CurrentStreakStatics';
import CompletionRateStatics from '../components/CompletionRateStatics';
import i18n from '../utils/i18n';
import { useTranslation } from "react-i18next";
import StatisticsChart from '../components/StatisticsChart'
import DailyConsistency from '../components/DailyConsistency';
import {useStatisticsStore} from '../store/useStatisticsStore';

function Statistics() {
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";

  const {
    totalHabits,
    currentStreak,
    completionRate,
    fetchStatistics,
    loading,
    error,
  } = useStatisticsStore(state=>state);


  useEffect(()=>{
     fetchStatistics();
  },[fetchStatistics])



  const persianDigits = ['۰','۱','۲','۳','۴','۵','۶','۷','۸','۹'];

  function convertToPersianDigits(str) {
    return str.replace(/\d/g, d => persianDigits[d]);
  }

  function formatNumber(value) {
    if (i18n.language === "fa") {
      return convertToPersianDigits(String(value));
    }
    return String(value);
  }

  if(loading){
    return (
     <div className="text-center text-gray-500 ">{t("Loading")}</div>
    )
  }
  if(error){
    return (
      <div className="text-center text-red-500">{error}</div>
    )
  }
  return (
    <div
      className="px-4 lg:px-9"
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <Header
          title={t("Your Progress")}
          subtitle={t("Overview of your consistency and growth.")}
        />
        <ExportData />
      </div>

      <div className="my-4">
        <div className="flex items-center sm:mr-0 lg:flex lg:gap-6  md:gap-2 sm:gap-2 md:grid-rows-3 xxs:grid xxs:grid-rows-3 xxs:gap-4">
          <TotalHabitsStatics totalHabits={formatNumber(totalHabits)} />
          <CurrentStreakStatics currentStreak={formatNumber(currentStreak)} />
          <CompletionRateStatics completionRate={formatNumber(completionRate)} />
        </div>
      </div>

      {/* Charts */}
      <div className="space-y-2">
        <DailyConsistency/>
        <StatisticsChart />
      </div>
    </div>
  );
}

export default Statistics
