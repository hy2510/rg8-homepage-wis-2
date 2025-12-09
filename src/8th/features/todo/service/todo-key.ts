export const todoKeys = {
  root: () => ['todo'] as const,
  list: (params?: Record<string, unknown>) =>
    params ? (['todo', 'list', params] as const) : (['todo', 'list'] as const),
}
