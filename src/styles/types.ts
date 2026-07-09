type TUiClassMap = {
  page: {
    shell: string
    container: string
    eyebrow: string
    title: string
    subtitle: string
    section: string
  }
  hero: {
    base: string
    eyebrow?: string
    title: string
    subtitle: string
  }
  card: {
    base: string
    elevated: string
    compact: string
  }
  button: {
    primary: string
    secondary: string
    ghost: string
  }
  input: {
    group: string
    label: string
    field: string
    invalidField: string
    select: string
    invalidSelect: string
    hint: string
    error: string
  }
  badge: {
    neutral: string
    accent: string
    success: string
    warning: string
  }
  resultCard: {
    base: string
    header: string
    route: string
    meta: string
    price: string
  }
  filterChip: {
    base: string
    active: string
    inactive: string
  }
  state: {
    base: string
    loading: string
    empty: string
    error: string
  }
  modal: {
    backdrop: string
    panel: string
    widePanel: string
    header: string
    title: string
    body: string
    footer: string
    closeButton: string
  }
}

export type { TUiClassMap }
