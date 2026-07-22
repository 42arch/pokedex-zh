'use client'

import type { MoveDetail } from '@/services/pokemon'
import { InfoIcon, ShieldCheckIcon } from '@phosphor-icons/react'
import Link from 'next/link'
import * as React from 'react'
import { ScrollArea } from '@/components/ui/scroll-area'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useMoveDetail } from '@/hooks/use-pokemon-queries'
import { translateText } from '@/lib/chinese'
import { getGenerationName, getTypeColor } from '@/lib/pokemon-helpers'
import { cn, getLocalizedPath } from '@/lib/utils'
import { CategoryBadge, TypeBadge } from './type-badge'

export function MoveDetailView({ activeDetail, locale }: { activeDetail: MoveDetail, locale: string }) {
  return (
    <div className="relative h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
        <Link prefetch={false} href={getLocalizedPath('/moves', locale)} className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400">
          <span>←</span>
          {' '}
          {translateText('返回招式列表', locale)}
        </Link>
      </div>

      {/* Move Detail View */}
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 animate-in fade-in duration-200">

        {/* Header profile block */}
        <div
          className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col gap-3.5 p-4 md:p-6"
          style={{ background: `linear-gradient(135deg, ${getTypeColor(activeDetail.type)}15, ${getTypeColor(activeDetail.type)}25)` }}
        >
          <div className="absolute inset-0 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl -z-10" />

          {/* Floating background Poke Ball */}
          <div className="absolute -right-16 -bottom-16 w-64 h-64 text-black/[0.03] dark:text-white/[0.02] pointer-events-none -z-10">
            <svg viewBox="0 0 24 24" fill="currentColor" className="w-full h-full">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <TypeBadge type={activeDetail.type} className="px-3.5 py-1 rounded-full text-xs" />
            <CategoryBadge category={activeDetail.category} className="px-3.5 py-1 rounded-full text-xs" />
            <span className="text-xs font-bold text-zinc-400 dark:text-zinc-500">
              {getGenerationName(parseInt(activeDetail.generation, 10) || 1, locale)}
            </span>
          </div>

          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50 drop-shadow-sm">
              {translateText(activeDetail.name_zh, locale)}
            </h1>
            <p className="text-xs font-semibold text-zinc-500 dark:text-zinc-400">
              {activeDetail.name_en}
              {' '}
              ·
              {activeDetail.name_ja}
            </p>
          </div>

          <div className="p-3 rounded-2xl bg-white/50 dark:bg-black/15 shadow-sm border border-white/20 dark:border-white/5 text-sm font-medium leading-relaxed text-zinc-700 dark:text-zinc-300">
            {translateText(activeDetail.description, locale)}
          </div>

          {/* Base Parameters grid */}
          <div className="grid grid-cols-3 gap-3 md:gap-4 text-center">
            <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">{translateText('威力', locale)}</span>
              <p className="font-black text-zinc-900 dark:text-zinc-50 mt-1 font-mono">{activeDetail.power}</p>
            </div>
            <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">{translateText('命中率', locale)}</span>
              <p className="font-black text-zinc-900 dark:text-zinc-50 mt-1 font-mono">
                {activeDetail.accuracy}
                %
              </p>
            </div>
            <div className="bg-white/70 dark:bg-zinc-900/50 backdrop-blur-sm p-2 rounded-xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm">
              <span className="text-[10px] font-bold text-zinc-450 dark:text-zinc-500 uppercase tracking-wider">PP</span>
              <p className="font-black text-zinc-900 dark:text-zinc-50 mt-1 font-mono">{activeDetail.pp}</p>
            </div>
          </div>
        </div>

        {/* Effect text */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-3">
          <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-zinc-400" />
            {translateText('效果说明', locale)}
          </h3>
          <p className="text-sm font-medium leading-relaxed text-zinc-600 dark:text-zinc-300">
            {translateText(activeDetail.effect, locale)}
          </p>
        </div>

        {/* Flags Grid (Contact, Priority, Snatch, Magic Coat etc.) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: '接触目标', val: activeDetail.makes_contact === '是' ? '接触' : '非接触', active: activeDetail.makes_contact === '是' },
            { label: '先制优先度', val: activeDetail.priority, active: parseInt(activeDetail.priority, 10) !== 0 },
            { label: '受守住影响', val: activeDetail.affected_by_protect === '是' ? '受影响' : '不受影响', active: activeDetail.affected_by_protect === '是' },
            { label: '受魔法反射影响', val: activeDetail.affected_by_magic_coat === '是' ? '可反射' : '不可反射', active: activeDetail.affected_by_magic_coat === '开' || activeDetail.affected_by_magic_coat === '是' },
          ].map((flag, idx) => (
            <div
              key={idx}
              className={cn(
                'p-3 rounded-2xl border text-center shadow-sm flex flex-col items-center justify-center gap-1 transition-all',
                flag.active
                  ? 'bg-zinc-900/5 dark:bg-zinc-100/5 border-zinc-900/10 dark:border-zinc-100/10 text-zinc-900 dark:text-zinc-50'
                  : 'bg-transparent border-zinc-100 dark:border-zinc-900 text-zinc-400 dark:text-zinc-500',
              )}
            >
              <span className="text-[10px] font-bold uppercase tracking-wider">{translateText(flag.label, locale)}</span>
              <p className="font-black text-sm mt-0.5">{translateText(flag.val, locale)}</p>
            </div>
          ))}
        </div>

        {/* Learnable Pokemons List */}
        <div className="bg-white dark:bg-zinc-950 p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
            <ShieldCheckIcon className="w-5 h-5 text-zinc-400" />
            {translateText('可学会该招式的宝可梦', locale)}
          </h3>

          <Tabs defaultValue="level-learn">
            <TabsList className="bg-zinc-100 dark:bg-zinc-900 p-1 rounded-xl h-9">
              <TabsTrigger value="level-learn" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('等级提升', locale)}</TabsTrigger>
              <TabsTrigger value="machine-learn" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('招式学习器', locale)}</TabsTrigger>
              <TabsTrigger value="egg-learn" className="rounded-lg text-xs font-bold cursor-pointer py-1">{translateText('遗传招式', locale)}</TabsTrigger>
            </TabsList>

            {/* Level Learn list */}
            <TabsContent value="level-learn" className="mt-3">
              <ScrollArea className="h-64 pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                  {activeDetail.pokemons.flatMap(p =>
                    p.level_learn.map(l => ({
                      form: p.form,
                      level: l.level,
                      id: l.id,
                      name: l.name,
                    })),
                  ).map((pk, idx) => (
                    <Link
                      prefetch={false}
                      key={idx}
                      href={getLocalizedPath(`/pokemon/${encodeURIComponent(translateText(pk.name, locale))}`, locale)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm"
                    >
                      <span className="font-mono text-[10px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md">
                        {pk.level}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {translateText(pk.name, locale)}
                        </p>
                        {pk.form && pk.form !== '一般' && (
                          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate">
                            {translateText(pk.form, locale)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Machine Learn list */}
            <TabsContent value="machine-learn" className="mt-3">
              <ScrollArea className="h-64 pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                  {activeDetail.pokemons.flatMap(p =>
                    p.machine_learn.map(m => ({
                      form: p.form,
                      machine: m.machine,
                      id: m.id,
                      name: m.name,
                    })),
                  ).map((pk, idx) => (
                    <Link
                      prefetch={false}
                      key={idx}
                      href={getLocalizedPath(`/pokemon/${encodeURIComponent(translateText(pk.name, locale))}`, locale)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm"
                    >
                      <span className="font-mono text-[9px] font-bold bg-zinc-100 dark:bg-zinc-900 text-zinc-500 dark:text-zinc-400 px-1.5 py-0.5 rounded-md">
                        {translateText(pk.machine, locale)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {translateText(pk.name, locale)}
                        </p>
                        {pk.form && pk.form !== '一般' && (
                          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate">
                            {translateText(pk.form, locale)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>

            {/* Egg Learn list */}
            <TabsContent value="egg-learn" className="mt-3">
              <ScrollArea className="h-64 pr-2">
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pr-1">
                  {activeDetail.pokemons.flatMap(p =>
                    p.egg_learn.map(e => ({
                      form: p.form,
                      id: e.id,
                      name: e.name,
                    })),
                  ).map((pk, idx) => (
                    <Link
                      prefetch={false}
                      key={idx}
                      href={getLocalizedPath(`/pokemon/${encodeURIComponent(translateText(pk.name, locale))}`, locale)}
                      className="flex items-center gap-3 p-2.5 rounded-xl border border-zinc-150/40 dark:border-zinc-850 hover:bg-zinc-50 dark:hover:bg-zinc-900/30 hover:border-zinc-300 transition-all shadow-sm"
                    >
                      <span className="text-[9px] font-bold text-zinc-400 dark:text-zinc-500 bg-zinc-100 dark:bg-zinc-900 px-1.5 py-0.5 rounded-md">
                        {translateText('遗传', locale)}
                      </span>
                      <div className="min-w-0">
                        <p className="font-bold text-xs text-zinc-900 dark:text-zinc-100 truncate">
                          {translateText(pk.name, locale)}
                        </p>
                        {pk.form && pk.form !== '一般' && (
                          <p className="text-[9px] text-zinc-400 dark:text-zinc-500 font-bold truncate">
                            {translateText(pk.form, locale)}
                          </p>
                        )}
                      </div>
                    </Link>
                  ))}
                </div>
              </ScrollArea>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export function MoveEmptyView({ locale }: { locale: string }) {
  return (
    <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5 animate-in fade-in">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-400 border border-zinc-200/50">
        ⚡
      </div>
      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
        {translateText('请在左侧列表选择招式以查看详情', locale)}
      </p>
    </div>
  )
}

export function MoveDetailClient({ activeName, locale }: { activeName: string, locale: string }) {
  const { data: activeDetail, isLoading } = useMoveDetail(activeName)

  if (!activeName) {
    return <MoveEmptyView locale={locale} />
  }

  if (isLoading) {
    return (
      <div className="p-4 md:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-6 animate-pulse">
        <div className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 p-6 bg-zinc-100/80 dark:bg-zinc-900/50 space-y-4">
          <div className="flex gap-2">
            <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
            <div className="h-6 w-16 bg-zinc-200 dark:bg-zinc-800 rounded-full" />
          </div>
          <div className="h-8 w-48 bg-zinc-200 dark:bg-zinc-800 rounded" />
          <div className="h-16 w-full bg-zinc-200/60 dark:bg-zinc-800/60 rounded-2xl" />
          <div className="grid grid-cols-3 gap-3">
            <div className="h-12 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl" />
            <div className="h-12 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl" />
            <div className="h-12 bg-zinc-200/80 dark:bg-zinc-800/80 rounded-xl" />
          </div>
        </div>
        <div className="p-6 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 bg-zinc-100/60 dark:bg-zinc-900/50 h-32" />
      </div>
    )
  }

  if (!activeDetail) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-center h-full">
        <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500">
          {translateText('未找到招式详情', locale)}
        </p>
      </div>
    )
  }

  return <MoveDetailView activeDetail={activeDetail} locale={locale} />
}
