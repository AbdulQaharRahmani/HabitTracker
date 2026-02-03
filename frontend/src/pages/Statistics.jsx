import Header from '../components/Header'
import ExportData from '../components/ExportData';
import TotalHabitsStatics from '../components/TotalHabitsStatics';
import CurrentStreakStatics from '../components/CurrentStreakStatics';
import CompletionRateStatics from '../components/CompletionRateStatics';
import i18n from '../utils/i18n';
import { useTranslation } from "react-i18next";
import StatisticsChart from '../components/StatisticsChart'
import DailyConsistency from '../components/DailyConsistency';

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

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 my-6">
        <TotalHabitsStatics totalHabits={formatNumber(10)} />
        <CurrentStreakStatics currentStreak={formatNumber(5)} />
        <CompletionRateStatics completionRate={formatNumber(75)} />
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
