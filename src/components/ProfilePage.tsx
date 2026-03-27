import React, { useState } from 'react';
import { CalendarDays, Download, Mail, ShieldCheck, Sparkles, Trophy, UserRound } from 'lucide-react';
import { useUser } from '../contexts/UserContext';
import { games, lessons } from '../data/learningContent';
import { RobotAvatar, getAvatarOptionById } from '../lib/avatarOptions';
import { downloadMiniAICertificate } from '../lib/certificate';
import BadgeDisplay from './dashboard/BadgeDisplay';
import CharacterEvolution from './dashboard/CharacterEvolution';
import ProgressBar from './dashboard/ProgressBar';

const rankMilestones = [
  { threshold: 0, label: 'Beginner' },
  { threshold: 10, label: 'AI Scout' },
  { threshold: 20, label: 'AI Starter' },
  { threshold: 30, label: 'AI Explorer' },
  { threshold: 40, label: 'AI Builder' },
  { threshold: 50, label: 'AI Thinker' },
  { threshold: 60, label: 'AI Solver' },
  { threshold: 70, label: 'AI Mentor' },
  { threshold: 80, label: 'AI Wizard' },
  { threshold: 90, label: 'AI Champion' },
  { threshold: 100, label: 'AI Master' },
];

const ProfilePage: React.FC = () => {
  const { user } = useUser();
  const [isDownloadingCertificate, setIsDownloadingCertificate] = useState(false);

  if (!user) {
    return null;
  }

  const totalActivities = lessons.length + games.length;
  const completedActivities = user.completedLessons.length + user.completedGames.length;
  const progressPercentage = totalActivities > 0 ? (completedActivities / totalActivities) * 100 : 0;
  const roundedProgress = Math.min(100, Math.floor(progressPercentage / 10) * 10);
  const currentRank =
    [...rankMilestones].reverse().find((rank) => roundedProgress >= rank.threshold)?.label ?? 'Beginner';
  const completedLessonTitles = lessons
    .filter((lesson) => user.completedLessons.includes(lesson.id))
    .map((lesson) => lesson.title);
  const completedGameTitles = games
    .filter((game) => user.completedGames.includes(game.id))
    .map((game) => game.title);
  const avatar = getAvatarOptionById(user.avatar);
  const hasCompletedEverything =
    user.completedLessons.length === lessons.length && user.completedGames.length === games.length;

  return (
    <div className="space-y-8">
      <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-sky-200">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-sky-100 px-4 py-2 text-sm font-semibold text-sky-700">
              <UserRound className="w-4 h-4" />
              Your Account
            </div>
            <h1 className="mt-4 text-4xl font-bold text-gray-800">Progress & Profile</h1>
            <p className="mt-2 text-lg text-gray-600">
              See your account details, learning journey, and everything you have completed so far.
            </p>
          </div>
          <CharacterEvolution user={user} />
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-8">
        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-emerald-200">
            <div className="flex items-center gap-3 mb-6">
              <Sparkles className="w-8 h-8 text-emerald-600" />
              <h2 className="text-3xl font-bold text-gray-800">Learning Progress</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
              <div className="rounded-2xl bg-gradient-to-br from-emerald-100 to-emerald-200 p-5 text-center">
                <div className="text-3xl font-bold text-emerald-700">{user.xp}</div>
                <div className="text-emerald-700 font-medium">Total XP</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-yellow-100 to-yellow-200 p-5 text-center">
                <div className="text-3xl font-bold text-yellow-700">{user.level}</div>
                <div className="text-yellow-700 font-medium">Current Level</div>
              </div>
              <div className="rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 p-5 text-center">
                <div className="text-3xl font-bold text-purple-700">{user.badges.length}</div>
                <div className="text-purple-700 font-medium">Badges Earned</div>
              </div>
            </div>

            <div className="mb-8 rounded-3xl border-2 border-indigo-200 bg-gradient-to-r from-indigo-50 via-sky-50 to-cyan-50 p-6">
              <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.25em] text-indigo-600">Current Rank</p>
                  <h3 className="mt-2 text-3xl font-bold text-gray-800">{currentRank}</h3>
                  <p className="mt-2 text-gray-600">
                    Your rank updates every 10% of total platform progress, from Beginner all the way to AI Master.
                  </p>
                </div>
                <div className="rounded-2xl bg-white/80 px-5 py-4 text-center shadow-sm">
                  <div className="text-3xl font-bold text-indigo-700">{Math.round(progressPercentage)}%</div>
                  <div className="text-sm font-medium text-indigo-600">Overall Completion</div>
                </div>
              </div>
            </div>

            <ProgressBar
              progress={progressPercentage}
              totalActivities={totalActivities}
              completedActivities={completedActivities}
            />

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="rounded-2xl border border-cyan-200 bg-cyan-50 p-5">
                <h3 className="text-xl font-bold text-cyan-800 mb-3">Completed Lessons</h3>
                {completedLessonTitles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {completedLessonTitles.map((title) => (
                      <span
                        key={title}
                        className="rounded-full bg-white px-3 py-2 text-sm font-medium text-cyan-700 shadow-sm"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-cyan-700">No lessons completed yet.</p>
                )}
              </div>

              <div className="rounded-2xl border border-orange-200 bg-orange-50 p-5">
                <h3 className="text-xl font-bold text-orange-800 mb-3">Completed Games</h3>
                {completedGameTitles.length > 0 ? (
                  <div className="flex flex-wrap gap-2">
                    {completedGameTitles.map((title) => (
                      <span
                        key={title}
                        className="rounded-full bg-white px-3 py-2 text-sm font-medium text-orange-700 shadow-sm"
                      >
                        {title}
                      </span>
                    ))}
                  </div>
                ) : (
                  <p className="text-orange-700">No games completed yet.</p>
                )}
              </div>
            </div>
          </div>

          <BadgeDisplay badges={user.badges} />
        </div>

        <div className="space-y-8">
          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-violet-200">
            <div className="flex items-center gap-3 mb-6">
              <ShieldCheck className="w-8 h-8 text-violet-600" />
              <h2 className="text-3xl font-bold text-gray-800">Account Details</h2>
            </div>

            <div className="space-y-4">
              <div className="rounded-2xl bg-violet-50 p-4 border border-violet-100">
                <p className="text-sm font-semibold text-violet-700">Name</p>
                <p className="mt-1 text-lg font-bold text-gray-800">{user.name}</p>
              </div>
              <div className="rounded-2xl bg-sky-50 p-4 border border-sky-100">
                <div className="flex items-center gap-2 text-sky-700">
                  <Mail className="w-4 h-4" />
                  <p className="text-sm font-semibold">Email</p>
                </div>
                <p className="mt-1 text-lg font-bold text-gray-800 break-all">{user.email}</p>
              </div>
              <div className="rounded-2xl bg-amber-50 p-4 border border-amber-100">
                <p className="text-sm font-semibold text-amber-700">Age</p>
                <p className="mt-1 text-lg font-bold text-gray-800">{user.age}</p>
              </div>
              <div className="rounded-2xl bg-emerald-50 p-4 border border-emerald-100">
                <p className="text-sm font-semibold text-emerald-700">Avatar</p>
                <div className="mt-2 flex items-center gap-4">
                  <div className="inline-flex h-16 w-16 items-center justify-center rounded-[1.5rem] bg-white shadow-sm">
                    <RobotAvatar avatarId={user.avatar} size="md" />
                  </div>
                  <div>
                    <p className="text-lg font-bold text-gray-800">{avatar.name}</p>
                    <p className="text-sm text-gray-600">{avatar.title}</p>
                  </div>
                </div>
              </div>
              <div className="rounded-2xl bg-rose-50 p-4 border border-rose-100">
                <p className="text-sm font-semibold text-rose-700">Parental Consent</p>
                <p className="mt-1 text-lg font-bold text-gray-800">
                  {user.parentalConsent ? 'Yes, permission was given' : 'No parental consent selected'}
                </p>
              </div>
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <div className="flex items-center gap-2 text-slate-700">
                  <CalendarDays className="w-4 h-4" />
                  <p className="text-sm font-semibold">Joined</p>
                </div>
                <p className="mt-1 text-lg font-bold text-gray-800">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-yellow-200">
            <div className="flex items-center gap-3 mb-4">
              <Trophy className="w-8 h-8 text-yellow-600" />
              <h2 className="text-2xl font-bold text-gray-800">Profile Snapshot</h2>
            </div>
            <p className="text-gray-600 leading-7">
              {user.name} is currently ranked as {currentRank}, with {user.xp} XP, {completedActivities}
              {' '}completed activities, and {user.badges.length} earned badge{user.badges.length === 1 ? '' : 's'}.
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-emerald-200">
            <div className="flex items-center gap-3 mb-4">
              <Download className="w-8 h-8 text-emerald-600" />
              <h2 className="text-2xl font-bold text-gray-800">Completion Certificate</h2>
            </div>
            <p className="text-gray-600 leading-7">
              {hasCompletedEverything
                ? 'You finished every lesson and challenge. Your MiniAI completion certificate is ready to download as a PDF.'
                : 'Finish every lesson and every AI challenge to unlock your downloadable MiniAI completion certificate.'}
            </p>
            <button
              type="button"
              disabled={!hasCompletedEverything || isDownloadingCertificate}
              onClick={async () => {
                if (!hasCompletedEverything) return;
                setIsDownloadingCertificate(true);
                try {
                  await downloadMiniAICertificate(user.name);
                } finally {
                  setIsDownloadingCertificate(false);
                }
              }}
              className={`mt-5 w-full rounded-2xl px-5 py-4 text-lg font-bold transition ${
                hasCompletedEverything && !isDownloadingCertificate
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-white shadow-lg hover:scale-[1.01]'
                  : 'cursor-not-allowed bg-slate-200 text-slate-500'
              }`}
            >
              {isDownloadingCertificate
                ? 'Preparing certificate...'
                : hasCompletedEverything
                  ? 'Download PDF Certificate'
                  : 'Certificate Locked'}
            </button>
          </div>

          <div className="bg-white rounded-3xl shadow-xl p-8 border-4 border-indigo-200">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Rank Ladder</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {rankMilestones.map((rank) => (
                <div
                  key={rank.threshold}
                  className={`rounded-2xl border px-4 py-3 ${
                    roundedProgress >= rank.threshold
                      ? 'border-indigo-300 bg-indigo-50 text-indigo-800'
                      : 'border-slate-200 bg-slate-50 text-slate-600'
                  }`}
                >
                  <p className="text-sm font-semibold">{rank.threshold}%</p>
                  <p className="text-lg font-bold">{rank.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
