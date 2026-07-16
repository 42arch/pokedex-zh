import type { AbilityDetail } from '@/services/pokemon'
import { InfoIcon, ShieldCheckIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import * as React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { translateText } from '@/lib/chinese'
import { cn, getLocalizedPath } from '@/lib/utils'

export function AbilityDetailView({ activeDetail, locale }: { activeDetail: AbilityDetail, locale: string }) {
  return (
    <div className="relative h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
        <Link prefetch={false} href={getLocalizedPath('/abilities', locale)} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <span>←</span>
          {' '}
          {translateText('返回特性列表', locale)}
        </Link>
      </div>

      {/* Content view */}
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">

        {/* Header profile block */}
        <div
          className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col gap-3 p-4 md:p-6"
          style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.15))' }}
        >
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/45 backdrop-blur-xl -z-10" />

          {/* Floating background Poke Ball */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 text-black/[0.03] dark:text-white/[0.02] pointer-events-none -z-10">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="px-3.5 py-1 text-xs font-bold rounded-full bg-red-500/10 dark:bg-red-500/25 text-red-500 shadow-sm border border-red-500/10">
              {translateText('宝可梦特性', locale)}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
              {translateText(activeDetail.name_zh, locale)}
            </h1>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {activeDetail.name_en}
              {' '}
              ·
              {activeDetail.name_ja}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/60 dark:bg-black/15 shadow-sm border border-white/20 dark:border-white/5 text-sm font-semibold leading-relaxed text-zinc-800 dark:text-zinc-200">
            {translateText(activeDetail.description, locale)}
          </div>
        </div>

        {/* Detailed effect text */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-zinc-400" />
            {translateText('对战效果详情', locale)}
          </h3>

          <div className="space-y-4 text-sm font-medium text-zinc-600 dark:text-zinc-300 leading-relaxed">
            <div className="space-y-1">
              <h4 className="font-bold text-xs uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                {translateText('对战中效果', locale)}
              </h4>
              <p className="whitespace-pre-wrap">{translateText(activeDetail.effect, locale)}</p>
            </div>

            {activeDetail.detail_effect && activeDetail.detail_effect !== activeDetail.effect && (
              <div className="space-y-1 pt-3 border-t border-zinc-150/40 dark:border-zinc-850">
                <h4 className="font-bold text-xs uppercase text-zinc-400 dark:text-zinc-500 tracking-wider">
                  {translateText('详细细则/额外说明', locale)}
                </h4>
                <p className="whitespace-pre-wrap text-xs text-zinc-500 dark:text-zinc-400">{translateText(activeDetail.detail_effect, locale)}</p>
              </div>
            )}
          </div>
        </div>

        {/* Pokemons possess this ability */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-zinc-400" />
            {translateText('拥有该特性的宝可梦', locale)}
          </h3>

          <ScrollArea className="h-96 pr-2">
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pr-1">
              {activeDetail.pokemons.map((pk, idx) => (
                <Link
                  prefetch={false}
                  key={idx}
                  href={getLocalizedPath(`/pokemon/${pk.id.padStart(4, '0')}`, locale)}
                  className="flex flex-col gap-2 p-3.5 rounded-2xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm group"
                >
                  <div className="flex items-center justify-between gap-1">
                    <span className="font-mono text-[9px] font-bold text-zinc-450 dark:text-zinc-500">
                      #
                      {pk.id}
                    </span>
                    <span className={cn(
                      'text-[9px] font-bold px-1.5 py-0.5 rounded',
                      pk.is_hidden
                        ? 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-500'
                        : 'bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400',
                    )}
                    >
                      {translateText(pk.is_hidden ? '隐特性' : '普通', locale)}
                    </span>
                  </div>
                  <div className="min-w-0">
                    <p className="font-bold text-xs text-zinc-900 dark:text-zinc-50 group-hover:text-red-500 transition-colors truncate">
                      {translateText(pk.name, locale)}
                    </p>
                    {pk.form && (
                      <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate mt-0.5">
                        {translateText(pk.form, locale)}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </ScrollArea>
        </div>

      </div>
    </div>
  )
}

export function AbilityEmptyView({ locale }: { locale: string }) {
  return (
    <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5 animate-in fade-in">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-400 border border-zinc-200/50">
        ✨
      </div>
      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
        {translateText('请在左侧列表选择特性以查看详情', locale)}
      </p>
    </div>
  )
}
