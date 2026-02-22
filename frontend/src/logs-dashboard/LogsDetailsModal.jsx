import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { IoClose, IoChevronDown, IoChevronForward } from 'react-icons/io5';

const MOCK_LOG_DETAIL = {
    clientIp: "127.0.0.1",
    duration: 42,
    level: "error",
    message: "Failed to update profile",
    method: "POST",
    path: "/api/users/696f67451c6f749763a1e3b7/profile",
    statusCode: 400,
    timestamp: "2026-02-22T10:30:00.000Z",
    userAgent: "Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/144.0.0.0",
    userId: "696f67451c6f749763a1e3b7",
    request: {
        headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer eyJhbGci..."
        },
        query: { "source": "web" },
        params: { "id": "696f67451c6f749763a1e3b7" },
        body: {
            "username": "developer_pro",
            "email": "invalid-email-format"
        }
    },
    response: {
        headers: { "Content-Type": "application/json" },
        body: {
            "success": false,
            "message": "Validation failed",
            "errors": ["email is not a valid email address"]
        }
    },
    error: "ValidationError: User update failed at line 42 in user.service.js"
};

function CollapsibleSection({ title, MOCK_LOG_DETAIL }) {
    const [isOpen, setIsOpen] = useState(false);
    const { t, i18n } = useTranslation();
    const isRtl = i18n.language === 'fa';

    return (
        <div className="border border-indigo-100 dark:border-slate-800 rounded-lg overflow-hidden transition-colors">
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="w-full flex items-center justify-between px-4 py-3 bg-white dark:bg-slate-900 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
            >
                <span className="text-sm font-bold capitalize text-indigo-900 dark:text-indigo-300">
                    {t(title)}
                </span>
                <div className={`text-indigo-400 dark:text-indigo-500 transform ${isRtl && !isOpen ? 'rotate-180' : ''}`}>
                    {isOpen ? <IoChevronDown size={20} /> : <IoChevronForward size={20} />}
                </div>
            </button>

            {isOpen && (
                <div className="p-4 bg-slate-50 dark:bg-slate-950 border-t border-indigo-100 dark:border-slate-800 overflow-x-auto">
                    <pre className="text-sm text-indigo-700 dark:text-indigo-400 font-mono leading-relaxed text-left" dir="ltr">
                        <code>{JSON.stringify(MOCK_LOG_DETAIL, null, 2)}</code>
                    </pre>
                </div>
            )}
        </div>
    );
}

export default function LogsDetailsModal({ isOpen, onClose }) {
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
                        <p className="text-xs text-indigo-400 dark:text-indigo-500 font-mono" dir="ltr">{MOCK_LOG_DETAIL.timestamp}</p>
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
                        <h3 className="text-[12px] font-bold text-indigo-900 dark:text-indigo-300 capitalize mb-1 mx-1">{t("Request Path")}</h3>
                        <div className="p-3 bg-indigo-50/50 dark:bg-slate-950 rounded-lg border border-indigo-100 dark:border-slate-800 font-mono text-sm text-indigo-900 dark:text-indigo-200 break-all text-left" dir="ltr">
                            <span className={`font-bold ${isRtl ? 'ml-2' : 'mr-2'} text-indigo-600 dark:text-indigo-400`}>{MOCK_LOG_DETAIL.method}</span>
                            {MOCK_LOG_DETAIL.path}
                        </div>
                    </div>

                    <CollapsibleSection title="Request Details (Headers & Body)" MOCK_LOG_DETAIL={MOCK_LOG_DETAIL.request} />
                    <CollapsibleSection title="Response Details" MOCK_LOG_DETAIL={MOCK_LOG_DETAIL.response} />
                    <CollapsibleSection
                        title="System Metadata"
                        MOCK_LOG_DETAIL={{
                            clientIp: MOCK_LOG_DETAIL?.clientIp,
                            userAgent: MOCK_LOG_DETAIL?.userAgent,
                            duration: `${MOCK_LOG_DETAIL?.duration}ms`,
                            statusCode: MOCK_LOG_DETAIL?.statusCode
                        }}
                    />

                    {MOCK_LOG_DETAIL?.error && (
                        <div className="p-4 bg-red-50 dark:bg-red-900/10 border border-red-100 dark:border-red-900/20 rounded-lg mt-4 text-start">
                            <h3 className="text-sm font-bold text-red-600 dark:text-red-400 capitalize mb-1">{t("Error Information")}</h3>
                            <p className="text-sm text-red-800 dark:text-red-300 font-mono italic text-left" dir="ltr">{MOCK_LOG_DETAIL.error}</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
