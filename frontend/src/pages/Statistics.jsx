import DayilyConsistency from '../components/DailyConsistency'
import Header from '../components/Header'
import ExportData from '../components/ExportData';
import TotalHabitsStatics from '../components/TotalHabitsStatics';
import CurrentStreakStatics from '../components/CurrentStreakStatics';
import CompletionRateStatics from '../components/CompletionRateStatics';
import i18n from '../utils/i18n';
import { useTranslation } from "react-i18next";
import StatisticsChart from '../components/StatisticsChart'

function Statistics() {
  const { t } = useTranslation();
  const isRTL = i18n.language === "fa";

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

  return (
    <div className="">
      <div className={`flex justify-between my-2 items-center mx-9 xxs:ml-0`}>
        <Header
          title={t("Your Progress")}
          subtitle={t("Overview of your consistency and growth.")}
        />
        <span className={`pt-9`}>
          <ExportData />
        </span>
      </div>

      <div className="my-4">
        <div className="flex items-center lg:gap-6 ml-7  mr-9 md:gap-2 sm:gap-2 md:flex xxs:grid xxs:grid-rows-3 xxs:gap-4 xxs:ml-7">
          <TotalHabitsStatics totalHabits={formatNumber(10)} />
          <CurrentStreakStatics currentStreak={formatNumber(5)} />
          <CompletionRateStatics completionRate={formatNumber(75)} />
        </div>
      </div>
      <div className="ml-7 ">
        <DayilyConsistency />
        <StatisticsChart />
      </div>
    </div>
  );
}

export default Statistics