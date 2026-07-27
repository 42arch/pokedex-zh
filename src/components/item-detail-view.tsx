import type { FlattenedItem } from './items-layout'
import { InfoIcon, TagIcon } from '@phosphor-icons/react/dist/ssr'
import Link from 'next/link'
import * as React from 'react'
import { translateText } from '@/lib/chinese'
import { getLocalizedPath } from '@/lib/utils'
import { ItemSprite } from './items-layout'

export function ItemDetailView({
  activeItem,
  locale,
}: {
  activeItem: FlattenedItem
  locale: string
}) {
  return (
    <div className="relative h-full flex flex-col">
      {/* Mobile Back Button */}
      <div className="md:hidden p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 bg-white/75 dark:bg-zinc-950/75 backdrop-blur-md sticky top-0 z-20">
        <Link
          prefetch={false}
          href={getLocalizedPath('/items', locale)}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-zinc-600 dark:text-zinc-400"
        >
          <span>←</span>
          {' '}
          {translateText('返回物品列表', locale)}
        </Link>
      </div>

      {/* Content view */}
      <div className="p-4 md:p-6 lg:p-8 max-w-3xl mx-auto w-full space-y-6 animate-in fade-in duration-200">
        {/* Header profile block */}
        <div
          className="rounded-3xl border border-zinc-200/40 dark:border-zinc-800/40 overflow-hidden shadow-lg relative flex flex-col md:flex-row gap-4 p-4 md:p-6 items-center md:items-start"
          style={{ background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.05), rgba(239, 68, 68, 0.12))' }}
        >
          <div className="absolute inset-0 bg-white/45 dark:bg-zinc-950/45 backdrop-blur-xl -z-10" />

          {/* Big Icon */}
          <div className="shrink-0 flex items-center justify-center w-24 h-24 rounded-2xl bg-white/80 dark:bg-zinc-900/80 shadow-md border border-white dark:border-zinc-800/50">
            <ItemSprite name={activeItem.name_zh} icon={activeItem.icon} size={64} />
          </div>

          {/* Info Text */}
          <div className="flex-1 space-y-3.5 text-center md:text-left min-w-0 w-full">
            <div className="flex flex-wrap justify-center md:justify-start items-center gap-2">
              <span className="px-3 py-0.5 text-[10px] font-bold rounded-full bg-red-500/10 dark:bg-red-500/20 text-red-500 border border-red-500/10">
                {translateText('道具物品', locale)}
              </span>
              <span className="text-[10px] font-bold text-zinc-400 dark:text-zinc-500 flex items-center gap-1">
                <TagIcon className="w-3.5 h-3.5" />
                {activeItem.categoryPath.map((pathName, index) => {
                  const isLast = index === activeItem.categoryPath.length - 1
                  return (
                    <span key={pathName} className="flex items-center gap-1">
                      <span>
                        {translateText(pathName, locale)}
                      </span>
                      {!isLast && <span className="opacity-50">&gt;</span>}
                    </span>
                  )
                })}
              </span>
            </div>

            <div className="space-y-1">
              <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-900 dark:text-zinc-50">
                {translateText(activeItem.name_zh, locale)}
              </h1>
              <p className="text-xs font-semibold text-zinc-400 dark:text-zinc-500">
                {activeItem.name_en}
                {' '}
                ·
                {activeItem.name_ja}
              </p>
            </div>
          </div>
        </div>

        {/* Descriptions & Variants */}
        <div className="bg-white dark:bg-zinc-950 p-6 md:p-8 rounded-3xl border border-zinc-200/50 dark:border-zinc-800/50 shadow-sm space-y-4">
          <h3 className="font-bold text-base tracking-tight flex items-center gap-2">
            <InfoIcon className="w-5 h-5 text-zinc-400" />
            {translateText('物品效果描述', locale)}
          </h3>

          {Array.isArray(activeItem.icon) && activeItem.icon.length > 1
            ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {activeItem.icon.map((ic, idx) => {
                    const variantDesc = Array.isArray(activeItem.description)
                      ? activeItem.description[idx]
                      : activeItem.description
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center gap-3.5 p-4 rounded-2xl border border-zinc-155 dark:border-zinc-900 bg-zinc-50/40 dark:bg-zinc-900/20"
                      >
                        <div className="flex items-center justify-center w-14 h-14 rounded-xl bg-white dark:bg-zinc-900/60 shadow-sm">
                          <ItemSprite name={activeItem.name_zh} icon={ic} size={40} />
                        </div>
                        <p className="text-xs font-semibold leading-relaxed text-center text-zinc-700 dark:text-zinc-300">
                          {translateText(variantDesc || '', locale)}
                        </p>
                      </div>
                    )
                  })}
                </div>
              )
            : (
                <div className="p-4.5 rounded-2xl bg-zinc-50/50 dark:bg-zinc-900/25 border border-zinc-100 dark:border-zinc-900/20 leading-relaxed font-semibold text-sm text-zinc-800 dark:text-zinc-200">
                  {translateText(
                    (Array.isArray(activeItem.description)
                      ? activeItem.description[0]
                      : activeItem.description) || '',
                    locale,
                  )}
                </div>
              )}
        </div>
      </div>
    </div>
  )
}

export function ItemEmptyView({ locale }: { locale: string }) {
  return (
    <div className="hidden md:flex h-full flex-col items-center justify-center p-8 text-center bg-zinc-50/50 dark:bg-zinc-900/5 animate-in fade-in">
      <div className="w-16 h-16 rounded-2xl bg-zinc-100 dark:bg-zinc-900 flex items-center justify-center shadow-sm text-zinc-400 border border-zinc-200/50">
        🎒
      </div>
      <p className="text-sm font-bold text-zinc-400 dark:text-zinc-500 mt-4">
        {translateText('请在左侧列表选择物品以查看详情', locale)}
      </p>
    </div>
  )
}
