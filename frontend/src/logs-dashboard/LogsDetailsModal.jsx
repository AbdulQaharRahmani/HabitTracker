import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose, IoChevronDown, IoChevronForward } from 'react-icons/io5';

function CollapsibleSection({ title, logsDetails, variant = "default" }) {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'fa';

    const isError = variant === "error";

    const containerStyles = isError
        ? "border border-red-200 dark:border-red-900/40"
        : "border border-indigo-100 dark:border-slate-800";

    const buttonStyles = isError
        ? "bg-red-50 dark:bg-red-950/20 hover:bg-red-100 dark:hover:bg-red-900/30"
        : "bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800";

    const titleStyles = isError
        ? "text-red-700 dark:text-red-400"
        : "text-indigo-900 dark:text-indigo-300";

    const contentStyles = isError
        ? "bg-red-50/40 dark:bg-red-950/10 border-t border-red-200 dark:border-red-900/40 text-red-700 dark:text-red-400"
        : "bg-slate-50 dark:bg-slate-950 border-t border-indigo-100 dark:border-slate-800 text-indigo-700 dark:text-indigo-400";

    return (
        <div className={`${containerStyles} rounded-lg overflow-hidden transition-colors`}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 transition-colors ${buttonStyles}`}
            >
                <span className={`text-sm font-bold capitalize ${titleStyles}`}>
                    {t(title)}
                </span>
                <div className={`transform ${isRtl && !isOpen ? 'rotate-180' : ''} ${isError ? 'text-red-400 dark:text-red-500' : 'text-indigo-400 dark:text-indigo-500'}`}>
                    {isOpen ? <IoChevronDown size={20} /> : <IoChevronForward size={20} />}
                </div>
            </button>

            {isOpen && (
                <div className={`p-4 overflow-x-auto ${contentStyles}`}>
                    <pre className="text-sm font-mono leading-relaxed text-left" dir="ltr">
                        <code>{JSON.stringify(logsDetails, null, 2)}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}

export default function LogsDetailsModal({ isOpen, onClose, logsDetails }) {
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'fa';

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6" dir={isRtl ? 'rtl' : 'ltr'}>
            <div className="absolute inset-0 bg-slate-950/40 dark:bg-black/60 backdrop-blur-sm" onClick={onClose} />

            <div className="relative flex flex-col w-full max-w-4xl max-h-[90vh] bg-white dark:bg-slate-900 rounded-xl shadow-2xl overflow-hidden border border-indigo-100 dark:border-slate-800">
                <div className="flex items-center justify-between px-6 py-4 border-b border-indigo-50 dark:border-slate-800 bg-white dark:bg-slate-900">
                    <div className="flex flex-col text-start">
                        <h2 className="text-lg font-bold text-indigo-900 dark:text-indigo-100">{t("Log Details")}</h2>
                        <p className="text-xs text-indigo-400 dark:text-indigo-500 font-mono" dir="ltr">
                            {logsDetails?.timestamp}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1.5 text-indigo-400 hover:text-indigo-600 dark:hover:text-indigo-200 transition-colors rounded-full hover:bg-indigo-50 dark:hover:bg-slate-800"
                    >
                        <IoClose size={26} />
                    </button>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-white dark:bg-slate-900 text-start">
                    <div className="mb-6">
                        <h3 className="text-[12px] font-bold text-indigo-900 dark:text-indigo-300 capitalize mb-1 mx-1">
                            {t("Request Path")}
                        </h3>
                        <div
                            className="p-3 bg-indigo-50/50 dark:bg-slate-950 rounded-lg border border-indigo-100 dark:border-slate-800 font-mono text-sm text-indigo-900 dark:text-indigo-200 break-all text-left"
                            dir="ltr"
                        >
                            <span className={`font-bold ${isRtl ? 'ml-2' : 'mr-2'} text-indigo-600 dark:text-indigo-400`}>
                                {logsDetails?.method}
                            </span>
                            {logsDetails?.path}
                        </div>
                    </div>

                    <CollapsibleSection title="Request Details (Headers & Body)" logsDetails={logsDetails?.request} />
                    <CollapsibleSection title="Response Details" logsDetails={logsDetails?.response} />
                    <CollapsibleSection
                        title="System Metadata"
                        logsDetails={{
                            clientIp: logsDetails?.clientIp,
                            userAgent: logsDetails?.userAgent,
                            duration: `${logsDetails?.duration}ms`,
                            statusCode: logsDetails?.statusCode
                        }}
                    />

                    {logsDetails?.error && (
                        <CollapsibleSection
                            title="Error Information"
                            logsDetails={logsDetails?.error}
                            variant="error"
                        />
                    )}
                </div>
            </div>
        </div>
    );
}
