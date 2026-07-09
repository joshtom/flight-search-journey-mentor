import { type TUiClassMap } from './types'

const focusRing =
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-stone-900 focus-visible:ring-offset-2 focus-visible:ring-offset-stone-50'

const interactiveMotion = 'transition duration-200 ease-out'

export const uiClasses = {
  page: {
    shell:
      'min-h-screen bg-[radial-gradient(circle_at_top_left,#fff7ed_0,#fafaf9_34%,#f5f5f4_100%)] px-4 py-6 text-stone-950 sm:px-6 lg:px-8',
    container: 'mx-auto flex w-full max-w-6xl flex-col gap-6 sm:gap-8',
    eyebrow: 'text-xs font-semibold uppercase tracking-[0.18em] text-stone-500',
    title: 'max-w-3xl text-3xl font-semibold tracking-normal text-stone-950 sm:text-5xl',
    subtitle: 'max-w-2xl text-base leading-7 text-stone-600 sm:text-lg',
    section: 'grid gap-4 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] lg:items-start',
  },
  hero: {
    base: 'flex flex-col items-center justify-center gap-3 pt-6 sm:pt-10',
    // eyebrow: 'text-xs font-semibold uppercase tracking-[0.18em] text-stone-500',
    title: 'max-w-3xl text-3xl font-semibold tracking-normal text-stone-950 sm:text-5xl text-center',
    subtitle: 'max-w-2xl text-base leading-7 text-stone-600 sm:text-lg text-center',
  },
  card: {
    base: 'rounded-3xl border border-stone-200/80 bg-white/90 shadow-[0_18px_60px_rgba(28,25,23,0.08)] backdrop-blur',
    elevated:
      'rounded-3xl border border-stone-200 bg-white shadow-[0_24px_80px_rgba(28,25,23,0.12)]',
    compact: 'rounded-2xl border border-stone-200 bg-white p-4 shadow-sm',
  },
  button: {
    primary: [
      'inline-flex min-h-12 items-center justify-center rounded-full bg-stone-950 px-6 text-sm font-semibold text-white shadow-sm',
      'hover:bg-stone-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-stone-300',
      focusRing,
      interactiveMotion,
    ].join(' '),
    secondary: [
      'inline-flex min-h-11 items-center justify-center rounded-full border border-stone-300 bg-white px-5 text-sm font-semibold text-stone-800',
      'hover:border-stone-400 hover:bg-stone-50 active:scale-[0.99] disabled:cursor-not-allowed disabled:text-stone-400',
      focusRing,
      interactiveMotion,
    ].join(' '),
    ghost: [
      'inline-flex min-h-10 items-center justify-center rounded-full px-4 text-sm font-medium text-stone-600',
      'hover:bg-stone-100 hover:text-stone-950 active:scale-[0.99]',
      focusRing,
      interactiveMotion,
    ].join(' '),
  },
  input: {
    group: 'flex flex-col gap-2',
    label: 'text-xs font-semibold uppercase tracking-[0.14em] text-stone-500',
    field: [
      'min-h-12 w-full rounded-2xl border border-stone-200 bg-stone-50/80 px-4 text-sm font-medium text-stone-950 placeholder:text-stone-400',
      'hover:border-stone-300 hover:bg-white disabled:cursor-not-allowed disabled:text-stone-400',
      focusRing,
      interactiveMotion,
    ].join(' '),
    select: [
      'min-h-12 w-full rounded-2xl border border-stone-200 bg-stone-50/80 px-4 text-sm font-medium text-stone-950',
      'hover:border-stone-300 hover:bg-white disabled:cursor-not-allowed disabled:text-stone-400',
      focusRing,
      interactiveMotion,
    ].join(' '),
    hint: 'text-xs leading-5 text-stone-500',
  },
  badge: {
    neutral:
      'inline-flex items-center rounded-full bg-stone-100 px-3 py-1 text-xs font-medium text-stone-700',
    accent:
      'inline-flex items-center rounded-full bg-rose-50 px-3 py-1 text-xs font-semibold text-rose-700',
    success:
      'inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 text-xs font-semibold text-emerald-700',
    warning:
      'inline-flex items-center rounded-full bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700',
  },
  resultCard: {
    base: [
      'rounded-3xl border border-stone-200 bg-white p-5 shadow-sm',
      'hover:-translate-y-0.5 hover:border-stone-300 hover:shadow-[0_18px_48px_rgba(28,25,23,0.10)]',
      interactiveMotion,
    ].join(' '),
    header: 'flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between',
    route: 'text-lg font-semibold text-stone-950',
    meta: 'text-sm leading-6 text-stone-500',
    price: 'text-2xl font-semibold text-stone-950',
  },
  filterChip: {
    base: [
      'inline-flex min-h-10 items-center justify-center rounded-full border px-4 text-sm font-semibold',
      'active:scale-[0.99]',
      focusRing,
      interactiveMotion,
    ].join(' '),
    active: 'border-stone-950 bg-stone-950 text-white shadow-sm',
    inactive: 'border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50',
  },
  state: {
    base: 'rounded-3xl border p-6 text-sm leading-6',
    loading: 'border-sky-100 bg-sky-50 text-sky-800',
    empty: 'border-stone-200 bg-white text-stone-600',
    error: 'border-rose-100 bg-rose-50 text-rose-800',
  },
  modal: {
    backdrop: 'fixed inset-0 z-50 grid place-items-end bg-stone-950/30 p-3 sm:place-items-center',
    panel:
      'w-full max-w-lg rounded-3xl border border-stone-200 bg-white p-5 shadow-[0_28px_90px_rgba(28,25,23,0.24)]',
    header: 'flex items-start justify-between gap-4',
    title: 'text-lg font-semibold text-stone-950',
    body: 'mt-4 text-sm leading-6 text-stone-600',
    closeButton: [
      'inline-flex size-10 items-center justify-center rounded-full text-stone-500',
      'hover:bg-stone-100 hover:text-stone-950',
      focusRing,
      interactiveMotion,
    ].join(' '),
  },
} as const satisfies TUiClassMap
