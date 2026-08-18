import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  UsersIcon,
  ClockIcon,
  UserIcon
} from '@heroicons/react/24/outline';
import { type Activity } from '../../types/activity';

interface ActivityDetailInfoProps {
  activity: Activity;
}

const ActivityDetailInfo: React.FC<ActivityDetailInfoProps> = ({ activity }) => {
  const { t } = useTranslation();

  const highlights = activity.highlights || [];
  const equipmentNotes = activity.equipmentNotes || [];
  const guideLanguages = activity.guideLanguages || [];

  return (
    <div className="bg-white rounded-2xl border border-gray-200 p-6 sm:p-8 shadow-sm">
      {/* Title & Price */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#2d4b5a] mb-3">
          {activity.title}
        </h2>
        <div className="flex flex-col items-baseline mb-5">
          <span className="text-[#2d4b5a] text-2xl font-semibold">
            +{activity.price}
          </span>
          <span className="text-[#6b7280] text-lg mt-1">
            {t(`activity.units.${activity.unit}`, { count: activity.unitCount || 0 })}
          </span>
        </div>
      </div>

      {/* Content: driven by detailMode from backend/data (standard vs package) */}
      {activity.detailMode === 'package' ? (
        <div className="space-y-4 mb-8">
          {activity.packageSubtitle && (
            <h3 className="text-xl sm:text-2xl font-semibold text-[#2d4b5a] leading-snug">
              {t(`activity.${activity.packageSubtitle}`)}
            </h3>
          )}
          {activity.packageItems && activity.packageItems.length > 0 && (
            <div className="text-[#6b7280] text-base sm:text-lg space-y-2 leading-relaxed pt-2">
              {activity.packageItems.map((item, i) => (
                <p key={i}>{t(`activity.${item}`)}</p>
              ))}
            </div>
          )}
        </div>
      ) : (
        <>
          {/* Highlights (capacity, duration, age) */}
          <div className="space-y-3 mb-5">
            {activity.capacityNote && (
              <div className="flex items-center gap-3 text-[#6b7280]">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <UsersIcon className="w-4 h-4 text-[#2d4b5a]" />
                </div>
                <span className="text-sm">{t(`activity.${activity.capacityNote}`)}</span>
              </div>
            )}
            {activity.duration && (
              <div className="flex items-center gap-3 text-[#6b7280]">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <ClockIcon className="w-4 h-4 text-[#2d4b5a]" />
                </div>
                <span className="text-sm">
                  {t('activity.durationLabel')} : {activity.duration}
                </span>
              </div>
            )}
            {activity.ageRange && (
              <div className="flex items-center gap-3 text-[#6b7280]">
                <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center shrink-0">
                  <UserIcon className="w-4 h-4 text-[#2d4b5a]" />
                </div>
                <span className="text-sm">
                  {t('activity.ageLabel')} {activity.ageRange}
                </span>
              </div>
            )}
          </div>

          {/* Highlights description */}
          {highlights.length > 0 && (
            <div className="text-sm text-[#6b7280] space-y-1 mb-8">
              {guideLanguages.length > 0 && (
                <p>
                  {t('activity.liveGuide')}: {guideLanguages.join(', ')}
                </p>
              )}
              {highlights.slice(0, 4).map((key) => (
                <p key={key}>{t(`activity.${key}`)}</p>
              ))}
            </div>
          )}
        </>
      )}

      {/* GoPro Film Section */}
      {activity.hasGoPro && (
        <div className="border-t border-gray-200 pt-6">
          <h3 className="text-xl font-bold text-[#2d4b5a] mb-3">
            {t('activity.goproFilm.title')}
          </h3>
          <p className="text-sm text-[#6b7280] mb-2">
            {activity.goproLabelKey ? t(`activity.${activity.goproLabelKey}`) : t('activity.goproFilm.service')}
          </p>
          <div className="flex flex-col items-baseline">
            <span className="text-[#2d4b5a] text-2xl font-semibold">
              +{activity.goproPrice}
            </span>
            <span className="text-[#6b7280] text-lg mt-1">
              {t(`activity.units.${activity.goproUnit || 'person'}`, { count: activity.unitCount || 0 })}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ActivityDetailInfo;
