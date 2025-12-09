export const accountKeys = {
  root: () => ['account'] as const,
  classGroupList: () => ['account', 'class-group', 'list'] as const,
  classList: (params: { classGroupId: string }) =>
    ['account', 'class', 'list', params] as const,
  logout: () => ['account', 'logout'] as const,
}
export type AccountKeys = typeof accountKeys
